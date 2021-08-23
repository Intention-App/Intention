import { ExpressContext, PendingCache } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import Board from "../entities/Board";
import Task  from "../entities/Task";
import Tasklist from "../entities/Tasklist";

@InputType()
class BoardOptionsInput {
    @Field({ nullable: true })
    title: string;
}

@InputType()
class TasklistInput {
    @Field()
    id: string;

    @Field(() => [String])
    taskOrder: string[];
}

/*
    Resolver
*/

const relations = ["tasklists", "tasks"];

@Resolver()
export default class BoardResolver {

    // Get all boards
    @Query(() => [Board], { description: "DEV TOOL | Get all boards" })
    async boards(): Promise<Board[] | undefined> {
        return await Board.find({ where: {}, relations })
    }

    // Get specific board by ID
    @Query(() => Board, { description: "DEV TOOL | Get specific board by ID" })
    async board(
        @Arg("id") id: string
    ): Promise<Board | undefined> {
        return await Board.findOne({ where: { id }, relations })
    }

    // Get user boards
    @Query(() => [Board], { description: "Get all the user's boards" })
    @UseMiddleware(isAuth)
    async myBoards(
        @Ctx() { req }: ExpressContext
    ): Promise<Board[] | undefined> {
        return await Board.find({ where: { userId: req.session.userId }, relations: ["tasklists"] })
    }

    // Get specific user board by ID
    @Query(() => Board, { description: "Get a specific user's board" })
    @UseMiddleware(isAuth)
    async myBoard(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Board | undefined> {
        return await Board.findOne({ where: { id, userId: req.session.userId }, relations: ["tasklists"] })
    }

    // Create new board for user
    @Mutation(() => Board, { description: "Create a new board" })
    @UseMiddleware(isAuth)
    async createBoard(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: BoardOptionsInput
    ): Promise<Board> {

        return await Board.create({
            userId: req.session.userId, // Add user id
            ...options
        }).save();
    }

    // Delete board for user
    @Mutation(() => Boolean, { description: "Delete a board by id" })
    @UseMiddleware(isAuth)
    async deleteBoard(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Boolean> {

        try {
            await Board.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }
        return true
    }

    // Change title and other settings of board for user
    @Mutation(() => Board, { description: "Update a board by id" })
    @UseMiddleware(isAuth)
    async updateBoard(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string, // Id of board
        @Arg("options") options: BoardOptionsInput // { title }
    ): Promise<Board | undefined> {

        // Get board
        const board = await Board.findOne({ id, userId: req.session.userId })

        // If no board found, return undifined
        if (!board) return undefined;

        // Update title of board if valid
        if (typeof options.title !== "undefined") await Board.update({ id }, { title: options.title })

        return await Board.findOne({ where: { id, userId: req.session.userId }, relations: ["tasklists"] });
    }

    // To optimize and clean
    @Mutation(() => Board)
    @UseMiddleware(isAuth)
    async updateOrder(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("tasklists", () => [TasklistInput]) tasklistsInput: TasklistInput[],
        @Arg("tasklistOrder", () => [String], { nullable: true }) tasklistOrder: string[]
    ): Promise<Board | undefined> {

        // Find relevant board

        const board = await Board.findOne({ where: { id: id, userId: req.session.userId }, relations })

        if (!board) return undefined;

        // Update new tasklist order if provided
        if (tasklistsInput) {

            const newTasklistOrder = tasklistOrder
            .concat(board.tasklistOrder)
            .filter((tasklistId, index, arr) => {
                // Handle and filter duplicates, imposters, and missing tasks
                return arr.indexOf(tasklistId) === index && board.tasklistOrder.includes(tasklistId)
            });

            await Board.update({ id: id }, { tasklistOrder: newTasklistOrder });
        }

        // Update new task order
        // Create temporary pending tasks to keep original taskId with tasklistId
        var pendingTasks: PendingCache[] = board.tasks.map(task => ({ id: task.id, value: task.tasklistId }))

        for (const {id, taskOrder} of tasklistsInput) {

            const tasklist = board.tasklists.find(tasklist => tasklist.id === id); 

            if (!tasklist) continue; // if tasklist is invalid, go to next task list

            // New task order for a specific tasklist
            var newTaskOrder: string[] = [];

            // Update the related tasklist of each task
            for (const taskId of taskOrder) {
                const task = board.tasks.find(t => t.id === taskId);

                if (!task) continue;

                // Remmove from pending tasks list
                const pendingTask = pendingTasks.find(pendingTask => pendingTask.id === taskId);
                if (pendingTask) pendingTasks.splice(pendingTasks.indexOf(pendingTask), 1)

                newTaskOrder.push(taskId);
                if (task.tasklistId !== id) await Task.update({ id: taskId }, { tasklistId: id })
            }

            await Tasklist.update({ id }, { taskOrder: newTaskOrder })
        }

        // Add back any missing tasks from the order lists
        for (const pendingTask of pendingTasks) {
            const tasklist = board.tasklists.find(tasklist => tasklist.id === pendingTask.value);
            if (!tasklist) continue;
            var newTaskOrder = tasklist.taskOrder;
            newTaskOrder.push(pendingTask.id);

            await Tasklist.update({ id: tasklist.id }, { taskOrder: newTaskOrder })
        }

        // TODO: Handle tasks that did not get assigned in the order lists

        return await Board.findOne({ where: { id: id, userId: req.session.userId }, relations });
    }
}