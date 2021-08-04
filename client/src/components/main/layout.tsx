import Box from "@material-ui/core/Box";
import React from "react";
import { Sidebar } from "./sidebar";

export const Layout: React.FC = ({ children }) => {

    return (
        <Box display="grid" gridTemplateColumns="250px 1fr" height="100vh" width="100vw">
            <Sidebar />
            {children}
        </Box>
    );
};