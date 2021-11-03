import { Box } from "@material-ui/core";
import React from "react";
import { IconType } from "react-icons";
import { colors } from "../../styles/theme";

interface IconContainerProps {
    // Icon used at left of button
    icon: IconType;

    // Color of icon
    iconColor?: string;

    // Size of the box
    size?: number;

    // Border radius
    borderRadius?: number | "square" | "circular";
};

export const IconContainer: React.FC<IconContainerProps> = ({ icon, size = 24, borderRadius = 8, iconColor }) => {

    // Redefine icon capitalized to signify component
    const Icon = icon;

    return (
        <Box width={size} height={size}
            display="flex" alignItems="center" justifyContent="center"
            borderRadius={
                borderRadius == "square"
                    ? 0
                    : borderRadius == "circular"
                        ? size / 2
                        : borderRadius
            } bgcolor={colors.action.primary}>
            <Icon style={{
                width: size - 12,
                height: size - 12,
                color: iconColor || colors.background.primary,
            }} />
        </Box>
    );
};