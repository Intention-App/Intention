import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import {
    CreateEntryMutationVariables,
    CreateFolderMutationVariables,
    DeleteEntryMutationVariables,
    DeleteFolderMutationVariables,
    DeleteTasklistMutationVariables,
    DeleteTaskMutationVariables,
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation
} from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

function invalidateAll(cache: Cache, fieldName: string) {
    const allFields = cache.inspectFields("Query");
    console.log(allFields)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    console.log(fieldInfos)
    fieldInfos.forEach((fi) => {
        cache.invalidate("Query", fieldName, fi.arguments);
    });
}


export const urqlClient = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: "include",
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                /*
                    User Endpoints
                */

                // Updates cache with new user
                register: (_result: RegisterMutation, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.register.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.register.user
                                }
                            }
                        }
                    )
                },

                // Updates cache with new user
                login: (_result: LoginMutation, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.login.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.login.user
                                }
                            }
                        }
                    )
                },

                // Invalidates cached user
                logout: (_result, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },


                /*
                    Journal Endpoints
                */

                // Invalidates all cached entries when new entry is created
                // Refetches new entries 
                createEntry: (result, {options}: {options: CreateEntryMutationVariables}, cache, info) => {
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
                createFolder: (result, {options}: {options: CreateFolderMutationVariables}, cache, info) => {
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


                /*
                    Checklist
                */

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
        }
    }), fetchExchange]
});