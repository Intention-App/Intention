import RootRef from "@material-ui/core/RootRef";
import Box from "@material-ui/core/Box";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import { DragDropContextProps, DroppableProps } from "react-beautiful-dnd";
import { useDebounce } from "use-debounce";
import { ColumnProps } from "../../../components/checklist/column";
import { EditTaskProps } from "../../../components/checklist/editTask";
import { EditTasklistProps } from "../../../components/checklist/editTasklist";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { Task, Tasklist, Board, useMyBoardQuery } from "../../../generated/graphql";
import { arrayToObject } from "../../../utils/arrayToObject";
import { toHumanTime } from "../../../utils/toHumanTime";
import { toServerBoard } from "../../../utils/toServerBoard";
import { useDeepCompareEffect } from "../../../hooks/util/useDeepCompareEffect";
import { useSavePrompt } from "../../../hooks/util/useSavePrompt";
import { SideModalProps } from "../../../components/util/SideModal";
import { GetStaticPaths, GetStaticProps } from "next";
import { useBoardOps } from "../../../hooks/checklist/useBoardOps";
import { FaPlus } from "react-icons/fa";
import { IconContainer } from "../../../components/util/IconContainer";
import { AddNew } from "../../../components/util/AddNew";
import { ConfirmModal, ModalState } from "../../../components/util/ConfirmModal";
import { Loading } from "../../../components/filler/loading";

const Column = dynamic<ColumnProps>(() => import("../../../components/checklist/column").then(component => component.Column), { ssr: false });
const SideModal = dynamic<SideModalProps>(() => import("../../../components/util/SideModal").then(component => component.SideModal), { ssr: false });
const EditTask = dynamic<EditTaskProps>(() => import("../../../components/checklist/editTask").then(component => component.EditTask), { ssr: false });
const EditTasklist = dynamic<EditTasklistProps>(() => import("../../../components/checklist/editTasklist").then(component => component.EditTasklist), { ssr: false });
const DragDropContext = dynamic<DragDropContextProps>(() => import("react-beautiful-dnd").then(component => component.DragDropContext), { loading: () => <Loading />, ssr: false });
const Droppable = dynamic<DroppableProps>(() => import("react-beautiful-dnd").then(component => component.Droppable), { ssr: false });

interface BoardProps {
    boardId: string;
}

export interface ClientBoard {
    tasks: Record<string, Task>;
    tasklists: Record<string, Tasklist>;
    tasklistOrder: string[];
    info: Pick<Board, "id" | "title" | "createdAt" | "updatedAt">
}

interface EditorTask {
    type: "task"
    id: string | undefined;
    props?: {
        tasklistId: string;
        title?: string;
        dueAt?: string;
    };
}

interface EditorTasklist {
    type: "tasklist"
    id: string | undefined;
    props?: {
        boardId: string;
        title?: string;
        color?: string;
    };
}

export type EditorItem = EditorTask | EditorTasklist;

const Checklist: React.FC<BoardProps> = ({ boardId }) => {

    // BoardId from router query
    const router = useRouter();

    // Fetch data based on id
    const [{ data, fetching }] = useMyBoardQuery({ variables: { id: (boardId as string) } });

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

    // Board Operations
    const [{
        handleTitleChange,
        handleBoardDeletion,
        updateOrder
    }, {
        updateFetching,
        updateOrderFetching
    }, {
        onDragEnd
    }] = useBoardOps(board, setBoard);

    // calls API if no change is detected after 5s
    const [debounceBoard] = useDebounce(board, 5000, { equalityFn: (prev, next) => _.isEqual(prev, next) });
    useDeepCompareEffect(() => {

        if (debounceBoard && data?.myBoard) {
            updateOrder(toServerBoard(debounceBoard, data.myBoard));
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
    useSavePrompt([board, debounceBoard], () => {
        if (board && data?.myBoard) {
            updateOrder(toServerBoard(board, data.myBoard));
        }
    })

    // Redirect to error page if no such data exists
    useEffect(() => {
        if (boardId && !fetching && !data) {
            router.push("/checklist/board/error?code=404&msg=Board Not Found&link=/checklist")
        }
    }, [boardId, fetching, data])

    const [activeItem, setActiveItem] = useState<undefined | EditorItem>();

    const toggleEditorModal = useCallback((item: EditorItem | undefined = undefined) => (
        event: React.KeyboardEvent | React.MouseEvent | undefined,
    ) => {
        if (
            event?.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        if (item) {
            setActiveItem(item)
        } else {
            setActiveItem(undefined)
        }
    }, []);

    const [confirmationModal, setConfirmationModal] = useState<undefined | ModalState>();

    return (

        // Sidebar & Header Wrappers
        <Layout>
            <HeadWrapper
                header={board?.info.title || "Untitled"}
                helper={updateFetching || updateOrderFetching ? "Saving..." : `Last edited ${toHumanTime(board?.info.updatedAt)}`}
                buttonFunctions={[
                    {
                        name: "New Tasklist",
                        fn: toggleEditorModal({ type: "tasklist", id: undefined, props: { boardId } })
                    },
                    "divider",
                    {
                        name: "Delete Board",
                        fn: () => {
                            setConfirmationModal({
                                message: "Are you sure you want to delete this board?",
                                fn: handleBoardDeletion
                            })
                        }
                    }
                ]}
                titleChanger={handleTitleChange}
                backlink="/checklist"
                iconContainer={<IconContainer icon={FaPlus} />}
            >
                {/* Modal container */}
                <SideModal
                    toggleModal={toggleEditorModal}
                    open={!!activeItem}
                >
                    {(closeModal) => {

                        // Modal form based on active item type
                        switch (activeItem?.type) {
                            case "task":
                                return (
                                    // Task editor modal
                                    <EditTask
                                        setConfirmationModal={setConfirmationModal}
                                        closeModal={closeModal}
                                        setBoard={setBoard}
                                        task={activeItem?.id ? board?.tasks?.[activeItem?.id] : undefined}
                                        tasklistId={activeItem?.props?.tasklistId}
                                    />
                                )
                            case "tasklist":
                                return (
                                    // Tasklist editor modal
                                    <EditTasklist
                                        closeModal={closeModal}
                                        setBoard={setBoard}
                                        tasklist={activeItem?.id ? board?.tasklists?.[activeItem?.id] : undefined}
                                        boardId={boardId}
                                    />
                                )
                            default:
                                return;
                        }
                    }}
                </SideModal>

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
                                                    toggleModal={toggleEditorModal}
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

                                    {/* Button to add new tasks */}
                                    <Box width={300}>
                                        <AddNew buttonFunctions={[{
                                            name: "Create New Task",
                                            fn: toggleEditorModal({ type: "tasklist", id: undefined, props: { boardId } })
                                        }]}
                                        >
                                            Add New Tasklist
                                        </AddNew>
                                    </Box>
                                </Box>
                            </RootRef>
                        )}
                    </Droppable>
                </DragDropContext>
            </HeadWrapper>
            <ConfirmModal open={!!confirmationModal} closeModal={() => { setConfirmationModal(undefined) }} fn={confirmationModal?.fn}>{confirmationModal?.message}</ConfirmModal>
        </Layout >
    );
};

export default Checklist;

export const getStaticPaths: GetStaticPaths<{ boardId: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps<BoardProps> = async (context) => {
    const boardId = context.params?.boardId as string;

    return {
        props: { boardId }, // will be passed to the page component as props
    }
}