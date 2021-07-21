import { Box, IconButton, RootRef } from "@material-ui/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaCircle, FaEllipsisH } from "react-icons/fa";
import { Task as TaskType, useCreateTaskMutation } from "../../generated/graphql";
import { AddNew } from "../util/AddNew";
import { Task } from "./task";

interface ColumnProps {
    id: string;
    index: number;
    color?: string | null;
    tasks: TaskType[];
    toggleTasklistDrawer: (...props: any) => any;
    toggleTaskDrawer: (...props: any) => any;
};

export const Column: React.FC<ColumnProps> = ({ children, tasks, color, id, index, toggleTasklistDrawer, toggleTaskDrawer }) => {

    const [, createTask] = useCreateTaskMutation();

    return (
        <Draggable draggableId={id} index={index}>
            {(draggableProvided) => (
                <RootRef rootRef={draggableProvided.innerRef}>
                    <Box
                        {...draggableProvided.draggableProps}
                        marginRight={4}
                        bgcolor="var(--bg-primary)"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            {...draggableProvided.dragHandleProps}
                        >
                            <h3 style={{ margin: 0, fontWeight: "normal", marginBottom: 8, display: "flex", alignItems: "center" }}                >
                                {children}
                                {color &&
                                    <FaCircle color={color} style={{ width: 12, marginLeft: 8 }} />
                                }
                            </h3>
                            <IconButton
                                onClick={toggleTasklistDrawer(true, id)}
                            >
                                <FaEllipsisH
                                    style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }}
                                />
                            </IconButton>
                        </Box>
                        <Droppable droppableId={id} type="task">
                            {(provided) => (
                                <RootRef rootRef={provided.innerRef}>
                                    <Box
                                        minWidth={300}
                                        minHeight="1px"
                                    >
                                        {tasks.map((task, index) => (
                                            <Task
                                                toggleDrawer={toggleTaskDrawer}
                                                key={task.id}
                                                id={task.id}
                                                index={index}
                                            >
                                                {task.title}
                                            </Task>
                                        ))}

                                        {provided.placeholder}
                                    </Box>
                                </RootRef>
                            )}
                        </Droppable>
                        <AddNew buttonFunctions={[{
                            name: "Create New Task",
                            func: async () => {
                                const task = await createTask({ tasklistId: id, title: "Untitled" });

                                if (task?.data?.createTask.id) {
                                    toggleTaskDrawer(true, task.data.createTask.id)(undefined)
                                }
                            }
                        }]}>
                            Add New Task
                        </AddNew>
                    </Box>
                </RootRef>
            )}
        </Draggable>
    );
};