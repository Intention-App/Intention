import { UpdateResolver } from "@urql/exchange-graphcache";
import { DeleteTasklistMutationVariables, DeleteTaskMutationVariables } from "../../generated/graphql";
import { invalidateAll } from "../utils";

/*
    Checklist Endpoints
*/
export const checklistExchanges: Record<string, UpdateResolver> = {

    // Invalidates all cached boards when new folder is created
    // Refetches new boards
    createFolder: (result, args, cache, info) => {
        invalidateAll(cache, "myBoards");
    },

    // Invalidates board when it updates
    // Refetches board
    updateOrder: (result, args, cache, info) => {
        invalidateAll(cache, "myBoard");
    },

    // Invalidates board when new tasklist is created
    // Refetches the board
    createTasklist: (result, args, cache, info) => {
        invalidateAll(cache, "myBoard");
    },

    // Invalidates deleted tasklist
    deleteTasklist: (result, args, cache, info) => {
        cache.invalidate({
            __typename: "Tasklist",
            id: (args as DeleteTasklistMutationVariables).id
        })
    },

    // Invalidates board when new task is created
    // Refetches the board
    createTask: (result, args, cache, info) => {
        invalidateAll(cache, "myBoard");
    },

    // Invalidates deleted task
    deleteTask: (result, args, cache, info) => {
        cache.invalidate({
            __typename: "Task",
            id: (args as DeleteTaskMutationVariables).id
        })
    },

    // Invalidates archived task
    archiveTask: (result, args, cache, info) => {
        cache.invalidate({
            __typename: "Task",
            id: (args as DeleteTaskMutationVariables).id
        })
    },
}