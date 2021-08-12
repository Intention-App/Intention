
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import RootRef from "@material-ui/core/RootRef";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaCircle, FaEllipsisH } from "react-icons/fa";
import { Task as TaskType, useCreateTaskMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";
import { AddNew } from "../util/AddNew";
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
    toggleTasklistDrawer: (...props: any) => any;
    toggleTaskDrawer: (...props: any) => any;
};

export const Column: React.FC<ColumnProps> = ({ children, tasks, color, id, index, setBoard, toggleTasklistDrawer, toggleTaskDrawer }) => {

    // CRUD operations for later
    const [, createTask] = useCreateTaskMutation();

    // Task creation
    const handleTaskCreation = async () => {

        // Creates new task in backend
        const task = await createTask({ tasklistId: id, title: "Untitled" });

        if (task?.data?.createTask) {
            const taskId = task.data.createTask.id;

            setBoard(board => {

                if (!board) {
                    return board;
                }
                
                // New task order with task
                const newTaskOrder = [...(board.tasklists[id].taskOrder || []), taskId]
                
                // New tasklist with new task order
                const newTaskList = {
                    ...board.tasklists[id],
                    taskOrder: newTaskOrder
                }

                // Update client board with new info
                return {
                ...board,
                tasklists: {
                    ...board.tasklists,
                    [id]: newTaskList
                },
                tasks: {
                    ...board.tasks,
                    [taskId]: task.data?.createTask!
                }
            }}) 

            // Opens drawer
            toggleTaskDrawer(true, taskId)(undefined)
        }
    }

    return (

        // Tasklists are draggable
        <Draggable draggableId={id} index={index}>
            {(draggableProvided) => (

                // Ref for operations
                <RootRef rootRef={draggableProvided.innerRef}>

                    {/* Container of tasklist */}
                    <Box
                        {...draggableProvided.draggableProps}
                        marginRight={4}
                        bgcolor="var(--bg-primary)"
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
                                onClick={toggleTasklistDrawer(true, id)}
                            >
                                <FaEllipsisH
                                    style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }}
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
                                                toggleDrawer={toggleTaskDrawer}
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

                                        {provided.placeholder}
                                    </Box>
                                </RootRef>
                            )}
                        </Droppable>

                        {/* Button to add new tasks */}
                        <AddNew buttonFunctions={[{
                            name: "Create New Task",
                            fn: handleTaskCreation
                        }]}>
                            Add New Task
                        </AddNew>
                    </Box>
                </RootRef>
            )}
        </Draggable>
    );
};