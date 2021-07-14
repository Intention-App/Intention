import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import theme from "../styles/theme";
import { MenuButton } from "./menuButton";

interface action {
    name: string;
    func: (...params: any) => any;
}

interface HeadWrapperProps {
    backlink?: string;
    header: string;
    helper?: string | JSX.Element | React.Component;
    ButtonIcon?: IconType;
    buttonFunctions?: action[];
    titleChanger?: (value: string) => any;
};

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
    ButtonIcon,
    buttonFunctions,
    titleChanger,
    children
}) => {

    const [title, setTitle] = useState(header);
    const classes = useStyles();
    const inputEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(header);
    }, [header])

    return (
        <Box display="grid" gridTemplateRows="100px 1fr" height="100%">
            <Box display="flex" height={25} padding={4} paddingY={2.5}>
                <Box>
                    <Box display="flex" alignItems="center">
                        {backlink &&
                            <Link href={backlink}><a style={{ marginRight: 14 }}><FaArrowLeft /></a></Link>}
                        {titleChanger
                            ? <input value={title} onInput={(e) => { setTitle((e.target as HTMLInputElement).value) }}
                                ref={inputEl}
                                className={classes.input}
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
                    <Box padding={1} color="var(--secondary)">{helper}</Box>
                </Box>

                {buttonFunctions &&
                    <Box marginLeft="auto">
                        <MenuButton options={buttonFunctions}>
                            {ButtonIcon
                                ? <ButtonIcon
                                    style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }}
                                />
                                : <FaEllipsisV
                                    style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }}
                                />
                            }

                        </MenuButton>
                    </Box>
                }

            </Box>
            <Box display="flex" flexDirection="column">
                {children}
            </Box>
        </Box>
    );
};