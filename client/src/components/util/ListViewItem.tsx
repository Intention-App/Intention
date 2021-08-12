import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useRouter } from "next/router";
import React from "react";
import { IconType } from "react-icons";

// List view item for folder navigation

interface ListViewItemProps {
    // Props for display
    createdAt: string;
    updatedAt: string;

    // Icon used at left of display
    icon: IconType;

    // Path or link on click
    href: string;
};

// Styles for button
const StyledPaper = withStyles({
    root: {
        cursor: "pointer",
        transition: "background 250ms",
        backgroundColor: "var(--bg-primary)",
        "&:focus": {
            backgroundColor: "var(--bg-hover)",
            outline: "none"
        },
        "&:hover": {
            backgroundColor: "var(--bg-hover)"
        },
    }
})(Paper);

export const ListViewItem: React.FC<ListViewItemProps> = ({ children, createdAt, updatedAt, icon, href }) => {

    // Router for later functions
    const router = useRouter();

    // Redefine icon capitalized to signify component
    const Icon = icon;

    return (
        // Button with onclick interactions
        <StyledPaper elevation={0} tabIndex={0}
            onClick={() => { router.push(href) }}
            onKeyDown={(e) => { if (e.key == "Enter") router.push(href) }}
        >

            {/* Display of file name, and update or create times */}
            <Box display="grid" gridTemplateColumns="1fr 200px 200px" alignItems="center" paddingY={1.5}>
                <span style={{ marginLeft: 12, display: "flex", alignItems: "center" }}>
                    <Icon style={{ width: 20, height: 20, color: "var(--icon)", marginRight: 12 }} />
                    {children}
                </span>
                <span>{createdAt}</span>
                <span>{updatedAt}</span>
            </Box>
        </StyledPaper>
    );
};