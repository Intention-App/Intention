import { Box, Collapse, Paper, RootRef, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useArchiveTaskMutation } from "../../generated/graphql";
import { toHumanTime } from "../../utils/toHumanTime";

interface TaskProps {
    id: string;
    dueAt: string;
    index: number;
    toggleDrawer: (...props: any) => any;
};

const StyledPaper = withStyles({
    root: {
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

export const Task: React.FC<TaskProps> = ({ children, id, index, dueAt, toggleDrawer }) => {

    const [archived, setArchived] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [archiveTimer, setArchiveTimer] = useState<NodeJS.Timeout | undefined>(undefined);
    const [, archiveTask] = useArchiveTaskMutation();

    useEffect(() => {
        if (archived) {
            setArchiveTimer(setTimeout(() => {
                setHidden(true);
                archiveTask({ id });
            }, 750))
        }

        if (!archived) {
            if (archiveTimer) {
                clearTimeout(archiveTimer);
                setArchiveTimer(undefined);
            }
        }
    }, [archived])

    return (
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                    <Collapse
                        in={!hidden}
                        style={{ marginTop: 8 }}
                    >
                        <StyledPaper
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={2}
                            tabIndex={0}
                            onDoubleClick={toggleDrawer(true, id)}
                            style={{
                                ...provided.draggableProps.style,
                                backgroundColor: snapshot.isDragging ? "var(--bg-hover)" : undefined
                            }}
                        >
                            <Box display="flex" alignItems="center" padding={1.5}>
                                {archived
                                    ? <FaCheckCircle style={{
                                        color: "var(--icon)",
                                        marginRight: 8,
                                        cursor: "pointer",
                                        width: 18,
                                        height: 18
                                    }}
                                        onClick={() => { setArchived(false) }}
                                    />
                                    : <FaRegCircle style={{
                                        color: "var(--icon)",
                                        marginRight: 8,
                                        cursor: "pointer",
                                        width: 18,
                                        height: 18
                                    }}
                                        onClick={() => { setArchived(true) }}
                                    />
                                }
                                <div>
                                    {children}
                                    <br />
                                    {dueAt &&
                                        <span style={{ color: "red", fontSize: 14 }}>Due {toHumanTime(dueAt)}</span>
                                    }
                                </div>
                            </Box>
                        </StyledPaper>
                    </Collapse>
                </RootRef>
            )}
        </Draggable >
    );
};