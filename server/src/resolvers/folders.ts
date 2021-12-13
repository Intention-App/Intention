import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { getManager, getRepository, IsNull } from "typeorm";
import { ExpressContext } from "../types";
import Entry from "../entities/Entry";
import Folder from "../entities/Folder";

@InputType()
class FolderOptionsInput {
    @Field({ nullable: true })
    folderId: string;
    @Field({ nullable: true })
    title: string;
}

// Folder path
@ObjectType()
class PathResponse {
    @Field()
    title: string;

    @Field()
    id: string;
}

/*
    Resolvers
*/

const relations = ["folders", "entries"];

@Resolver()
export default class FolderResolver {

    // Get all folders
    @Query(() => [Folder], { description: "DEV TOOL | Get all folders" })
    async folders(): Promise<Folder[]> {
        return await Folder.find({ order: { updatedAt: "DESC" }, relations });
    }

    // Get specific folder by ID
    @Query(() => Folder, { description: "DEV TOOL | Get a specific folder by ID" })
    async folder(
        @Arg("id") id: string
    ): Promise<Folder | undefined> {
        return await Folder.findOne({ where: { id }, relations });
    }

    // Get all folders of an authenticated user
    @Query(() => [Folder], { description: "Get all folders of an authenticated user" })
    @UseMiddleware(isAuth)
    async myFolders(
        @Ctx() { req }: ExpressContext,
        @Arg("rootFolderId", { nullable: true }) rootFolderId: string
    ): Promise<Folder[]> {

        if (rootFolderId) return await Folder.find({ order: { updatedAt: "DESC" }, where: { userId: req.session.userId, rootFolderId }, relations })

        // rootFolderId was not specified
        // Return main root directory folders
        return await Folder.find({ order: { updatedAt: "DESC" }, where: { userId: req.session.userId, rootFolderId: IsNull() }, relations })
    }

    // Get folder by ID of an authenticated user
    @Query(() => Folder, { description: "Get a specific folder by ID of an authenticated user" })
    @UseMiddleware(isAuth)
    async myFolder(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Folder | undefined> {
        return await Folder.findOne({ where: { userId: req.session.userId, id }, relations })
    }

    // Get folder by ID of an authenticated user
    @Query(() => [PathResponse], { description: "Get a specific folder by ID of an authenticated user" })
    @UseMiddleware(isAuth)
    async folderPath(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<PathResponse[] | undefined> {
        // #WIP: check if this is the best way of finding path

        // Find folder, return undefined if not found
        const folder = await Folder.findOne({ where: { userId: req.session.userId, id }, relations });
        if (!folder) return undefined;

        // TypeORM to get trees and fetch folder path
        const manager = getManager();
        const repository = await manager.getTreeRepository(Folder);

        // Gets ancestor tree of folders
        const ancestorTree = await repository.findAncestorsTree(folder);

        // Recursively reads parent folder to get info and returns path of folder
        const recursiveRead = (folder: Folder): PathResponse[] => {
            const folderInfo = {
                title: folder.title,
                id: folder.id
            };

            if (!folder.rootFolder) return [folderInfo];

            return [...recursiveRead(folder.rootFolder), folderInfo];
        };

        return recursiveRead(ancestorTree);
    }

    // Create a new folder
    @Mutation(() => Folder, { description: "Create a new folder" })
    @UseMiddleware(isAuth)
    async createFolder(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: FolderOptionsInput
    ): Promise<Folder> {

        const folder = await Folder.create({
            userId: req.session.userId,
            title: options.title
        })
        
        // Do it this way to ensure tree structure is properly established
        folder.rootFolder = await Folder.findOne({ where: { userId: req.session.userId, id: options.folderId }, relations });
        
        folder.save();

        return folder;
    }

    // Delete a folder
    @Mutation(() => String, { nullable: true, description: "Delete a folder by id" })
    @UseMiddleware(isAuth)
    async deleteFolder(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("explode", { defaultValue: false }) explode: boolean
    ): Promise<string | null> {

        const folder = await Folder.findOne({ id })

        if (!folder) return null;

        const parentRootFolderId = folder.rootFolderId;

        try {

            if (explode) {
                // Redirect all items within the folder to its root folder to prevent unintended item loss
                await getRepository(Entry).createQueryBuilder()
                    .update()
                    .set({ rootFolderId: parentRootFolderId })
                    .where(`rootFolderId = :rootFolderId`, { rootFolderId: id })
                    .execute();
                await getRepository(Folder).createQueryBuilder()
                    .update()
                    .set({ rootFolderId: parentRootFolderId })
                    .where(`rootFolderId = :rootFolderId`, { rootFolderId: id })
                    .execute();
            }


            await Folder.delete({ id, userId: req.session.userId })
        }
        catch {
            return null;
        }

        // Returns parent directory
        return parentRootFolderId;
    }

    // Update folder
    @Mutation(() => Folder, { description: "Update a folder by id" })
    @UseMiddleware(isAuth)
    async updateFolder(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("options") options: FolderOptionsInput
    ): Promise<Folder | undefined> {

        const folder = await Folder.findOne({ id, userId: req.session.userId })

        if (!folder) return undefined;

        if (typeof options.title !== "undefined") {
            await Folder.update({ id }, { title: options.title })
        }

        if (typeof options.folderId !== "undefined") {
            await Folder.update({ id }, { rootFolderId: options.folderId })
        }

        return await Folder.findOne({ where: { id, userId: req.session.userId }, relations });
    }
}