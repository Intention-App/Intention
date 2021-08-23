import RootRef from "@material-ui/core/RootRef";
import Box from "@material-ui/core/Box";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import { DragDropContextProps, DroppableProps, DropResult } from "react-beautiful-dnd";
import { useDebounce } from "use-debounce";
import { ColumnProps } from "../../../components/checklist/column";
import { EditTaskProps } from "../../../components/checklist/editTask";
import { EditTasklistProps } from "../../../components/checklist/editTasklist";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { Task, Tasklist, Board, useMyBoardQuery, useUpdateBoardMutation, useDeleteBoardMutation, useCreateTasklistMutation, useUpdatePositionsMutation } from "../../../generated/graphql";
import { arrayToObject } from "../../../utils/arrayToObject";
import { toHumanTime } from "../../../utils/toHumanTime";
import { toServerBoard } from "../../../utils/toServerBoard";
import { useDeepCompareEffect } from "../../../utils/useDeepCompareEffect";
import { useSavePrompt } from "../../../utils/useSavePrompt";

const Column = dynamic<ColumnProps>(() => import("../../../components/checklist/column").then(component => component.Column), { ssr: false });
const EditTask = dynamic<EditTaskProps>(() => import("../../../components/checklist/editTask").then(component => component.EditTask), { ssr: false });
const EditTasklist = dynamic<EditTasklistProps>(() => import("../../../components/checklist/editTasklist").then(component => component.EditTasklist), { ssr: false });
const DragDropContext = dynamic<DragDropContextProps>(() => import("react-beautiful-dnd").then(component => component.DragDropContext), { loading: () => <Box>Loading...</Box>, ssr: false });
const Droppable = dynamic<DroppableProps>(() => import("react-beautiful-dnd").then(component => component.Droppable), { ssr: false });

export interface ClientBoard {
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
    const [{ fetching: updateFetching }, updateBoard] = useUpdateBoardMutation();
    const [, deleteBoard] = useDeleteBoardMutation();
    const [, createTasklist] = useCreateTasklistMutation();
    const [{ fetching: updatePosFetching }, updatePositions] = useUpdatePositionsMutation();

    // Only use data from initial fetch
    const [board, setBoard] = useState<ClientBoard | undefined>(undefined);
    useEffect(() => {
        if (data?.myBoard) {

            if (!board) {
                // Record representation of tasks and lists for O(n) indexing 
                const tasklists = data?.myBoard.tasklists
                    ? arrayToObject(data?.myBoard.tasklists, "id")
                    : undefined
                const tasks = data?.myBoard.tasks
                    ? arrayToObject(data.myBoard.tasks, "id")
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
            else {
                setBoard({
                    ...board,
                    info: {
                        ...board.info,
                        updatedAt: data.myBoard.updatedAt,
                    }
                })
            }
        }
    }, [data])

    // calls API if no change is detected after 5s
    const [debounceBoard] = useDebounce(board, 5000, { equalityFn: (prev, next) => _.isEqual(prev, next) });
    useDeepCompareEffect(() => {

        if (debounceBoard && data?.myBoard) {
            updatePositions(toServerBoard(debounceBoard, data.myBoard));
        }

    }, [debounceBoard
        ? {
            tasks: debounceBoard?.tasks,
            tasklists: debounceBoard?.tasklists,
            tasklistOrder: debounceBoard?.tasklistOrder
        }
        : undefined
    ])

    // Prompts when page is closed but app is still saving
    useSavePrompt(board, debounceBoard)

    // Redirect to error page if no such data exists
    useEffect(() => {
        if (boardId && !fetching && !data) {
            router.push("/checklist/board/error?code=404&msg=Board Not Found&link=/checklist")
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

    // Tasklist creation
    const handleTasklistCreation = async () => {
        // Creates new tasklist and toggles tasklist drawer
        const tasklist = await createTasklist({ boardId: (boardId as string), title: "Untitled" });

        // Insert new data from backend into frontend
        if (tasklist.data?.createTasklist) {
            const tasklistId = tasklist.data.createTasklist.id;

            setBoard(board => {

                if (!board) {
                    return board;
                }

                // Add new tasklist to board
                const newTasklistOrder = [...(board.tasklistOrder || []), tasklistId]

                // Update board state
                return {
                    ...board,
                    tasklists: {
                        ...board.tasklists,
                        [tasklistId]: tasklist.data!.createTasklist!
                    },
                    tasklistOrder: newTasklistOrder
                }
            })
        }

        // Opens editor
        if (tasklist?.data?.createTasklist.id) {
            toggleTasklistDrawer(true, tasklist.data.createTasklist.id)(undefined)
        }
    };

    return (

        // Sidebar & Header Wrappers
        <Layout>
            <HeadWrapper
                header={board?.info.title || "Untitled"}
                helper={updateFetching || updatePosFetching ? "Saving..." : `Last edited ${toHumanTime(board?.info.updatedAt)}`}
                buttonFunctions={[
                    {
                        name: "New Tasklist",
                        fn: handleTasklistCreation
                    },
                    "divider",
                    {
                        name: "Delete Board",
                        fn: handleBoardDeletion
                    }
                ]}
                titleChanger={handleTitleChange}
                backlink="/checklist"
            >
                {(ref) => (<>

                    {/* Task editor modal */}
                    <EditTask
                        open={taskEditorOpen}
                        toggleDrawer={toggleTaskDrawer}
                        setBoard={setBoard}
                        container={ref}
                        task={activeTask ? board?.tasks?.[activeTask] : undefined}
                    />

                    {/* Tasklist editor modal */}
                    <EditTasklist
                        open={tasklistEditorOpen}
                        toggleDrawer={toggleTasklistDrawer}
                        setBoard={setBoard}
                        container={ref}
                        tasklist={activeTasklist ? board?.tasklists?.[activeTasklist] : undefined}
                    />

                    {/* Context for React Beautiful DND */}
                    <DragDropContext
                        onDragEnd={onDragEnd}
                    >

                        {/* Drop Area for React Beautiful DND */}
                        <Droppable droppableId="all-tasklists" type="tasklist" direction="horizontal">
                            {(provided) => (

                                // Container and its ref for tasklist
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

                                        {/* Mapping tasklists */}
                                        {(board?.tasklistOrder && board?.tasks && board?.tasklists) &&
                                            board?.tasklistOrder.map((tasklistId, index) => {
                                                return (

                                                    // Tasklist and tasks passed as props
                                                    <Column
                                                        key={board.tasklists[tasklistId].id}
                                                        id={board.tasklists[tasklistId].id}
                                                        index={index}
                                                        color={board?.tasklists[tasklistId].color}
                                                        setBoard={setBoard}
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