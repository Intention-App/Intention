import Tasklist from "../entities/Tasklist";
import { isAuth } from "../middleware/isAuth";
import { ExpressContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import Board from "../entities/Board";

@InputType()
class TasklistOptionsInput {
    @Field({ nullable: true })
    title: string;
    @Field({ nullable: true })
    color: string;
}

@InputType()
class CreateTasklistOptionsInput extends TasklistOptionsInput {
    @Field({ nullable: false })
    boardId: string;
}

@InputType()
class MoveTasklistInput {
    @Field({ nullable: true })
    prevTasklistId?: string;
    @Field({ nullable: true })
    nextTasklistId?: string;
}

/*
    Resolver
*/

const relations = ["tasks", "board"];

@Resolver()
export default class TasklistResolver {

    // Get all tasklists
    @Query(() => [Tasklist], { description: "DEV TOOL | Get all tasklists" })
    async tasklists(): Promise<Tasklist[] | undefined> {
        return await Tasklist.find({ where: {}, relations });
    }
    
    // Get specific tasklist by id
    @Query(() => Tasklist, { description: "DEV TOOL | Get specific tasklist by ID" })
    async tasklist(
        @Arg("id") id: string
    ): Promise<Tasklist | undefined> {
        return await Tasklist.findOne({ where: { id }, relations });
    }

    // Get user's tasklists
    @Query(() => [Tasklist], { description: "Get user's tasklists" })
    @UseMiddleware(isAuth)
    async myTasklists(
        @Ctx() { req }: ExpressContext
    ): Promise<Tasklist[]> {
        return await Tasklist.find({ where: { userId: req.session.userId }, relations });
    }

    // Get user's specific tasklist by id
    @Query(() => Tasklist, { description: "Get user's specific tasklist by id" })
    @UseMiddleware(isAuth)
    async myTasklist(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Tasklist | undefined> {
        return await Tasklist.findOne({ where: { id, userId: req.session.userId }, relations });
    }

    // Create new tasklist
    @Mutation(() => Tasklist, { description: "Create a new tasklist" })
    @UseMiddleware(isAuth)
    async createTasklist(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: CreateTasklistOptionsInput
    ): Promise<Tasklist> {

        const board = await Board.findOne({ id: options.boardId, userId: req.session.userId });
        if (!board) {
            throw new Error("Board does not exist")
        }

        const tasklist = await Tasklist.create({
            userId: req.session.userId,
            ...options
        }).save();

        await Board.update({ id: board.id }, { tasklistOrder: [...(board.tasklistOrder ? board.tasklistOrder : []), tasklist.id] });

        return tasklist;
    }

    // Delete specific user's tasklist
    @Mutation(() => Boolean, { description: "Delete a specific tasklist"})
    @UseMiddleware(isAuth)
    async deleteTasklist(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Boolean> {
        try {
            // Find specific tasklist
            const tasklist = await Tasklist.findOne({ where: { id, userId: req.session.userId } });

            if (!tasklist) return false; // No tasklist was found

            // Remove tasklist ID from board
            const tasklistIndex = tasklist.board.tasklistOrder.indexOf(id);
            if (tasklistIndex !== -1) tasklist.board.tasklistOrder.splice(tasklistIndex, 1);

            // Finally, update the board and delete the tasklist
            await Board.update({ id: tasklist.boardId }, { tasklistOrder: tasklist.board.tasklistOrder });
            await Tasklist.delete({ id })
        }
        catch { return false; }
        return true;
    }

    // Update a user's specific tasklist
    @Mutation(() => Tasklist)
    @UseMiddleware(isAuth)
    async updateTasklist(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("options") options: TasklistOptionsInput
    ): Promise<Tasklist | undefined> {

        // Find the specific tasklist
        const tasklist = await Tasklist.findOne({ id, userId: req.session.userId })

        if (!tasklist) return undefined; // No tasklist was found with ID

        // Update title
        if (typeof options.title !== "undefined") {
            await Tasklist.update({ id }, { title: options.title })
        }

        // Update color
        if (typeof options.color !== "undefined") {
            await Tasklist.update({ id }, { color: options.color })
        }

        // Return updated tasklist
        return await Tasklist.findOne({ id, userId: req.session.userId });
    }

    // Change order of tasklists
    @Mutation(() => Tasklist)
    @UseMiddleware(isAuth)
    async moveTasklist(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("options") options: MoveTasklistInput
    ): Promise<Tasklist | undefined> {

        if (id === options.prevTasklistId || id === options.nextTasklistId) return undefined;

        // Find specific tasklist
        const tasklist = await Tasklist.findOne({ where: { id, userId: req.session.userId }, relations })

        if (!tasklist) return undefined;

        // Remove tasklist from the tasklistOrder array
        const oldTasklistIndex = tasklist.board.tasklistOrder.indexOf(id);
        tasklist.board.tasklistOrder.splice(oldTasklistIndex, 1);

        // Add 
        if (options.prevTasklistId && options.nextTasklistId) {
            const prevTasklistIndex = tasklist.board.tasklistOrder.indexOf(options.prevTasklistId);
            const nextTasklistIndex = tasklist.board.tasklistOrder.indexOf(options.nextTasklistId);

            if (prevTasklistIndex !== -1 && nextTasklistIndex !== -1 && nextTasklistIndex - prevTasklistIndex === 1) {
                tasklist.board.tasklistOrder.splice(nextTasklistIndex, 0, id)
            }
            else {
                return undefined;
            }
        }
        else if (!options.prevTasklistId && options.nextTasklistId) {
            const nextTasklistIndex = tasklist.board.tasklistOrder.indexOf(options.nextTasklistId);

            if (nextTasklistIndex === 0) {
                tasklist.board.tasklistOrder.unshift(id);
            }
            else {
                return undefined;
            }
        }
        else if (options.prevTasklistId && !options.nextTasklistId) {
            const prevTasklistIndex = tasklist.board.tasklistOrder.indexOf(options.prevTasklistId);

            if (prevTasklistIndex === tasklist.board.tasklistOrder.length - 1) {
                tasklist.board.tasklistOrder.push(id);
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }

        // Update tasklistorder for the board
        await Board.update({ id: tasklist.boardId }, { tasklistOrder: tasklist.board.tasklistOrder })

        // Return updated tasklist
        return await Tasklist.findOne({ where: { id, userId: req.session.userId }, relations });
    }
}