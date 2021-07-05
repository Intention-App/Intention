import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import {
    CreateEntryMutation,
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    MyEntriesDocument,
    MyEntriesQuery,
    MyEntryDocument,
    MyEntryQuery,
    RegisterMutation,
    UpdateEntryMutation
} from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any)
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
                createEntry: (_result: CreateEntryMutation, args, cache, info) => {
                    betterUpdateQuery<CreateEntryMutation, MyEntriesQuery>(
                        cache,
                        { query: MyEntriesDocument },
                        _result,
                        (result, query) => {
                            if (!result.createEntry) {
                                return query;
                            } else {
                                return {
                                    myEntries: query.myEntries && result.createEntry
                                        ? [...query.myEntries, result.createEntry]
                                        : query.myEntries
                                            ? [...query.myEntries]
                                            : result.createEntry
                                                ? [result.createEntry]
                                                : []
                                }
                            }
                        }
                    )
                },
                updateEntry: (_result: UpdateEntryMutation, args, cache, info) => {
                    betterUpdateQuery<UpdateEntryMutation, MyEntryQuery>(
                        cache,
                        { query: MyEntryDocument },
                        _result,
                        (result, query) => {
                            if (!result.updateEntry) {
                                return query;
                            } else {
                                return {
                                    myEntry: result.updateEntry
                                }
                            }
                        }
                    )
                }
            }
        }
    }), fetchExchange]
});