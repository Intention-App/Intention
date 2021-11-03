
import Box, { BoxProps } from "@material-ui/core/Box";
import React from "react";
import { colors } from "../../styles/theme";

// Gradient to background
interface GradientProps extends BoxProps {
    direction: "top" | "bottom" | "left" | "right";
    length?: number | string;
    spread?: number | string;
};

export const Gradient: React.FC<GradientProps> = ({ direction, length, spread, ...props }) => {
    return (
        // Box with gradient background
        <Box
            {...props}
            style={{ background: `linear-gradient(to ${direction || "top"}, ${colors.background.primary}, transparent)`, pointerEvents: "none" }}
            width={direction === "top" || direction === "bottom" ? spread || "100%" : length || 32}
            height={direction === "left" || direction === "right" ? spread || "100%" : length || 32}
            position="absolute"
        />
    );
};