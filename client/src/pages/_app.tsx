import { ThemeProvider } from "@material-ui/core/styles";
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
        // Provider for URQL and MUI themes
        <Provider value={urqlClient}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Provider>
    );
};

export default MyApp;