import { Board } from "../entities/Board";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

@InputType()
class BoardOptionsInput {
    @Field({ nullable: true })
    title: string;
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
        return Board.findOne({ where: { id, userId: req.session.userId }, relations: ["tasklists", "tasklists.tasks", "tasks"] })
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
}