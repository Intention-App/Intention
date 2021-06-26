import { ThemeProvider } from "@material-ui/core";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import React from "react";
import { useEffect } from "react";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import { LoginMutation, MeDocument, MeQuery } from "../generated/graphql";
import "../styles/globals.css";
import theme from "../styles/theme";

interface MyAppProps {
    Component: React.ComponentType<JSX.IntrinsicAttributes & { children?: React.ReactNode; }>;
    pageProps: JSX.IntrinsicAttributes & { children?: React.ReactNode; };
};

function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: "include",
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
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
                }
            }
        }
    }), fetchExchange]
});

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, [])

    return (
        <Provider value={client}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Provider>
    );
};

export default MyApp;