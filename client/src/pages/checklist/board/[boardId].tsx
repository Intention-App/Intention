import { Box, RootRef } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Column } from "../../../components/checklist/column";
import { EditTask } from "../../../components/checklist/editTask";
import { EditTasklist } from "../../../components/checklist/editTasklist";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { Task, useCreateTasklistMutation, useDeleteBoardMutation, useMoveTasklistMutation, useMoveTaskMutation, useMyBoardQuery, useUpdateBoardMutation } from "../../../generated/graphql";
import { arrayToObject } from "../../../utils/arrayToObject";
import { toHumanTime } from "../../../utils/toHumanTime";

const Checklist: React.FC = ({ }) => {

    const router = useRouter();
    const { boardId } = router.query;
    const [{ data, fetching }] = useMyBoardQuery({ variables: { id: (boardId as string) } });
    const [, updateBoard] = useUpdateBoardMutation();
    const [, deleteBoard] = useDeleteBoardMutation();
    const [, moveTask] = useMoveTaskMutation();
    const [, moveTasklist] = useMoveTasklistMutation();
    const [, createTasklist] = useCreateTasklistMutation();

    useEffect(() => {
        if (boardId && !fetching && !data) {
            router.push("/checklist/board/error?code=404&msg=Board Not Found&link=/journal")
        }
    }, [boardId, fetching, data])

    const tasklists = data?.myBoard.tasklists
        ? arrayToObject(data?.myBoard.tasklists, "id")
        : undefined
    const tasks = data?.myBoard.tasklists
        ? arrayToObject(
            data.myBoard.tasklists.reduce(
                (accumulator: Task[], tasklist) => [...accumulator, ...(tasklist.tasks ? tasklist.tasks : [])], []
            ), "id"
        )
        : undefined;

    const onDragEnd = (result: DropResult) => {
        const { source, destination, reason, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        if (type === "task") {
            if (source.droppableId === destination.droppableId) {
                if (tasklists && tasklists[destination.droppableId].taskOrder) {
                    if (destination.index > source.index) destination.index++;

                    const prevTaskId = destination.index !== 0
                        ? tasklists[destination.droppableId].taskOrder![destination.index - 1]
                        : undefined;
                    const nextTaskId = destination.index !== tasklists[destination.droppableId].taskOrder!.length - 1
                        ? tasklists[destination.droppableId].taskOrder![destination.index]
                        : undefined;
                    moveTask({ id: draggableId, tasklistId: undefined, prevTaskId, nextTaskId });

                    if (destination.index > source.index) destination.index--;

                    tasklists[source.droppableId].taskOrder!.splice(source.index, 1);
                    tasklists[destination.droppableId].taskOrder!.splice(destination.index, 0, draggableId);
                }
            }
            else {
                if (tasklists) {
                    if (tasklists[destination.droppableId].taskOrder) {
                        const prevTaskId = destination.index !== 0
                            ? tasklists[destination.droppableId].taskOrder![destination.index - 1]
                            : undefined;
                        const nextTaskId = destination.index !== tasklists[destination.droppableId].taskOrder!.length - 1
                            ? tasklists[destination.droppableId].taskOrder![destination.index]
                            : undefined;
                        moveTask({ id: draggableId, tasklistId: destination.droppableId, prevTaskId, nextTaskId });

                        tasklists[source.droppableId].taskOrder!.splice(source.index, 1);
                        tasklists[destination.droppableId].taskOrder!.splice(destination.index, 0, draggableId);
                    }
                    else {
                        moveTask({ id: draggableId, tasklistId: destination.droppableId, prevTaskId: undefined, nextTaskId: undefined });

                        tasklists[source.droppableId].taskOrder!.splice(source.index, 1);
                        tasklists[destination.droppableId].taskOrder = [draggableId];
                    }
                }
            }
        }
        else if (type === "tasklist") {
            if (data?.myBoard.tasklistOrder) {
                if (destination.index > source.index) destination.index++;

                const prevTasklistId = destination.index !== 0
                    ? data.myBoard.tasklistOrder[destination.index - 1]
                    : undefined;
                const nextTasklistId = destination.index !== data.myBoard.tasklistOrder.length - 1
                    ? data.myBoard.tasklistOrder[destination.index]
                    : undefined;
                moveTasklist({ id: draggableId, prevTasklistId, nextTasklistId });

                if (destination.index > source.index) destination.index--;

                data.myBoard.tasklistOrder.splice(source.index, 1);
                data.myBoard.tasklistOrder.splice(destination.index, 0, draggableId);
            }
        }
    }

    const [taskEditorOpen, setTaskEditorOpen] = useState(false);
    const [activeTask, setActiveTask] = useState<undefined | string>();

    const toggleTaskDrawer = useCallback((open: boolean, taskId: string | undefined = undefined) => (
        event: React.KeyboardEvent | React.MouseEvent | undefined,
    ) => {
        if (
            event?.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        if (open && taskId) {
            setActiveTask(taskId)
        } else {
            setActiveTask(undefined)
        }

        setTaskEditorOpen(open);
    }, []);


    const [tasklistEditorOpen, setTasklistEditorOpen] = useState(false);
    const [activeTasklist, setActiveTasklist] = useState<undefined | string>();

    const toggleTasklistDrawer = useCallback((open: boolean, tasklistId: string | undefined = undefined) => (
        event: React.KeyboardEvent | React.MouseEvent | undefined,
    ) => {
        if (
            event?.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        if (open && tasklistId) {
            setActiveTasklist(tasklistId)
        } else {
            setActiveTasklist(undefined)
        }

        setTasklistEditorOpen(open);
    }, []);

    const handleTitleChange = (title: string) => {
        if (data?.myBoard && title !== data?.myBoard.title) {
            updateBoard({ id: data.myBoard.id, title })
        }
    }

    const handleBoardDeletion = async () => {
        if (data?.myBoard?.id) {
            deleteBoard({ id: data.myBoard.id });
            router.push("/checklist")
        }
    }

    return (
        <Layout>
            <HeadWrapper
                header={data?.myBoard.title || "Untitled"}
                helper={fetching ? "Saving..." : `Last edited ${toHumanTime(data?.myBoard.updatedAt)}`}
                buttonFunctions={[
                    {
                        name: "New Tasklist",
                        func: async () => {
                            const tasklist = await createTasklist({ boardId: (boardId as string), title: "Untitled" });

                            if (tasklist?.data?.createTasklist.id) {
                                toggleTasklistDrawer(true, tasklist.data.createTasklist.id)(undefined)
                            }
                        }
                    },
                    {
                        name: "Delete Board",
                        func: handleBoardDeletion
                    }
                ]}
                titleChanger={handleTitleChange}
                backlink="/checklist"
            >
                {(ref) => (<>
                    <EditTask
                        open={taskEditorOpen}
                        toggleDrawer={toggleTaskDrawer}
                        container={ref}
                        task={activeTask ? tasks?.[activeTask] : undefined}
                    />
                    <EditTasklist
                        open={tasklistEditorOpen}
                        toggleDrawer={toggleTasklistDrawer}
                        container={ref}
                        tasklist={activeTasklist ? tasklists?.[activeTasklist] : undefined}
                    />
                    <DragDropContext
                        onDragEnd={onDragEnd}
                    >
                        <Droppable droppableId="all-tasklists" type="tasklist" direction="horizontal">
                            {(provided) => (
                                <RootRef rootRef={provided.innerRef}>
                                    <Box
                                        display="flex"
                                        paddingLeft={4}
                                        flex="300px"
                                        flexGrow={1}
                                        flexShrink={1}
                                        width="calc(100vw - 250px)"
                                        style={{ overflowX: "scroll" }}
                                    >
                                        {(data?.myBoard.tasklistOrder && tasks && tasklists) &&
                                            data.myBoard.tasklistOrder.map((tasklistId, index) => {
                                                return (
                                                    <Column
                                                        key={tasklists[tasklistId].id}
                                                        id={tasklists[tasklistId].id}
                                                        index={index}
                                                        color={tasklists[tasklistId].color}
                                                        toggleTasklistDrawer={toggleTasklistDrawer}
                                                        toggleTaskDrawer={toggleTaskDrawer}
                                                        tasks={
                                                            tasklists[tasklistId].taskOrder
                                                                ? tasklists[tasklistId].taskOrder!
                                                                    .map(taskId => tasks[taskId])
                                                                : []
                                                        }
                                                    >
                                                        {tasklists[tasklistId].title}
                                                    </Column>
                                                )
                                            })}
                                        {provided.placeholder}
                                    </Box>
                                </RootRef>
                            )}
                        </Droppable>
                    </DragDropContext>
                </>)}
            </HeadWrapper>
        </Layout >
    );
};

export default Checklist;