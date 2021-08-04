import Box from "@material-ui/core/Box";
import React from "react";
import materialStyles from "../../styles/material.module.css";

interface containerProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "center" | "left" | "right";
};

export const Container: React.FC<containerProps> = ({ align = "left", children, ...props }) => {
    return (
        <Box  {...props}
            className={
                props.className
                    ? props.className.concat(" ", materialStyles["container-size"])
                    : materialStyles["container-size"]
            }
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: align === "center"
                    ? "center"
                    : align === "left"
                        ? "flex-start"
                        : align
                            ? "flex-end"
                            : undefined,
                justifyContent: align === "center" ? "center" : undefined,
                ...props.style
            }}
        >
            {children}
        </Box>
    );
};