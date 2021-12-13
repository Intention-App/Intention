
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import RootRef from "@material-ui/core/RootRef";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaCircle, FaEllipsisH } from "react-icons/fa";
import { Task as TaskType, useCreateTaskMutation } from "../../generated/graphql";
import { ClientBoard, EditorItem } from "../../pages/checklist/board/[boardId]";
import { colors } from "../../styles/theme";
import { AddNew } from "../buttons/AddNew";
import { Task } from "./task";

// Tasklist for Kanban Board

export interface ColumnProps {

    // Ids for operations
    id: string;
    index: number;

    // Color of tasklist circle
    color?: string | null;

    // List of tasks in list
    tasks: TaskType[];

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Toggling editors
    toggleModal: (item: EditorItem | undefined) => (
        event: React.KeyboardEvent | React.MouseEvent | undefined,
    ) => any;
};

export const Column: React.FC<ColumnProps> = ({ children, tasks, color, id, index, setBoard, toggleModal }) => {

    return (

        // Tasklists are draggable
        <Draggable draggableId={id} index={index}>
            {(draggableProvided, snapshot) => (

                // Ref for operations
                <RootRef rootRef={draggableProvided.innerRef}>

                    {/* Container of tasklist */}
                    <Box
                        {...draggableProvided.draggableProps}
                        padding={2}
                        borderRadius={8}
                        bgcolor={snapshot.isDragging ? colors.background.hover : colors.background.primary}
                    >

                        {/* Box for title, colored icon, and button */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            {...draggableProvided.dragHandleProps}
                        >
                            {/* Colored icon & title */}
                            <h3 style={{ fontWeight: "normal", marginBottom: 8, display: "flex", alignItems: "center" }}                >
                                {children}
                                {color &&
                                    <FaCircle color={color} style={{ width: 12, marginLeft: 8 }} />
                                }
                            </h3>

                            {/* Button to toggle editor */}
                            <IconButton
                                onClick={toggleModal({ type: "tasklist", id })}
                            >
                                <FaEllipsisH
                                    style={{ width: 16, height: 16, color: colors.icon.primary, cursor: "pointer" }}
                                />
                            </IconButton>
                        </Box>

                        {/* Drop Area for React Beautiful DND */}
                        <Droppable droppableId={id} type="task">
                            {(provided) => (

                                // Ref for operations
                                <RootRef rootRef={provided.innerRef}>

                                    {/* Drop area with min 1px height to ensure accessibility */}
                                    <Box
                                        minWidth={300}
                                        minHeight="1px"
                                    >

                                        {/* Tasks in list */}
                                        {tasks.map((task, index) => (
                                            <Task
                                                toggleDrawer={toggleModal}
                                                setBoard={setBoard}
                                                key={task.id}
                                                id={task.id}
                                                rootId={id}
                                                index={index}
                                                dueAt={task.dueAt}
                                            >
                                                {task.title}
                                            </Task>
                                        ))}

                                        {/* placeholder for empty lists */}
                                        {provided.placeholder}
                                    </Box>
                                </RootRef>
                            )}
                        </Droppable>

                        {/* Button to add new tasks */}
                        <AddNew buttonFunctions={[{
                            name: "Create New Task",
                            fn: toggleModal({ type: "task", id: undefined, props: { tasklistId: id } })
                        }]}>
                            Add New Task
                        </AddNew>
                    </Box>
                </RootRef>
            )}
        </Draggable>
    );
};