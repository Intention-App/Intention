import { Box, RootRef } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Task as TaskType } from "../generated/graphql";
import { Task } from "./task";

interface ColumnProps {
    id: string;
    tasks: TaskType[];
};

export const Column: React.FC<ColumnProps> = ({ children, tasks, id }) => {
    return (
        <Box>
            <h2 style={{ margin: 0 }}>{children}</h2>
                <Droppable droppableId={id}>
                    {(provided) => (
                        <RootRef rootRef={provided.innerRef}>
                            <Box
                                minWidth={300}
                            >
                                {tasks.map((task, index) => (
                                    <Task key={task.id} id={task.id} index={index}>{task.title}</Task>
                                ))}
                                {provided.placeholder}
                            </Box>
                        </RootRef>
                    )}
                </Droppable>
        </Box>
    );
};