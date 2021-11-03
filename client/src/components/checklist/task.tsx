import Box from "@material-ui/core/Box"
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import RootRef from "@material-ui/core/RootRef";
import { withStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useArchiveTaskMutation } from "../../generated/graphql";
import { ClientBoard, EditorItem } from "../../pages/checklist/board/[boardId]";
import { colors } from "../../styles/theme";
import { toHumanTime } from "../../utils/toHumanTime";

// Task for Kanban board

interface TaskProps {

    // Ids for operations
    id: string;
    rootId: string;
    index: number;

    // Show due date if near
    dueAt: string;

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Toggles task editor
    toggleDrawer: (item: EditorItem | undefined) => (
        event: React.KeyboardEvent | React.MouseEvent | undefined,
    ) => any;
};

// Style of task item
const StyledPaper = withStyles({
    root: {
        border: `1px solid ${colors.border.secondary}`,
        borderRadius: 8,
        cursor: "pointer",
        transition: "background 250ms",
        backgroundColor: colors.background.primary,
        "&:focus": {
            backgroundColor: colors.background.hover,
            outline: "none"
        },
        "&:hover": {
            backgroundColor: colors.background.hover
        },
    }
})(Paper);

export const Task: React.FC<TaskProps> = ({ children, id, rootId, index, dueAt, toggleDrawer, setBoard }) => {

    // Archive and hide task on client (temporary)
    const [archived, setArchived] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [archiveTimer, setArchiveTimer] = useState<NodeJS.Timeout | undefined>(undefined);

    // Archive task on backend
    const [, archiveTask] = useArchiveTaskMutation();

    // Runs everytime if archive changes
    useEffect(() => {

        // Is archived
        if (archived) {

            // Sets a timeout (as a regret buffer) to hide task and archive it in the backend
            setArchiveTimer(setTimeout(() => {
                setHidden(true);
                archiveTask({ id });

                // when the hide animation is done, remove it from frontend
                setTimeout(() => {
                    setBoard(board => {

                        if (!board) {
                            return board;
                        }

                        // New task order without task
                        const newTaskOrder = [...(board.tasklists[rootId].taskOrder || [])];

                        const taskIndex = newTaskOrder.indexOf(id)
                        newTaskOrder.splice(taskIndex, 1)

                        // New tasklist with updated task order
                        const newTaskList = {
                            ...board.tasklists[rootId],
                            taskOrder: newTaskOrder
                        }

                        // Update board state
                        return {
                            ...board,
                            tasklists: {
                                ...board.tasklists,
                                [rootId]: newTaskList
                            }
                        }

                    })
                }, 300)

            }, 750))
        }

        // If unarchived in time, clear timeout operation so archive no longer happens
        if (!archived) {
            if (archiveTimer) {
                clearTimeout(archiveTimer);
                setArchiveTimer(undefined);
            }
        }

        // Clear timeout when unmounted to prevent memory leaks
        return () => {
            if (archiveTimer) {
                clearTimeout(archiveTimer);
                setArchiveTimer(undefined);
            }
        }
    }, [archived])

    return (

        // Task needs to be draggable
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => (

                // Ref for ReactBeautifulDnD
                <RootRef rootRef={provided.innerRef}>

                    {/* For task hiding animation */}
                    <Collapse
                        in={!hidden}
                        style={{ marginTop: 8 }}
                        timeout={300}
                    >

                        {/* Container of task */}
                        <StyledPaper
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            variant="outlined"
                            tabIndex={0}
                            onDoubleClick={toggleDrawer({ type: "task", id })}
                            style={{
                                ...provided.draggableProps.style,
                                backgroundColor: snapshot.isDragging ? colors.background.hover : undefined
                            }}
                        >

                            {/* Box for checkbox and text */}
                            <Box display="flex" alignItems="center" padding={1.5}>

                                {/* Archive button */}
                                {archived
                                    ? <FaCheckCircle style={{
                                        color: colors.icon.primary,
                                        marginRight: 8,
                                        cursor: "pointer",
                                        width: 18,
                                        height: 18
                                    }}
                                        onClick={() => { setArchived(false) }}
                                    />
                                    : <FaRegCircle style={{
                                        color: colors.icon.primary,
                                        marginRight: 8,
                                        cursor: "pointer",
                                        width: 18,
                                        height: 18
                                    }}
                                        onClick={() => { setArchived(true) }}
                                    />
                                }

                                {/* Text and due date helper (if needed) */}
                                <Box>
                                    {children}
                                    <br />
                                    {dueAt &&
                                        <span style={{ color: "red", fontSize: 14 }}>Due {toHumanTime(dueAt)}</span>
                                    }
                                </Box>
                            </Box>
                        </StyledPaper>
                    </Collapse>
                </RootRef>
            )}
        </Draggable >
    );
};