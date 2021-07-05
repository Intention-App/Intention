import { Entry } from "../entities/Entry";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { GraphQLJSON } from 'graphql-type-json';
import { isAuth } from "../middleware/isAuth";
import { IsNull } from "typeorm";

@InputType()
class EntryOptionsInput {
    @Field({ nullable: true })
    title: string;
    @Field(() => GraphQLJSON, { nullable: true })
    content: {}[];
    @Field(() => Int, { nullable: true })
    folderId: number;
}

@Resolver()
export class EntryResolver {
    @Query(() => [Entry])
    entries(): Promise<Entry[]> {
        return Entry.find({});
    }

    @Query(() => Entry)
    entry(
        @Arg("id") id: number
    ): Promise<Entry | undefined> {
        return Entry.findOne({id});
    }

    @Query(() => [Entry])
    @UseMiddleware(isAuth)
    myEntries(
        @Ctx() { req }: MyContext,
        @Arg("rootFolderId", () => Int, {nullable: true}) rootFolderId: number
    ): Promise<Entry[]> {
        if (rootFolderId) {
            return Entry.find({ userId: req.session.userId, rootFolderId });
        }
        return Entry.find({ userId: req.session.userId, rootFolderId: IsNull() });
    }

    @Query(() => Entry)
    @UseMiddleware(isAuth)
    myEntry(
        @Ctx() { req }: MyContext,
        @Arg("id", () => Int) id: number
    ): Promise<Entry | undefined> {
        return Entry.findOne({ id, userId: req.session.userId });
    }

    @Mutation(() => Entry)
    @UseMiddleware(isAuth)
    async createEntry(
        @Ctx() { req }: MyContext,
        @Arg("options") options: EntryOptionsInput
    ): Promise<Entry> {

        return Entry.create({
            userId: req.session.userId,
            title: options.title,
            content: options.content,
            rootFolderId: options.folderId,
        }).save();

    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteEntry(
        @Ctx() { req }: MyContext,
        @Arg("id", () => Int) id: number,
    ): Promise<Boolean> {
        try {
            Entry.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }

        return true;
    }

    @Mutation(() => Entry)
    @UseMiddleware(isAuth)
    async updateEntry(
        @Ctx() { req }: MyContext,
        @Arg("id", () => Int) id: number,
        @Arg("options") options: EntryOptionsInput
    ): Promise<Entry | undefined> {

        const entry = await Entry.findOne({ id, userId: req.session.userId })

        if (!entry) {
            return undefined;
        }

        if (typeof options.title !== "undefined") {
            Entry.update({ id }, { title: options.title })
        }

        if (typeof options.content !== "undefined") {
            Entry.update({ id }, { content: options.content })
        }

        if (typeof options.folderId !== "undefined") {
            Entry.update({ id }, { rootFolderId: options.folderId })
        }

        return await Entry.findOne({ id, userId: req.session.userId });
    }
}