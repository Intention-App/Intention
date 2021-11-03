import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import { checklistExchanges } from "./exchanges/checklist";
import { journalExchanges } from "./exchanges/journal";
import { userExchanges } from "./exchanges/user";

/*
URQL Caching Client
*/
export const urqlClient = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: "include",
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                ...userExchanges,
                ...journalExchanges,
                ...checklistExchanges,
            }
        }
    }), fetchExchange]
});