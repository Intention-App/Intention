import { ThemeProvider } from "@material-ui/core/styles";
import Head from "next/head";
import React from "react";
import { useEffect } from "react";
import { Provider } from "urql";
import { urqlClient } from "../cache/urqlClient";
import "../styles/globals.css";
import theme from "../styles/theme";

// Next.js application base

// Props for Next.js _app
interface MyAppProps {
    Component: React.ComponentType<JSX.IntrinsicAttributes & { children?: React.ReactNode; }>;
    pageProps: JSX.IntrinsicAttributes & { children?: React.ReactNode; };
};

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
    // Removes server-side rendered JSS to prevent client-server mismatch 
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles); // Remove the server-side injected CSS.
        }
    }, [])

    return (
        <>
            <Head>
                {/* Link to Roboto font for styles */}
                <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />

                {/* #WIP: Make more robust */}
                <title>Intention</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            {/* Provider for URQL and MUI themes */}
            <Provider value={urqlClient}>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </Provider>
        </>
    );
};

export default MyApp;