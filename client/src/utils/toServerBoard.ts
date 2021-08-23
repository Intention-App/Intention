import _ from "lodash";
import { Task, Tasklist, Board } from "../generated/graphql";
import { objectToArray } from "./objectToArray";

interface ClientBoard {
    tasks: Record<string, Task>;
    tasklists: Record<string, Tasklist>;
    tasklistOrder: string[] | undefined;
    info: Pick<Board, "id" | "title" | "createdAt" | "updatedAt">
}

interface ServerBoard {
    id: string;
    tasklists: {
        id: string;
        taskOrder: string[] | undefined;
    }[]
    tasklistOrder: string[];
}

export const toServerBoard = (clientBoard: ClientBoard, board: Pick<Board, "tasklistOrder">): ServerBoard => {

    const serverBoard: Partial<ServerBoard> = {};

    serverBoard.id = clientBoard.info.id;

    serverBoard.tasklistOrder = _.isEqual(board.tasklistOrder, clientBoard.tasklistOrder) ? clientBoard.tasklistOrder : undefined;

    serverBoard.tasklists = objectToArray<Tasklist>(clientBoard.tasklists).map(tasklist => ({
        id: tasklist.id,
        taskOrder: tasklist.taskOrder || []
    }));
    
    return serverBoard as ServerBoard;
}