import { Folder } from "../entities/Folder";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { getRepository, IsNull } from "typeorm";
import { Entry } from "../entities/Entry";

@InputType()
class FolderOptionsInput {
    @Field({ nullable: true })
    folderId: string;
    @Field({ nullable: true })
    title: string;
}

@Resolver()
export class FolderResolver {
    @Query(() => [Folder])
    folders(): Promise<Folder[]> {
        return Folder.find({ order: { updatedAt: "DESC" } });
    }

    @Query(() => Folder)
    folder(
        @Arg("id") id: string
    ): Promise<Folder | undefined> {
        return Folder.findOne({ id });
    }

    @Query(() => [Folder])
    @UseMiddleware(isAuth)
    async myFolders(
        @Ctx() { req }: MyContext,
        @Arg("rootFolderId", { nullable: true }) rootFolderId: string
    ): Promise<Folder[]> {
        if (rootFolderId) {
            return await Folder.find({ order: { updatedAt: "DESC" }, where: { userId: req.session.userId, rootFolderId } })
        }
        return await Folder.find({ order: { updatedAt: "DESC" }, where: { userId: req.session.userId, rootFolderId: IsNull() } })
    }

    @Query(() => Folder)
    @UseMiddleware(isAuth)
    myFolder(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Folder | undefined> {
        return Folder.findOne({ where: { userId: req.session.userId, id }, relations: ["content", "children"] })
    }

    @Mutation(() => Folder)
    @UseMiddleware(isAuth)
    async createFolder(
        @Ctx() { req }: MyContext,
        @Arg("options") options: FolderOptionsInput
    ): Promise<Folder> {

        const folder = await Folder.create({
            userId: req.session.userId,
            rootFolderId: options.folderId,
            title: options.title
        }).save();

        return folder;
    }

    @Mutation(() => String, { nullable: true })
    @UseMiddleware(isAuth)
    async deleteFolder(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<string | null> {
        const folder = await Folder.findOne({ id })

        if (!folder) {
            return null;
        }

        try {
            // Redirect all items within the folder to its root folder to prevent unintended item loss
            getRepository(Entry).createQueryBuilder()
                .update()
                .set({ rootFolderId: folder.rootFolderId })
                .where(`rootFolderId = :rootFolderId`, { rootFolderId: id })
                .execute();
            getRepository(Folder).createQueryBuilder()
                .update()
                .set({ rootFolderId: folder.rootFolderId })
                .where(`rootFolderId = :rootFolderId`, { rootFolderId: id })
                .execute();

            Folder.delete({ id, userId: req.session.userId })
        }
        catch {
            return null;
        }

        return id;
    }

    @Mutation(() => Folder)
    @UseMiddleware(isAuth)
    async updateFolder(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("options") options: FolderOptionsInput
    ): Promise<Folder | undefined> {

        const folder = await Folder.findOne({ id, userId: req.session.userId })

        if (!folder) {
            return undefined;
        }

        if (typeof options.title !== "undefined") {
            Folder.update({ id }, { title: options.title })
        }

        if (typeof options.folderId !== "undefined") {
            Folder.update({ id }, { rootFolderId: options.folderId })
        }

        return await Folder.findOne({ id, userId: req.session.userId });
    }
}