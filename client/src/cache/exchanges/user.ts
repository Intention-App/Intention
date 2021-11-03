import { UpdateResolver } from "@urql/exchange-graphcache";
import { RegisterMutation, MeQuery, MeDocument, LoginMutation, LogoutMutation } from "../../generated/graphql";
import { betterUpdateQuery } from "../utils";

/*
    User Endpoints
*/
export const userExchanges: Record<string, UpdateResolver> = {

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
}

export default userExchanges;