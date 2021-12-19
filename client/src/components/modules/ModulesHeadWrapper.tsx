import Box from "@material-ui/core/Box";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaCube } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { colors } from "../../styles/theme";

// Wrapper with header for pages

interface ModulesHeadWrapperProps {

};

const useStyles = makeStyles({

    input: {
        backgroundColor: colors.background.input,
        padding: "4px 16px",
        borderRadius: 16,
        minWidth: 250,
        border: "1px solid transparent",
        transition: "250ms",
        color: colors.text.primary,

        "&:placeholder": {
            backgroundColor: "#8d8d8d",
        }
    },

    link: {
        color: colors.text.title,
        padding: 8,

        "&:not(:last-child)": {
            marginRight: 32
        }
    },

    "active-link": {
        backgroundColor: colors.background.hover,
        borderRadius: 8,
        padding: 8,
        color: colors.action.primary,
        fontWeight: "bold",

        "&:not(:last-child)": {
            marginRight: 32
        }
    }
});

export const ModulesHeadWrapper: React.FC<ModulesHeadWrapperProps> = ({
    children
}) => {

    // Router to compare paths
    const router = useRouter();

    // Changes styles if active (current path matches given path)
    const route = router.pathname.split("/")[2];

    // classes for styling
    const classes = useStyles();

    return (

        // Grid for header + content
        <Box display="grid" gridTemplateRows="80px 1fr" height="100%">

            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" padding={4} paddingY={2}>

                {/* Icon and title */}
                <Box display="flex" alignItems="center">
                    <FaCube style={{ color: colors.icon.primary, width: 24, height: 24, marginRight: 16 }} />

                    <h2 style={{ color: colors.text.title }}>Modules</h2>
                </Box>

                {/* Library and my modules */}
                <Box display="flex" alignItems="center" marginRight="auto" marginLeft={8}>
                    <Link href="/modules"><a className={route == "library" ? classes.link : classes["active-link"]}>
                       My Modules
                    </a></Link>

                    <Link href="/modules/library"><a className={route === "library" ? classes["active-link"] : classes.link}>
                        Library
                    </a></Link>
                </Box>

                {/* Search Bar */}
                <TextField
                    InputProps={{
                        classes: {
                            root: classes.input,
                        },
                        disableUnderline: true,
                        startAdornment: (
                            < InputAdornment position="start" >
                                <IoSearch style={{ color: colors.icon.primary }} />
                            </InputAdornment>
                        )
                    }}
                    inputProps={{
                        autoComplete: "off",
                    }}
                    margin="normal"
                    placeholder="Search"
                />

            </Box >

            {/* Flex container for children */}
            < Box display="flex" flexDirection="column" position="relative" >
                {children}
            </Box >
        </Box >
    );
};