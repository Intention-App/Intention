import { Box, RootRef } from "@material-ui/core";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useDebounce } from "use-debounce";
import { Column } from "../../../components/checklist/column";
import { EditTask } from "../../../components/checklist/editTask";
import { EditTasklist } from "../../../components/checklist/editTasklist";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { Board, Task, Tasklist, useCreateTasklistMutation, useDeleteBoardMutation, useMoveTasklistMutation, useMoveTaskMutation, useMyBoardQuery, useUpdateBoardMutation } from "../../../generated/graphql";
import { arrayToObject } from "../../../utils/arrayToObject";
import { toHumanTime } from "../../../utils/toHumanTime";
import { useDeepCompareEffect } from "../../../utils/useDeepCompareEffect";

interface ClientBoard {
    tasks: Record<string, Task>;
    tasklists: Record<string, Tasklist>;
    tasklistOrder: string[];
    info: Pick<Board, "id" | "title" | "createdAt" | "updatedAt">
}

const Checklist: React.FC = ({ }) => {

    // BoardId from router query
    const router = useRouter();
    const { boardId } = router.query;

    // Fetch data based on id
    const [{ data, fetching }] = useMyBoardQuery({ variables: { id: (boardId as string) } });

    // CRUD Operations
    const [, updateBoard] = useUpdateBoardMutation();
    const [, deleteBoard] = useDeleteBoardMutation();
    const [, createTasklist] = useCreateTasklistMutation();

    // Only use data from initial fetch
    const [board, setBoard] = useState<ClientBoard | undefined>(undefined);
    useEffect(() => {
        if (data?.myBoard && !board) {
            // Record representation of tasks and lists for O(n) indexing 
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

            // better object representation of board
            setBoard({
                tasks: tasks || {},
                tasklists: tasklists || {},
                tasklistOrder: data.myBoard.tasklistOrder || [],
                info: {
                    id: data.myBoard.id,
                    title: data.myBoard.title,
                    createdAt: data.myBoard.createdAt,
                    updatedAt: data.myBoard.updatedAt,
                }
            })
        }
    }, [data])

    // calls API if no change is detected after 5s
    const [debounceBoard] = useDebounce(board, 5000, {equalityFn: (prev, next) => _.isEqual(prev, next)});
    useDeepCompareEffect(()=>{
        console.log(debounceBoard);
        /*
        
        TODO: Fill with API processes
        
        */
        return ()=>{
            console.log(board)
            /*
            
            TODO: Fill with API processes
            
            */
        }
    }, [debounceBoard])

    // Redirect to error page if no such data exists
    useEffect(() => {
        if (boardId && !fetching && !data) {
            router.push("/checklist/board/error?code=404&msg=Board Not Found&link=/journal")
        }
    }, [boardId, fetching, data])

    // DnD dragEnd function
    const onDragEnd = (result: DropResult) => {
        const { source, destination, reason, draggableId, type } = result;

        // return for invalid action or no action
        if (!destination) {
            return;
        }
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        if (board) {
            if (type === "task") {

                // Change task order for same list
                if (source.droppableId === destination.droppableId) {
                    if (board.tasklists && board.tasklists[destination.droppableId].taskOrder) {

                        // New Task order object to mutate
                        const newTaskOrder = [...board.tasklists[destination.droppableId].taskOrder!];

                        newTaskOrder.splice(source.index, 1);
                        newTaskOrder.splice(destination.index, 0, draggableId);

                        // Insert new task order into list
                        const newTasklist = {
                            ...board.tasklists[destination.droppableId],
                            taskOrder: newTaskOrder
                        }

                        // Set new board state
                        setBoard({
                            ...board,
                            tasklists: {
                                ...board.tasklists,
                                [destination.droppableId]: newTasklist
                            }
                        })
                    }
                }
                else {

                    // Change task order for different lists
                    if (board.tasklists) {
                        if (board.tasklists[destination.droppableId].taskOrder) {

                            const newSrcTaskOrder = [...board.tasklists[source.droppableId].taskOrder!];
                            const newDstTaskOrder = [...board.tasklists[destination.droppableId].taskOrder!];

                            newSrcTaskOrder.splice(source.index, 1);
                            newDstTaskOrder.splice(destination.index, 0, draggableId);

                            const newSrcTasklist = {
                                ...board.tasklists[source.droppableId],
                                taskOrder: newSrcTaskOrder
                            };

                            const newDstTasklist = {
                                ...board.tasklists[destination.droppableId],
                                taskOrder: newDstTaskOrder
                            };

                            // Set new board state
                            setBoard({
                                ...board,
                                tasklists: {
                                    ...board.tasklists,
                                    [source.droppableId]: newSrcTasklist,
                                    [destination.droppableId]: newDstTasklist
                                }
                            });

                        }

                        // If taskOrder happens to be null instead of []
                        else {

                            const newSrcTaskOrder = [...board.tasklists[source.droppableId].taskOrder!];
                            const newDstTaskOrder = [draggableId];

                            newSrcTaskOrder.splice(source.index, 1);

                            const newSrcTasklist = {
                                ...board.tasklists[source.droppableId],
                                taskOrder: newSrcTaskOrder
                            };

                            const newDstTasklist = {
                                ...board.tasklists[destination.droppableId],
                                taskOrder: newDstTaskOrder
                            };

                            // Set new board state
                            setBoard({
                                ...board,
                                tasklists: {
                                    ...board.tasklists,
                                    [source.droppableId]: newSrcTasklist,
                                    [destination.droppableId]: newDstTasklist
                                }
                            });
                        }
                    }
                }
            }
            else if (type === "tasklist") {

                // Change tasklist order
                if (board?.tasklistOrder) {

                    // New Task order object to mutate
                    const newTasklistOrder = [...board.tasklistOrder];

                    newTasklistOrder.splice(source.index, 1);
                    newTasklistOrder.splice(destination.index, 0, draggableId);

                    // Set new board state
                    setBoard({
                        ...board,
                        tasklistOrder: newTasklistOrder
                    })
                }
            }
        }
    }

    // Task Editor tracker and toggle
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

    // Tasklist Editor tracker and toggle
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

    // Title change function
    const handleTitleChange = (title: string) => {
        if (board && title !== board.info.title) {
            updateBoard({ id: board.info.id, title })
        }
    }

    // Board deletion & path redirection
    const handleBoardDeletion = async () => {
        if (board?.info.id) {
            deleteBoard({ id: board.info.id });
            router.push("/checklist")
        }
    }

    return (
        <Layout>
            <HeadWrapper
                header={board?.info.title || "Untitled"}
                helper={fetching ? "Saving..." : `Last edited ${toHumanTime(board?.info.updatedAt)}`}
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
                        task={activeTask ? board?.tasks?.[activeTask] : undefined}
                    />
                    <EditTasklist
                        open={tasklistEditorOpen}
                        toggleDrawer={toggleTasklistDrawer}
                        container={ref}
                        tasklist={activeTasklist ? board?.tasklists?.[activeTasklist] : undefined}
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
                                        {(board?.tasklistOrder && board?.tasks && board?.tasklists) &&
                                            board?.tasklistOrder.map((tasklistId, index) => {
                                                return (
                                                    <Column
                                                        key={board?.tasklists[tasklistId].id}
                                                        id={board?.tasklists[tasklistId].id}
                                                        index={index}
                                                        color={board?.tasklists[tasklistId].color}
                                                        toggleTasklistDrawer={toggleTasklistDrawer}
                                                        toggleTaskDrawer={toggleTaskDrawer}
                                                        tasks={
                                                            board?.tasklists[tasklistId].taskOrder
                                                                ? board?.tasklists[tasklistId].taskOrder!
                                                                    .map(taskId => board?.tasks[taskId])
                                                                : []
                                                        }
                                                    >
                                                        {board?.tasklists[tasklistId].title}
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