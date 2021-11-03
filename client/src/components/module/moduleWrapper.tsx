import Box from "@material-ui/core/Box";
import React from "react";

interface moduleWrapperProps {

};

// #WIP
export const moduleWrapper: React.FC<moduleWrapperProps> = ({ children }) => {
    return (
        <Box display="grid" gridTemplateColumns="1fr 250px">
            {children}
        </Box>
    );
};