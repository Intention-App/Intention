import { Paper, Box, withStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { FaFolder } from "react-icons/fa";

interface FolderProps {
    id: number;
    createdAt: string;
    updatedAt: string;
};

const StyledPaper = withStyles({
    root: {
        marginTop: 8,
        border: "1px solid var(--border)",
        borderRadius: 8,
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

export const Folder: React.FC<FolderProps> = ({ children, id, createdAt, updatedAt }) => {

    const router = useRouter();

    return (
        <StyledPaper elevation={2} tabIndex={0}
            onClick={() => { router.push(`/journal/folder/${id}`) }}
            onKeyDown={(e) => { if (e.key == "Enter") router.push(`/journal/folder/${id}`) }}
        >
            <Box display="grid" gridTemplateColumns="3fr 1fr 1fr" alignItems="center" paddingY={1.5}>
                <span style={{ marginLeft: 12, display: "flex", alignItems: "center" }}>
                    <FaFolder style={{ width: 20, height: 20, color: "var(--icon)", marginRight: 12 }} />
                    {children}
                </span>
                <span>{createdAt}</span>
                <span>{updatedAt}</span>
            </Box>
        </StyledPaper>
    );
};