import { Board } from "../entities/Board";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Tasklist } from "../entities/Tasklist";
import { arrayToObject } from "../utils/arrayToObject";
import { Task } from "../entities/Task";

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

@Resolver()
export class BoardResolver {
    @Query(() => [Board])
    boards(): Promise<Board[] | undefined> {
        return Board.find({})
    }

    @Query(() => Board)
    board(
        @Arg("id") id: string
    ): Promise<Board | undefined> {
        return Board.findOne({ where: { id } })
    }

    @Query(() => [Board])
    @UseMiddleware(isAuth)
    myBoards(
        @Ctx() { req }: MyContext
    ): Promise<Board[] | undefined> {
        return Board.find({ where: { userId: req.session.userId } })
    }

    @Query(() => Board)
    @UseMiddleware(isAuth)
    myBoard(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Board | undefined> {
        return Board.findOne({ where: { id, userId: req.session.userId }, relations: ["tasklists", "tasks"] })
    }

    @Mutation(() => Board)
    @UseMiddleware(isAuth)
    createBoard(
        @Ctx() { req }: MyContext,
        @Arg("options") options: BoardOptionsInput
    ): Promise<Board> {

        return Board.create({
            userId: req.session.userId,
            ...options
        }).save();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteBoard(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string
    ): Promise<Boolean> {

        try {
            Board.delete({ id, userId: req.session.userId })
        }
        catch {
            return false;
        }
        return true
    }

    @Mutation(() => Board)
    @UseMiddleware(isAuth)
    async updateBoard(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("options") options: BoardOptionsInput
    ): Promise<Board | undefined> {

        const board = await Board.findOne({ id, userId: req.session.userId })

        if (!board) {
            return undefined;
        }

        if (typeof options.title !== "undefined") {
            Board.update({ id }, { title: options.title })
        }

        return await Board.findOne({ id, userId: req.session.userId });
    }

    @Mutation(() => Board)
    @UseMiddleware(isAuth)
    async updatePositions(
        @Ctx() { req }: MyContext,
        @Arg("id") id: string,
        @Arg("tasklists", () => [TasklistInput]) tasklistsInput: TasklistInput[],
        @Arg("tasklistOrder", () => [String]) tasklistOrder: string[]
    ): Promise<Board | undefined> {

        const board = await Board.findOne({ where: { id: id, userId: req.session.userId }, relations: ["tasklists", "tasks"] })

        if (!board) {
            return undefined;
        }

        const newTasklistOrder: string[] = [];

        const tasklists = arrayToObject(board.tasklists, "id");
        const tasks = arrayToObject(board.tasks, "id");

        for (let i = 0; i < tasklistOrder.length; i++) {
            if (tasklists[tasklistOrder[i]]) {
                newTasklistOrder.push(tasklistOrder[i])
            }
        }

        const inputTasklist = arrayToObject(tasklistsInput, "id");

        await Board.update({ id: id }, { tasklistOrder: newTasklistOrder })

        for (let i = 0; i < newTasklistOrder.length; i++) {

            const tasklist = board.tasklists.find(tasklist => tasklist.id === newTasklistOrder[i])

            if (!tasklist) {
                continue;
            }

            const newTaskOrder: string[] = [];

            for (let j = 0; j < inputTasklist[newTasklistOrder[i]].taskOrder.length; j++) {
                if (tasks[inputTasklist[newTasklistOrder[i]].taskOrder[j]]) {
                    newTaskOrder.push(inputTasklist[newTasklistOrder[i]].taskOrder[j])
                }

                const task = board.tasks.find(task => task.id === inputTasklist[newTasklistOrder[i]].taskOrder[j]);

                if (task && task.tasklistId !== newTasklistOrder[i]) {
                    Task.update({ id: inputTasklist[newTasklistOrder[i]].taskOrder[j] }, { tasklistId: newTasklistOrder[i] })
                }
            }

            await Tasklist.update({ id: newTasklistOrder[i] }, { taskOrder: newTaskOrder })
        }



        return await Board.findOne({ where: { id: id, userId: req.session.userId }, relations: ["tasklists", "tasks"] });
    }


}