import { Task, Tasklist, Board } from "../generated/graphql";
import { objectToArray } from "./objectToArray";

interface ClientBoard {
    tasks: Record<string, Task>;
    tasklists: Record<string, Tasklist>;
    tasklistOrder: string[];
    info: Pick<Board, "id" | "title" | "createdAt" | "updatedAt">
}

interface ServerBoard {
    id: string;
    tasklists: {
        id: string;
        taskOrder: string[];
    }[]
    tasklistOrder: string[];
}

export const toServerBoard = (clientBoard: ClientBoard): ServerBoard => {

    const serverBoard: Partial<ServerBoard> = {};

    serverBoard.id = clientBoard.info.id;

    serverBoard.tasklistOrder = clientBoard.tasklistOrder;

    serverBoard.tasklists = objectToArray<Tasklist>(clientBoard.tasklists).map(tasklist => ({
        id: tasklist.id,
        taskOrder: tasklist.taskOrder || []
    }));
    
    return serverBoard as ServerBoard;
}