import { Tasklist } from "../entities/Tasklist";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

@InputType()
class TasklistOptionsInput {
    @Field({ nullable: true })
    title: string;
    @Field({ nullable: true })
    color: string;
    @Field(() => [String], { nullable: true })
    taskOrder: string[];
    @Field({ nullable: true })
    boardId: string;
}

@InputType()
class CreateTasklistOptionsInput extends TasklistOptionsInput {
    @Field({ nullable: false })
    boardId: string;
}

@Resolver()
export class TasklistResolver {
    @Query(() => [Tasklist])
    tasklists(): Promise<Tasklist[] | undefined> {
        return Tasklist.find({})
    }

    @Query(() => Tasklist)
    tasklist(
        @Arg("id") id: string
    ): Promise<Tasklist | undefined> {
        return Tasklist.findOne({ where: { id } })
    }

    @Query(() => [Tasklist])
    @UseMiddleware(isAuth)
    myTasklists(
        @Ctx() { req }: MyContext
    ): Promise<Tasklist[] | undefined> {
        return Tasklist.find({ where: { userId: req.session.userId }, relations: ["tasks"] })
    }

    @Query(() => Tasklist)
    @UseMiddleware(isAuth)
    myTasklist(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Tasklist | undefined> {
        return Tasklist.findOne({ where: { id, userId: req.session.userId } })
    }

    @Mutation(() => Tasklist)
    @UseMiddleware(isAuth)
    createTasklist(
        @Ctx() { req }: MyContext,
        @Arg("options") options: CreateTasklistOptionsInput
    ): Promise<Tasklist> {

        return Tasklist.create({
            userId: req.session.userId,
            ...options
        }).save();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteTasklist(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Boolean> {

        try {
            Tasklist.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }
        return true
    }

    @Mutation(() => Tasklist)
    @UseMiddleware(isAuth)
    async updateTasklist(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("options") options: TasklistOptionsInput
    ): Promise<Tasklist | undefined> {

        const tasklist = await Tasklist.findOne({ id, userId: req.session.userId })

        if (!tasklist) {
            return undefined;
        }

        if (typeof options.title !== "undefined") {
            Tasklist.update({ id }, { title: options.title })
        }

        if (typeof options.color !== "undefined") {
            Tasklist.update({ id }, { color: options.color})
        }

        if (typeof options.taskOrder !== "undefined") {
            Tasklist.update({ id }, { taskOrder: options.taskOrder })
        }

        if (typeof options.boardId !== "undefined") {
            Tasklist.update({ id }, { boardId: options.boardId })
        }

        return await Tasklist.findOne({ id, userId: req.session.userId });
    }
}