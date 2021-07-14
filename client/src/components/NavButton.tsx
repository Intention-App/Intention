import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React from "react";
import { IconType } from "react-icons";

interface NavButtonProps {
    Icon: IconType;
    href: string;
    small?: boolean;
};

const buttonStyle: React.CSSProperties = {
    marginLeft: -16,
    paddingLeft: 16,
    textTransform: "none",
    fontWeight: "normal"
}

const StyledButton = withStyles({
    label: {
        width: "100%",
        display: 'flex',
        alignItems: "center",
        justifyContent: "space-between"
    },
    root: {
        backgroundColor: "var(--bg-primary)",
        "&:focus": {
            backgroundColor: "var(--bg-hover)"
        }
    }
})(Button);

export const NavButton: React.FC<NavButtonProps> = ({ children, Icon, small = false, href }) => {

    const router = useRouter();
    const active = router.pathname.split("/")[1] === href;

    return (
        <StyledButton
            style={{
                borderRadius: small ? "0 14px 14px 0" : "0 21px 21px 0",
                height: small ? 28 : 42,
                fontSize: small ? 14 : 16,
                width: small ? "95%" : "100%",
                paddingRight: small ? 12 : 16,
                zIndex: active ? 1 : "inherit",
                border: active ? "1px solid var(--border)" : "none",
                ...buttonStyle
            }}
            variant="contained"
            endIcon={<Icon style={{
                width: small ? 16 : 24,
                height: small ? 16 : 24,
                color: "var(--icon)",
            }} />}
            disableFocusRipple
            onClick={() => {
                router.push(href)
            }}
            disableElevation={!active}
        >
            {children}
        </StyledButton>
    );
};