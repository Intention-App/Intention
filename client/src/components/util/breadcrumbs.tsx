import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { colors } from "../../styles/theme";
import { MenuButton } from "../buttons/menuButton";

// Breadcrumbs to backlink files and folders
interface BreadcrumbsProps {
    // Links for breadcrumbs
    links?: {
        name: string;
        href: string;
    }[];

    // name of current file
    current: string;

    // Options for file opened
    options?: [action, ...(action | "divider")[]];

    // Title editable?
    titleChanger?: (value: string) => any;

    // helper text
    helper?: string;
};

// Name and function of a button function
interface action {
    name: string;
    fn: (...params: any) => any;
}

// Style of link
const useStyles = makeStyles({
    link: {
        fontSize: 18,
        margin: "0 6px",
        color: colors.text.secondary,
        "&:hover": {
            color: colors.action.primary,
            textDecoration: "underline"
        }
    },
    current: {
        marginLeft: 6,
        marginRight: 8,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text.title
    },
    input: {
        marginRight: 8,
        padding: 2,
        margin: "-4px 2px",
        fontSize: 18,
        color: colors.text.title,
        fontWeight: "bold",
        fontFamily: "Roboto",
        outline: "none",
        borderRadius: 4,
        boxSizing: "border-box",
        border: "2px solid transparent",
        transition: "border 250ms",
        width: 150,
        "&:hover": {
            border: `2px solid ${colors.border.primary}`,
        },
        "&:focus": {
            border: "2px solid",
            borderColor: colors.action.primary,
        }
    },
});

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links, options, current, titleChanger, helper }) => {

    // Style of link
    const classes = useStyles();

    // Title state if that can to be edited
    const [title, setTitle] = useState(current);

    // Always set title to current (because it might be undefined when first loaded)
    useEffect(() => {
        setTitle(current);
    }, [current])

    // Whether title is being edited
    const [editingTitle, setEditingTitle] = useState(false);

    // Reference to title input for keyboard accessibility
    const inputEl = useRef<HTMLInputElement>(null);

    return (
        // Box to align all texts and items
        <Box display="flex" alignItems="center" justifyContent="space-between" paddingBottom={1} marginBottom={2}>

            {/* Box for links */}
            <Box display="flex" alignItems="center">


                {links && <>
                    {/* Backlink to previous file */}
                    < Link href={links[links.length - 1].href}><a>
                        <FaArrowLeft style={{ color: colors.text.secondary }} />
                    </a></Link>

                    {/* Links to previous pages */}
                    {links.map(link => (
                        <span key={link.href}>
                            <Link href={link.href} ><a className={classes.link}>
                                {link.name}
                            </a></Link>
                            <span style={{ color: colors.text.secondary }}>/</span>
                        </span>
                    ))}
                </>}

                {/* If a titlechanger function exists, render an input as well */}
                {titleChanger &&
                    <input
                        // Looks
                        className={classes.input}

                        // State changing
                        value={title}
                        onInput={(e) => { setTitle((e.target as HTMLInputElement).value) }}

                        // Reference and functions for title input for keyboard accessibility
                        ref={inputEl}
                        onBlur={(e) => {
                            titleChanger((e.target as HTMLInputElement).value);
                            setEditingTitle(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                inputEl.current?.blur();
                                e.preventDefault();
                            }
                        }}

                        // Input is hidden until editing is opened
                        style={{ display: editingTitle ? "inline" : "none" }}
                    />
                }

                {/* Title of current item, hidden if input is open */}
                <span className={classes.current} style={{ display: editingTitle ? "none" : "inline" }}>
                    {title}
                </span>

                {options &&
                    // Dropdown menu for oissuble actions
                    < MenuButton dropdown options={titleChanger ? [{
                        // Additional action to rename file if titlechanger exists
                        name: "Rename File",
                        fn: () => {
                            // Sets editing to true (opens input)
                            setEditingTitle(true);

                            // Focuses on input after 100ms (ensures there is enough time for input to open) 
                            setTimeout(() => { inputEl.current?.focus(); }, 100)
                        }
                    }, ...options] : options} />
                }
            </Box>

            {
                helper &&
                <Box color={colors.text.secondary}>
                    {helper}
                </Box>
            }
        </Box >
    );
};