import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "../../components/column";
import { HeadWrapper } from "../../components/HeadWrapper";
import { Layout } from "../../components/layout";
import { useMyBoardQuery, useUpdateTasklistMutation, useUpdateTaskMutation } from "../../generated/graphql";
import { arrayToObject } from "../../utils/arrayToObject";

const Checklist: React.FC = ({ }) => {

    const [{ data, fetching }] = useMyBoardQuery({ variables: { id: "eec488d7-be9c-4870-a985-90e159bc8aed" } })
    const [, updateTasklist] = useUpdateTasklistMutation();
    const [, updateTask] = useUpdateTaskMutation();

    const onDragEnd = (result: DropResult) => {
        const { source, destination,reason,draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            source.droppableId == destination.droppableId &&
            source.index == destination.index
        ) {
            return;
        }

        if (data?.myBoard.tasklists) {
            const tasklists = arrayToObject(data.myBoard.tasklists, "id");

            const newTaskOrder = [...tasklists[source.droppableId].taskOrder];
            newTaskOrder.splice(source.index, 1);
            newTaskOrder.splice(destination.index, 0, draggableId);

            if (source.droppableId === destination.droppableId) {
                updateTasklist({id: source.droppableId, taskOrder: newTaskOrder});
                updateTask({id: draggableId, tasklistId: destination.droppableId});

                tasklists[source.droppableId].taskOrder = newTaskOrder;
            }
        }
    }

    return (
        <Layout>
            <HeadWrapper header="My Tasks">
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    {data?.myBoard.tasklists &&
                        <Box display="flex" paddingLeft={4}>
                            {data.myBoard.tasklists.map(tasklist => {
                                return (
                                    <Column key={tasklist.id} id={tasklist.id} tasks={
                                        tasklist.taskOrder
                                            .map(taskId => arrayToObject(tasklist.tasks, "id")[taskId]) 
                                    }>
                                        {tasklist.title}
                                    </Column>
                                )
                            })}
                        </Box>
                    }
                </DragDropContext>
            </HeadWrapper>
        </Layout>
    );
};

export default Checklist;