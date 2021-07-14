import { Box, Paper, RootRef, withStyles } from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface TaskProps {
    id: string;
    index: number;
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

export const Task: React.FC<TaskProps> = ({ children, id, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <RootRef rootRef={provided.innerRef}>
                    <StyledPaper
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        elevation={2}
                        tabIndex={0}
                    >
                        <Box padding={1.5}>
                            {children}
                        </Box>
                    </StyledPaper>
                </RootRef>
            )
            }
        </Draggable >
    );
};