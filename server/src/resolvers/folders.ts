import { Folder } from "../entities/Folder";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { IsNull } from "typeorm";

@InputType()
class FolderOptionsInput {
    @Field(() => Int, { nullable: true })
    folderId: number;
    @Field({ nullable: true })
    title: string;
}

@Resolver()
export class FolderResolver {
    @Query(() => [Folder])
    folders(): Promise<Folder[]> {
        return Folder.find({});
    }

    @Query(() => Folder)
    folder(
        @Arg("id", () => Int) id: number
    ): Promise<Folder | undefined> {
        return Folder.findOne({ id });
    }

    @Query(() => [Folder])
    @UseMiddleware(isAuth)
    myFolders(
        @Ctx() { req }: MyContext,
        @Arg("rootFolderId", () => Int, { nullable: true }) rootFolderId: number
    ): Promise<Folder[]> {
        if (rootFolderId) {
            return Folder.find({ userId: req.session.userId, rootFolderId })
        }
        return Folder.find({ userId: req.session.userId, rootFolderId: IsNull() })
    }

    @Query(() => Folder)
    @UseMiddleware(isAuth)
    myFolder(
        @Ctx() { req }: MyContext,
        @Arg("id", () => Int) id: number
    ): Promise<Folder | undefined> {
        return Folder.findOne({ userId: req.session.userId, id })
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

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteFolder(
        @Ctx() { req }: MyContext,
        @Arg("id", () => Int) id: number,
    ): Promise<Boolean> {
        try {
            Folder.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }

        return true;
    }
}