import Box from "@material-ui/core/Box";
import React from "react";
import { useIsAuth } from "../../hooks/util/useIsAuth";
import { Sidebar } from "./sidebar";

export const Layout: React.FC = ({ children }) => {

    const me = useIsAuth();

    // #TODO: Make confirmation modal global

    return (
        // Adds sidebar to application, renders nothing if not logged in
        me
            ? <Box display="grid" gridTemplateColumns="250px 1fr" height="100vh" width="100vw">
                <Sidebar user={me} />
                {children}
            </Box>
            : <></>
    );
};