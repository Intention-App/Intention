import { ExpressContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { IsNull } from "typeorm";
import Entry from "../entities/Entry";

@InputType()
class EntryOptionsInput {
    @Field({ nullable: true })
    title: string;
    @Field({ nullable: true })
    content: string;
    @Field({ nullable: true })
    folderId: string;
}

@Resolver()
export default class EntryResolver {

    // Get all entries
    @Query(() => [Entry], { description: "DEV TOOL | Get all entries" })
    async entries(): Promise<Entry[]> {
        return await Entry.find({ order: { updatedAt: "DESC" } });
    }

    // Get specific entry by ID
    @Query(() => Entry, { description: "DEV TOOL | Get a specific entry by ID" })
    async entry(
        @Arg("id") id: string
    ): Promise<Entry | undefined> {
        return await Entry.findOne({ id });
    }

    // Get all entries of an authenticated user
    @Query(() => [Entry], { description: "Get all entries of an authenticated user" })
    @UseMiddleware(isAuth)
    async myEntries(
        @Ctx() { req }: ExpressContext,
        @Arg("rootFolderId", { nullable: true }) rootFolderId: string
    ): Promise<Entry[]> {

        if (rootFolderId) return await Entry.find({ order: { updatedAt: "DESC" }, where: { userId: req.session.userId, rootFolderId } });

        // In case rootFolderId is not specified
        // Return the entries on the main root
        return await Entry.find({ order: { updatedAt: "DESC" }, where: { userId: req.session.userId, rootFolderId: IsNull() } });
    }

    // Get a specifc entry by id of an authenticated user
    @Query(() => Entry, { description: "Get a specific entry by id of an authenticated used" })
    @UseMiddleware(isAuth)
    async myEntry(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Entry | undefined> {
        return await Entry.findOne({ id, userId: req.session.userId });
    }

    // Create a new entry
    @Mutation(() => Entry, { description: "Create a new entry" })
    @UseMiddleware(isAuth)
    async createEntry(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: EntryOptionsInput
    ): Promise<Entry> {

        return await Entry.create({
            userId: req.session.userId,
            title: options.title,
            content: options.content,
            rootFolderId: options.folderId,
        }).save();

    }

    // Delete an entry by id
    @Mutation(() => String, {nullable: true, description: "Delete a specific entry by id" })
    @UseMiddleware(isAuth)
    async deleteEntry(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<String | undefined> {

        try {
            await Entry.delete({ id, userId: req.session.userId })
        }
        catch {
            return undefined;
        }

        return id;
    }

    // Update a specific existing entry
    @Mutation(() => Entry, { description: "Update a specific existing entry" })
    @UseMiddleware(isAuth)
    async updateEntry(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("options") options: EntryOptionsInput
    ): Promise<Entry | undefined> {

        const entry = await Entry.findOne({ id, userId: req.session.userId })

        if (!entry) return undefined;

        if (typeof options.title !== "undefined") {
            await Entry.update({ id }, { title: options.title })
        }

        if (typeof options.content !== "undefined") {
            await Entry.update({ id }, { content: options.content })
        }

        if (typeof options.folderId !== "undefined") {
            await Entry.update({ id }, { rootFolderId: options.folderId })
        }

        return await Entry.findOne({ id, userId: req.session.userId });
    }
}