import Task from "../entities/Task";
import { ExpressContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import Tasklist from "../entities/Tasklist";

@InputType()
class TaskOptionsInput {
    @Field({ nullable: true })
    title: string;
    @Field({ nullable: true })
    description: string;
    @Field({ nullable: true })
    dueAt: Date;
}

@InputType()
class CreateTaskOptionsInput extends TaskOptionsInput {
    @Field({ nullable: false })
    tasklistId: string;
}

/*
    Resolver
*/

@Resolver()
export default class TaskResolver {

    // Get all taskts
    @Query(() => [Task], { description: "DEV TOOL | Get all tasks" })
    async tasks(): Promise<Task[]> {
        return await Task.find({});
    }

    // Get a specific task by ID
    @Query(() => Task)
    async task(
        @Arg("id") id: string
    ): Promise<Task | undefined> {
        return await Task.findOne({ id });
    }

    // Get all the user's tasks
    @Query(() => [Task])
    @UseMiddleware(isAuth)
    async myTasks(
        @Ctx() { req }: ExpressContext,
    ): Promise<Task[]> {
        return await Task.find({ where: { userId: req.session.userId } })
    }

    // Get a specific user's task
    @Query(() => Task)
    @UseMiddleware(isAuth)
    async myTask(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Task | undefined> {
        return await Task.findOne({ where: { userId: req.session.userId, id } })
    }

    @Mutation(() => Task)
    @UseMiddleware(isAuth)
    async createTask(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: CreateTaskOptionsInput
    ): Promise<Task> {
        
        // Find the specific tasklist
        const tasklist = await Tasklist.findOne({ id: options.tasklistId, userId: req.session.userId });
        if (!tasklist) {
            throw new Error("Tasklist does not exist")
        }

        // Create new task
        const task = await Task.create({
            userId: req.session.userId,
            boardId: tasklist.boardId,
            ...options
        }).save();

        // Update the task
        await Tasklist.update({ id: tasklist.id }, { taskOrder: [...(tasklist.taskOrder || []), task.id] });

        return task;
    }

    // Delete a specific task by ID
    @Mutation(() => Boolean, { nullable: true })
    @UseMiddleware(isAuth)
    async deleteTask(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string
    ): Promise<Boolean> {
        try {
            // Find specific task
            const task = await Task.findOne({where: { id, userId: req.session.userId } });

            if (!task) return false;

            // Remove task from tasklistorder
            const taskIndex = task.tasklist.taskOrder.indexOf(id);
            if (taskIndex !== -1) task.tasklist.taskOrder.splice(taskIndex, 1);

            // Delete & update task
            await Tasklist.update({ id: task.tasklistId }, { taskOrder: task.tasklist.taskOrder });
            await Task.delete({ id, userId: req.session.userId })
        }
        catch { return false; }
        return true;
    }

    // Update a specific tasklist by ID
    @Mutation(() => Task)
    @UseMiddleware(isAuth)
    async updateTask(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("options") options: TaskOptionsInput
    ): Promise<Task | undefined> {

        // Find specific task
        const task = await Task.findOne({ id, userId: req.session.userId })

        if (!task) return undefined;

        // Update title
        if (typeof options.title !== "undefined") {
            await Task.update({ id }, { title: options.title })
        }

        // Update description
        if (typeof options.description !== "undefined") {
            await Task.update({ id }, { description: options.description })
        }

        // Update dueAt
        if (typeof options.dueAt !== "undefined") {
            await Task.update({ id }, { dueAt: options.dueAt })
        }

        // Return updated task
        return await Task.findOne({ id, userId: req.session.userId });
    }

    // Archive specific task
    @Mutation(() => Task, { nullable: true })
    @UseMiddleware(isAuth)
    async archiveTask(
        @Ctx() { req }: ExpressContext,
        @Arg("id") id: string,
        @Arg("archive", { nullable: true }) archive?: boolean,
    ): Promise<Task | undefined> {

        // Find specific task
        const task = await Task.findOne({ where: { id, userId: req.session.userId } });

        if (!task) return undefined;

        if (typeof archive === "undefined" || archive) {

            // Remove task from tasklist
            const taskIndex = task.tasklist.taskOrder.indexOf(id);
            if (taskIndex !== -1) task.tasklist.taskOrder.splice(taskIndex, 1);
            
            await Tasklist.update({ id: task.tasklistId }, { taskOrder: task.tasklist.taskOrder });
            await Task.update({ id, userId: req.session.userId }, { archivedAt: new Date() });

            return await Task.findOne({ id });
        }
        else if (task.archivedAt) {

            await Tasklist.update({ id: task.tasklistId }, { taskOrder: [...(task.tasklist.taskOrder || []), task.id] });
            await Task.update({ id, userId: req.session.userId }, { archivedAt: null });

            return await Task.findOne({ id });
        }

        return undefined;
    }
}