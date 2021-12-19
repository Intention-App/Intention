import Box from "@material-ui/core/Box";
import React from "react";
import { IconType } from "react-icons";
import { FaEllipsisV } from "react-icons/fa";
import { colors } from "../../styles/theme";
import { MenuButton } from "../buttons/menuButton";

// Wrapper with header for pages

interface HeadWrapperProps {

    // Title and icon of header
    header: string;
    icon?: IconType;

    // Button look
    buttonIcon?: IconType;
    buttonColor?: string;

    // IconContainer Button
    iconContainer?: React.ReactNode;

    // Possible actions on clicking the button
    buttonFunctions?: [action, ...(action | "divider")[]];
};

// Name and function of a button function
interface action {
    name: string;
    fn: (...params: any) => any;
}

export const HeadWrapper: React.FC<HeadWrapperProps> = ({
    header,
    icon,
    buttonIcon,
    buttonFunctions,
    buttonColor,
    iconContainer,
    children
}) => {

    // Redefine buttonIcon capitalized to signify component
    const ButtonIcon = buttonIcon;

    // Redefine Icon capitalized to signify component
    const Icon = icon;

    return (

        // Grid for header + content
        <Box display="grid" gridTemplateRows="80px 1fr" height="100%">

            {/* Header */}
            <Box display="flex" alignItems="center" padding={4} paddingY={2}>

                {Icon &&
                    <Icon style={{ color: colors.icon.primary, width: 24, height: 24, marginRight: 16 }} />
                }

                {/* Title */}
                <h2 style={{ color: colors.text.title }}>{header}</h2>

                {/* Icon button with menu */}
                {
                    (buttonFunctions) &&
                    <Box marginLeft="auto">
                        <MenuButton options={buttonFunctions}>

                            {/* Custom Icon, defaults to ellipsis */}
                            {iconContainer
                                ? iconContainer
                                : ButtonIcon
                                    ? <ButtonIcon
                                        style={{ width: 24, height: 24, color: buttonColor || colors.icon.primary, cursor: "pointer" }}
                                    />
                                    : <FaEllipsisV
                                        style={{ width: 16, height: 16, color: buttonColor || colors.icon.primary, cursor: "pointer" }}
                                    />
                            }

                        </MenuButton>
                    </Box>
                }

            </Box >

            {/* Flex container for children */}
            < Box display="flex" flexDirection="column" position="relative" >
                {children}
            </Box >
        </Box >
    );
};