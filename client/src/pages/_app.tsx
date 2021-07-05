import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { Provider } from "urql";
import "../styles/globals.css";
import theme from "../styles/theme";
import { urqlClient } from "../utils/urqlClient";

interface MyAppProps {
    Component: React.ComponentType<JSX.IntrinsicAttributes & { children?: React.ReactNode; }>;
    pageProps: JSX.IntrinsicAttributes & { children?: React.ReactNode; };
};

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, [])

    return (
        <Provider value={urqlClient}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Provider>
    );
};

export default MyApp;