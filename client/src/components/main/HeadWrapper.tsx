import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import RootRef from "@material-ui/core/RootRef";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import theme from "../../styles/theme";
import { MenuButton } from "../util/menuButton";

// Wrapper with header for pages

interface HeadWrapperProps {
    // Page leads back to...
    backlink?: string;

    // Title and helper text of header
    header: string;
    helper?: string | JSX.Element | React.Component;

    // Title editable?
    titleChanger?: (value: string) => any;

    // Button look
    buttonIcon?: IconType;
    buttonColor?: string;

    // Possible actions on clicking the button
    buttonFunctions?: [action, ...(action | "divider")[]];

    // In case ref is needed for element
    children?: React.ReactNode | ((ref: HTMLDivElement | null) => React.ReactElement<HTMLElement>);
};

// Name and function of a button function
interface action {
    name: string;
    fn: (...params: any) => any;
}

// Style of wrapper
const useStyles = makeStyles({
    input: {
        display: "block",
        fontSize: "1.5em",
        fontWeight: "bold",
        outline: "none",
        borderRadius: 4,
        boxSizing: "border-box",
        border: "2px solid transparent",
        transition: "border 250ms",
        "&:hover": {
            border: "2px solid var(--border)",
        },
        "&:focus": {
            border: "2px solid",
            borderColor: theme.palette.primary.main,
        }
    },
});

export const HeadWrapper: React.FC<HeadWrapperProps> = ({
    backlink,
    header,
    helper,
    buttonIcon,
    buttonFunctions,
    buttonColor,
    titleChanger,
    children
}) => {

    // Classes from styles
    const classes = useStyles();

    // Title state if that can to be edited
    const [title, setTitle] = useState(header);

    // Reference to title input for keyboard accessibility
    const inputEl = useRef<HTMLInputElement>(null);

    // Redefine buttonIcon capitalized to signify component
    const ButtonIcon = buttonIcon;

    // Set title on load
    useEffect(() => {
        setTitle(header);
    }, [header])

    // Ref in case it is needed by element 
    const ref = useRef<HTMLDivElement | null>(null)

    return (

        // Ref in case it is needed by element 
        <RootRef rootRef={ref}>

            {/* Grid for header + content */}
            <Box display="grid" gridTemplateRows="100px 1fr" height="100%">

                {/* Header */}
                <Box display="flex" padding={4} paddingY={2.5}>

                    {/* Title, helper, & backlink button */}
                    <Box>

                        {/* Aligns backlink arrow and title */}
                        <Box display="flex" alignItems="center">

                            {/* Backlink arrow */}
                            {backlink &&
                                <Link href={backlink}><a style={{ marginRight: 14 }}><FaArrowLeft /></a></Link>}

                            {/* Title is input if title change function provided, otherwise h2 */}
                            {titleChanger
                                ? <input
                                    // Looks
                                    className={classes.input}

                                    // State changing
                                    value={title}
                                    onInput={(e) => { setTitle((e.target as HTMLInputElement).value) }}

                                    // Reference and functions for title input for keyboard accessibility
                                    ref={inputEl}
                                    onBlur={(e) => { titleChanger((e.target as HTMLInputElement).value) }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            titleChanger((e.target as HTMLInputElement).value);
                                            inputEl.current?.blur();
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                : <h2 style={{ margin: 2 }}>{title}</h2>
                            }
                        </Box>

                        {/* Helper element */}
                        <Box padding={1} color="var(--secondary)">{helper}</Box>
                    </Box>

                    {/* Icon button with menu */}
                    {buttonFunctions &&
                        <Box marginLeft="auto" marginTop="-10px">
                            <MenuButton options={buttonFunctions}>

                                {/* Custom Icon, defaults to ellipsis */}
                                {ButtonIcon
                                    ? <ButtonIcon
                                        style={{ width: 24, height: 24, color: buttonColor || "var(--icon)", cursor: "pointer" }}
                                    />
                                    : <FaEllipsisV
                                        style={{ width: 16, height: 16, color: buttonColor || "var(--icon)", cursor: "pointer" }}
                                    />
                                }

                            </MenuButton>
                        </Box>
                    }

                </Box>

                {/* Flex container for children */}
                <Box display="flex" flexDirection="column" position="relative">

                    {/* Child function is called in case it is needed by element, otherwise render child */}
                    {typeof children === "function"
                        ? children(ref.current)
                        : children
                    }
                </Box>
            </Box>
        </RootRef>
    );
};