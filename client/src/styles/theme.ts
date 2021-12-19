import { createMuiTheme } from "@material-ui/core/styles";

// Colors of application
export const colors = {
    text: {
        primary: "#130F26",
        secondary: "#85838e",
        title: "#000000"
    },
    background: {
        primary: "#ffffff",
        secondary: "#f9f9f9",
        hover: "#e5e5e5",
    },
    border: {
        primary: "#cecdd2",
        secondary: "#dfdbec"
    },
    icon: {
        primary: "#4e4b5c"
    },
    action: {
        primary:  "#6e61fa",
        warning:  "#DF0000"
    }
} as const;

// Theme of MUI
const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.action.primary,
        },
        warning: {
            main: colors.action.warning
        }
    },
});

export default theme;