import { Task } from "../entities/Task";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Tasklist } from "../entities/Tasklist";

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

@InputType()
class moveTaskInput {
    @Field({ nullable: true })
    tasklistId?: string;
    @Field({ nullable: true })
    prevTaskId?: string;
    @Field({ nullable: true })
    nextTaskId?: string;
}

@Resolver()
export class TaskResolver {
    @Query(() => [Task])
    tasks(): Promise<Task[]> {
        return Task.find({});
    }

    @Query(() => Task)
    task(
        @Arg("id") id: string
    ): Promise<Task | undefined> {
        return Task.findOne({ id });
    }

    @Query(() => [Task])
    @UseMiddleware(isAuth)
    async myTasks(
        @Ctx() { req }: MyContext,
    ): Promise<Task[]> {
        return await Task.find({ where: { userId: req.session.userId } })
    }

    @Query(() => Task)
    @UseMiddleware(isAuth)
    myTask(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Task | undefined> {
        return Task.findOne({ where: { userId: req.session.userId, id } })
    }

    @Mutation(() => Task)
    @UseMiddleware(isAuth)
    async createTask(
        @Ctx() { req }: MyContext,
        @Arg("options") options: CreateTaskOptionsInput
    ): Promise<Task> {

        const tasklist = await Tasklist.findOne({ id: options.tasklistId, userId: req.session.userId });
        if (!tasklist) {
            throw new Error("Tasklist does not exist")
        }

        const task = await Task.create({
            userId: req.session.userId,
            boardId: tasklist.boardId,
            ...options
        }).save();

        Tasklist.update({ id: tasklist.id }, { taskOrder: [...(tasklist.taskOrder || []), task.id] });

        return task;
    }

    @Mutation(() => Boolean, { nullable: true })
    @UseMiddleware(isAuth)
    async deleteTask(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Boolean> {
        try {
            const task = await Task.findOne({ id, userId: req.session.userId });

            if (!task) {
                return false;
            }

            const tasklist = await Tasklist.findOne({ id: task.tasklistId, userId: req.session.userId });

            if (!tasklist) {
                return false;
            }

            const taskIndex = tasklist.taskOrder.indexOf(id);
            if (taskIndex !== -1) tasklist.taskOrder.splice(taskIndex, 1);

            Tasklist.update({ id: tasklist.id }, { taskOrder: tasklist.taskOrder });
            Task.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }
        return true
    }

    @Mutation(() => Task)
    @UseMiddleware(isAuth)
    async updateTask(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("options") options: TaskOptionsInput
    ): Promise<Task | undefined> {

        const task = await Task.findOne({ id, userId: req.session.userId })

        if (!task) {
            return undefined;
        }

        if (typeof options.title !== "undefined") {
            Task.update({ id }, { title: options.title })
        }

        if (typeof options.description !== "undefined") {
            Task.update({ id }, { description: options.description })
        }

        if (typeof options.dueAt !== "undefined") {
            Task.update({ id }, { dueAt: options.dueAt })
        }

        return await Task.findOne({ id, userId: req.session.userId });
    }

    @Mutation(() => Task)
    @UseMiddleware(isAuth)
    async moveTask(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("options") options: moveTaskInput
    ): Promise<Task | undefined> {

        if (id === options.prevTaskId || id === options.nextTaskId) return undefined;

        const task = await Task.findOne({ id, userId: req.session.userId })

        if (!task) {
            return undefined;
        }

        if (typeof options.tasklistId !== "undefined" && task.tasklistId !== options.tasklistId) {

            const oldTasklist = await Tasklist.findOne({ id: task.tasklistId, userId: req.session.userId });
            const newTasklist = await Tasklist.findOne({ id: options.tasklistId, userId: req.session.userId });

            if (!oldTasklist || !newTasklist) return undefined;

            const oldTaskIndex = oldTasklist.taskOrder.indexOf(id);
            oldTasklist.taskOrder.splice(oldTaskIndex, 1);

            if (options.prevTaskId && options.nextTaskId) {
                const prevTaskIndex = newTasklist.taskOrder.indexOf(options.prevTaskId);
                const nextTaskIndex = newTasklist.taskOrder.indexOf(options.nextTaskId);

                if (prevTaskIndex !== -1 && nextTaskIndex !== -1 && nextTaskIndex - prevTaskIndex === 1) {
                    newTasklist.taskOrder.splice(nextTaskIndex, 0, id)
                }
                else {
                    return undefined;
                }
            }
            else if (!options.prevTaskId && options.nextTaskId) {
                const nextTaskIndex = newTasklist.taskOrder.indexOf(options.nextTaskId);

                if (nextTaskIndex === 0) {
                    newTasklist.taskOrder.unshift(id);
                }
                else {
                    return undefined;
                }
            }
            else if (options.prevTaskId && !options.nextTaskId) {
                const prevTaskIndex = newTasklist.taskOrder.indexOf(options.prevTaskId);

                if (prevTaskIndex === newTasklist.taskOrder.length - 1) {
                    newTasklist.taskOrder.push(id);
                }
                else {
                    return undefined;
                }
            }
            else {
                if (!newTasklist.taskOrder || newTasklist.taskOrder.length === 0) {
                    newTasklist.taskOrder = [id];
                }
                else {
                    return undefined;
                }
            }

            Tasklist.update({ id: oldTasklist.id }, { taskOrder: oldTasklist.taskOrder })
            Tasklist.update({ id: newTasklist.id }, { taskOrder: newTasklist.taskOrder })
            Task.update({ id }, { tasklistId: options.tasklistId })

            return await Task.findOne({ id, userId: req.session.userId });
        }


        const tasklist = await Tasklist.findOne({ id: task.tasklistId, userId: req.session.userId });

        if (!tasklist) return undefined;

        const oldTaskIndex = tasklist.taskOrder.indexOf(id);
        tasklist.taskOrder.splice(oldTaskIndex, 1);

        if (options.prevTaskId && options.nextTaskId) {
            const prevTaskIndex = tasklist.taskOrder.indexOf(options.prevTaskId);
            const nextTaskIndex = tasklist.taskOrder.indexOf(options.nextTaskId);

            if (prevTaskIndex !== -1 && nextTaskIndex !== -1 && nextTaskIndex - prevTaskIndex === 1) {
                tasklist.taskOrder.splice(nextTaskIndex, 0, id)
            }
            else {
                return undefined;
            }
        }
        else if (!options.prevTaskId && options.nextTaskId) {
            const nextTaskIndex = tasklist.taskOrder.indexOf(options.nextTaskId);

            if (nextTaskIndex === 0) {
                tasklist.taskOrder.unshift(id);
            }
            else {
                return undefined;
            }
        }
        else if (options.prevTaskId && !options.nextTaskId) {
            const prevTaskIndex = tasklist.taskOrder.indexOf(options.prevTaskId);

            if (prevTaskIndex === tasklist.taskOrder.length - 1) {
                tasklist.taskOrder.push(id);
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }

        Tasklist.update({ id: tasklist.id }, { taskOrder: tasklist.taskOrder })
        Task.update({ id }, { tasklistId: options.tasklistId })

        return await Task.findOne({ id, userId: req.session.userId });
    }

    @Mutation(() => Task, { nullable: true })
    @UseMiddleware(isAuth)
    async archiveTask(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("archive", { nullable: true }) archive?: boolean,
    ): Promise<Task | undefined> {
        const task = await Task.findOne({ id, userId: req.session.userId });

        if (!task) {
            return undefined;
        }

        const tasklist = await Tasklist.findOne({ id: task.tasklistId, userId: req.session.userId });

        if (!tasklist) {
            return undefined;
        }

        if (typeof archive === "undefined" || archive) {
            const taskIndex = tasklist.taskOrder.indexOf(id);
            if (taskIndex !== -1) tasklist.taskOrder.splice(taskIndex, 1);

            Tasklist.update({ id: tasklist.id }, { taskOrder: tasklist.taskOrder });
            Task.update({ id, userId: req.session.userId }, { archivedAt: new Date() });

            return await Task.findOne({ id });
        }
        else if (task.archivedAt) {

            Tasklist.update({ id: tasklist.id }, { taskOrder: [...(tasklist.taskOrder || []), task.id] });
            Task.update({ id, userId: req.session.userId }, { archivedAt: null });

            return await Task.findOne({ id });
        }

        return undefined;
    }
}