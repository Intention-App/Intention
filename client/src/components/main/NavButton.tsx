import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IconType } from "react-icons";
import { colors } from "../../styles/theme";

// Button on sidebar

interface NavButtonProps {
    // Icon used at left of button
    icon: IconType;

    // Path or link on click
    href: string;
};

// Styles for button
const StyledButton = withStyles({
    label: {
        width: "100%",
        display: 'flex',
        alignItems: "center",
        justifyContent: "start",
    },
    root: {
        marginLeft: -16,
        paddingLeft: 16,
        textTransform: "none",
        fontWeight: "normal",
        backgroundColor: colors.background.primary,
        "&:focus": {
            backgroundColor: colors.background.hover
        }
    },
})(Button);

export const NavButton: React.FC<NavButtonProps> = ({ children, icon, href }) => {

    // Router for later functions
    const router = useRouter();

    // Changes styles if active (current path matches given path)
    const active = "/" + router.pathname.split("/")[1] === href;

    // Redefine icon capitalized to signify component
    const Icon = icon;

    return (
        // Link to destination
        <Link href={href} passHref>
            {/* Styled button */}
            <StyledButton
                style={{
                    // Small vs normal styles
                    borderRadius: "0 21px 21px 0",
                    height: 42,
                    fontSize: 16,
                    width: "100%",

                    // active styles
                    border: active ? "1px solid #c6c9f2" : "1px solid transparent",
                    backgroundColor: active ? "#e9eaff" : undefined,
                }}

                // Contained variant with no elevation
                variant="contained"
                disableElevation={true}

                // Icon at the left (styled)
                startIcon={<Icon style={{
                    width: 20,
                    height: 20,
                    color: colors.icon.primary,
                }} />}

                // Custom focus in place so no focus ripple
                disableFocusRipple
            >
                {/* Aligned text */}
                <span style={{ marginLeft: 8 }}>{children}</span>
            </StyledButton>
        </Link>
    );
};