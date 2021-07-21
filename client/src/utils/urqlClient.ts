import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import {
    ArchiveTaskMutation,
    ArchiveTaskMutationVariables,
    CreateEntryMutation,
    CreateFolderMutation,
    CreateTaskMutation,
    DeleteEntryMutation,
    DeleteEntryMutationVariables,
    DeleteTasklistMutation,
    DeleteTasklistMutationVariables,
    DeleteTaskMutation,
    DeleteTaskMutationVariables,
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    MoveTaskMutation,
    RegisterMutation,
    UpdateTaskMutation
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
                logout: (_result, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },
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
                createEntry: (result: CreateEntryMutation, args, cache, info) => {
                   invalidateAll(cache, "myEntries");
                },
                createFolder: (result: CreateFolderMutation, args, cache, info) => {
                    invalidateAll(cache, "myFolders");
                },
                deleteEntry: (result: DeleteEntryMutation, args, cache, info) => {
                    cache.invalidate({
                        __typename: "Entry",
                        id: (args as DeleteEntryMutationVariables).id
                    })
                },
                createTasklist: (_result: UpdateTaskMutation, args, cache, info) => {
                    invalidateAll(cache, "myBoard");
                },
                deleteTasklist: (result: DeleteTasklistMutation, args, cache, info) => {
                    cache.invalidate({
                        __typename: "Tasklist",
                        id: (args as DeleteTasklistMutationVariables).id
                    })
                },
                createTask: (result: CreateTaskMutation, args, cache, info) => {
                    invalidateAll(cache, "myBoard");
                },
                deleteTask: (result: DeleteTaskMutation, args, cache, info) => {
                    cache.invalidate({
                        __typename: "Task",
                        id: (args as DeleteTaskMutationVariables).id
                    })
                },
                archiveTask: (result: ArchiveTaskMutation, args, cache, info) => {
                    invalidateAll(cache, "myBoard");
                },
            }
        }
    }), fetchExchange]
});