import _ from "lodash";
import { Task, Tasklist, Board } from "../generated/graphql";
import { objectToArray } from "./objectToArray";

// Transforms Board from client into the format required by the server

// Board format of client
interface ClientBoard {
    // Tasks and taskists of board
    tasks: Record<string, Task>;
    tasklists: Record<string, Tasklist>;

    // Order of tasklists in board
    tasklistOrder: string[] | undefined;

    // Additional information of board
    info: Pick<Board, "id" | "title" | "createdAt" | "updatedAt">
}

// Board format of server
interface ServerBoard {
    // Id of board
    id: string;

    // List of tasklists with the task order
    tasklists: {
        id: string;
        taskOrder: string[];
    }[];

    // Order of tasklists in board 
    tasklistOrder: string[] | undefined;
}

export const toServerBoard = (clientBoard: ClientBoard, board: Pick<Board, "tasklistOrder">): ServerBoard => {

    const serverBoard: ServerBoard = {
        id: clientBoard.info.id,
        tasklistOrder: _.isEqual(board.tasklistOrder, clientBoard.tasklistOrder) ? clientBoard.tasklistOrder : undefined,
        tasklists: objectToArray<Tasklist>(clientBoard.tasklists).map(tasklist => ({
            id: tasklist.id,
            taskOrder: tasklist.taskOrder || []
        }))
    };
    
    return serverBoard;
}