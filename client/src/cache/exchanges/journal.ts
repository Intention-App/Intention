import { UpdateResolver } from "@urql/exchange-graphcache";
import {
    CreateEntryMutationVariables,
    CreateFolderMutationVariables,
    DeleteEntryMutationVariables,
    DeleteFolderMutationVariables,
    UpdateFolderMutationVariables
} from "../../generated/graphql";
import { invalidateAll } from "../utils";

/*
    Journal Endpoints
*/
export const journalExchanges: Record<string, UpdateResolver> = {

    // Invalidates all cached entries when new entry is created
    // Refetches new entries 
    createEntry: (result, { options }: { options: CreateEntryMutationVariables }, cache, info) => {
        if (options.folderId) {
            cache.invalidate({
                __typename: "Folder",
                id: options.folderId
            })
        }
        else {
            invalidateAll(cache, "myEntries");
        }
    },

    // Invalidates deleted entry
    deleteEntry: (result, args, cache, info) => {
        cache.invalidate({
            __typename: "Entry",
            id: (args as DeleteEntryMutationVariables).id
        })
    },

    // Invalidates all cached folders when new folder is created
    // Refetches new folders
    createFolder: (result, { options }: { options: CreateFolderMutationVariables }, cache, info) => {
        if (options.folderId) {
            cache.invalidate({
                __typename: "Folder",
                id: options.folderId
            })
        }
        else {
            invalidateAll(cache, "myFolders");
        }
    },

    // Invalidates deleted folder
    deleteFolder: (result, args, cache, info) => {
        cache.invalidate({
            __typename: "Folder",
            id: (args as DeleteFolderMutationVariables).id
        })
    },

    // Renews updated Folder
    updateFolder: (result, { options }: { options: UpdateFolderMutationVariables }, cache, info) => {
        invalidateAll(cache, "folderPath");
    },
}

