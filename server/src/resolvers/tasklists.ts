import { Tasklist } from "../entities/Tasklist";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Board } from "../entities/Board";

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
class moveTasklistInput {
    @Field({ nullable: true })
    prevTasklistId?: string;
    @Field({ nullable: true })
    nextTasklistId?: string;
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
    async createTasklist(
        @Ctx() { req }: MyContext,
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

        Board.update({ id: board.id }, { tasklistOrder: [...(board.tasklistOrder ? board.tasklistOrder : []), tasklist.id] });

        return tasklist;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteTasklist(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Boolean> {
        try {
            const tasklist = await Tasklist.findOne({ id, userId: req.session.userId });

            if (!tasklist) {
                return false;
            }

            const board = await Board.findOne({ id: tasklist.boardId, userId: req.session.userId });

            if (!board) {
                return false;
            }

            const tasklistIndex = board.tasklistOrder.indexOf(id);
            if (tasklistIndex !== -1) board.tasklistOrder.splice(tasklistIndex, 1);

            Board.update({ id: board.id }, { tasklistOrder: board.tasklistOrder });
            Tasklist.delete({ id })
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
            Tasklist.update({ id }, { color: options.color })
        }

        return await Tasklist.findOne({ id, userId: req.session.userId });
    }

    @Mutation(() => Tasklist)
    @UseMiddleware(isAuth)
    async moveTasklist(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("options") options: moveTasklistInput
    ): Promise<Tasklist | undefined> {

        if (id === options.prevTasklistId || id === options.nextTasklistId) return undefined;

        const tasklist = await Tasklist.findOne({ id, userId: req.session.userId })

        if (!tasklist) {
            return undefined;
        }

        const board = await Board.findOne({ id: tasklist.boardId, userId: req.session.userId });

        if (!board) return undefined;

        const oldTasklistIndex = board.tasklistOrder.indexOf(id);
        board.tasklistOrder.splice(oldTasklistIndex, 1);

        if (options.prevTasklistId && options.nextTasklistId) {
            const prevTasklistIndex = board.tasklistOrder.indexOf(options.prevTasklistId);
            const nextTasklistIndex = board.tasklistOrder.indexOf(options.nextTasklistId);

            if (prevTasklistIndex !== -1 && nextTasklistIndex !== -1 && nextTasklistIndex - prevTasklistIndex === 1) {
                board.tasklistOrder.splice(nextTasklistIndex, 0, id)
            }
            else {
                return undefined;
            }
        }
        else if (!options.prevTasklistId && options.nextTasklistId) {
            const nextTasklistIndex = board.tasklistOrder.indexOf(options.nextTasklistId);

            if (nextTasklistIndex === 0) {
                board.tasklistOrder.unshift(id);
            }
            else {
                return undefined;
            }
        }
        else if (options.prevTasklistId && !options.nextTasklistId) {
            const prevTasklistIndex = board.tasklistOrder.indexOf(options.prevTasklistId);

            if (prevTasklistIndex === board.tasklistOrder.length - 1) {
                board.tasklistOrder.push(id);
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }

        Board.update({ id: board.id }, { tasklistOrder: board.tasklistOrder })

        return await Tasklist.findOne({ id, userId: req.session.userId });
    }
}