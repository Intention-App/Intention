import Box, { BoxProps } from "@material-ui/core/Box";
import React from "react";
import { colors } from "../../styles/theme";

// Horizontal or vertical divider
interface DividerProps extends BoxProps {
    vertical?: boolean;
    length?: number | string;
}

export const Divider: React.FC<DividerProps> = ({ vertical, length, ...props }) => {
    return (
        // Empty box with border basically
        // Which border depends on orientation
        <Box
            borderBottom={vertical ? undefined : `1px solid ${colors.border.secondary}`}
            borderRight={vertical ? `1px solid ${colors.border.secondary}` : undefined}
            width={vertical ? undefined : length || "100%"}
            height={vertical ? length || "100%" : undefined}
            {...props}
        />
    );
};