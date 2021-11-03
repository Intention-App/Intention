import { useRouter } from "next/router";
import { DropResult } from "react-beautiful-dnd";
import { useDeleteBoardMutation, useUpdateBoardMutation, useUpdateOrderMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";

export const useBoardOps = (
    board: ClientBoard | undefined,
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>
) => {

    // Next Router
    const router = useRouter();

    // CRUD Operations
    const [{ fetching: updateFetching }, updateBoard] = useUpdateBoardMutation();
    const [, deleteBoard] = useDeleteBoardMutation();
    const [{ fetching: updateOrderFetching }, updateOrder] = useUpdateOrderMutation();

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

    // DnD dragEnd function
    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId, type } = result;

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

                        // Remove id from source index
                        newTaskOrder.splice(source.index, 1);

                        // Place id at destination index
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

                            // Remove id from source
                            newSrcTaskOrder.splice(source.index, 1);

                            // Place id at destination
                            newDstTaskOrder.splice(destination.index, 0, draggableId);

                            // Adds new order to tasklists
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
                            const newDstTaskOrder = [draggableId]; // With id already (no need to consider position)

                            // Remove id from source
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

                    // Remove id from old index
                    newTasklistOrder.splice(source.index, 1);

                    // Place id at destination index
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

    return [
        {
            handleTitleChange,
            handleBoardDeletion,
            updateBoard,
            updateOrder
        },
        {
            updateFetching,
            updateOrderFetching
        },
        {
            onDragEnd,
        }
    ] as const;
}