import { Task } from "../entities/Task";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";

@InputType()
class TaskOptionsInput {
    @Field({ nullable: true })
    title: string;
    @Field({ nullable: true })
    description: string;
    @Field({ nullable: true })
    dueAt: Date;
    @Field({ nullable: true })
    archived: boolean;
    @Field({ nullable: true })
    tasklistId: string;
}

@InputType()
class CreateTaskOptionsInput extends TaskOptionsInput {
    @Field({ nullable: false })
    tasklistId: string;
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
    createTask(
        @Ctx() { req }: MyContext,
        @Arg("options") options: CreateTaskOptionsInput
    ): Promise<Task> {

        return Task.create({
            userId: req.session.userId,
            ...options,
        }).save();
    }

    @Mutation(() => Boolean, { nullable: true })
    @UseMiddleware(isAuth)
    async deleteTask(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Boolean> {
        try {
            Task.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }

        return true;
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

        if (typeof options.archived !== "undefined") {
            Task.update({ id }, { archived: options.archived })
        }

        if (typeof options.tasklistId !== "undefined") {
            Task.update({ id }, { tasklistId: options.tasklistId })
        }


        return await Task.findOne({ id, userId: req.session.userId });
    }
}