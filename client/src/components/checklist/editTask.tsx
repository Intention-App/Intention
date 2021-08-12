
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Task, useDeleteTaskMutation, useUpdateTaskMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";
import { DatePicker } from "../util/datePicker";
import { InputCheckbox } from "../util/InputCheckbox";
import { InputField } from "../util/InputField";
import { MenuButton } from "../util/menuButton";

// Task Editor

export interface EditTaskProps {

    // Is the tasklist editor open?
    open: boolean;

    // Toggles task editor
    toggleDrawer: (open: boolean, taskId?: string) => (e: any) => any;

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Container of editor (if it isn't doc body)
    container?: HTMLElement | null;

    // Task information
    task?: Task;
};

// Drawer styles
const DisplacedDrawer = withStyles({
    paper: {
        left: 250
    }
})(Drawer)

export const EditTask: React.FC<EditTaskProps> = ({ open, toggleDrawer, setBoard, container, task }) => {

    // CRUD operations for later
    const [, updateTask] = useUpdateTaskMutation();
    const [, deleteTask] = useDeleteTaskMutation();

    // Task Deletion
    const handleTaskDeletion = async () => {
        if (task) {
            setBoard(board => {

                if (!board) {
                    return board;
                }

                // New task order without task
                const newTaskOrder = [...(board.tasklists[task.tasklistId].taskOrder || [])];

                const taskIndex = newTaskOrder.indexOf(task.id)
                newTaskOrder.splice(taskIndex, 1)

                // New tasklist with new task order
                const newTaskList = {
                    ...board.tasklists[task.tasklistId],
                    taskOrder: newTaskOrder
                }

                // Update board state
                return {
                    ...board,
                    tasklists: {
                        ...board.tasklists,
                        [task.tasklistId]: newTaskList
                    }
                }
            })

            // Deletes task in backend too
            await deleteTask({ id: task.id })
        }

        // Closes editor
        toggleDrawer(false)(undefined)
    };

    return (
        // Tasklist Editor Drawer
        <DisplacedDrawer anchor="left" style={{ zIndex: 1000 }} open={open} onClose={toggleDrawer(false)} container={container} >

            {/* Box for all editor content */}
            <Box minWidth={500} padding={4} height="100%" display="flex" flexDirection="column">

                {/* Box for header and menu options */}
                <Box display="flex" justifyContent="space-between" alignItems="center" >
                    <h3>Edit Task</h3>

                    {/* Delete button */}
                    <MenuButton options={[
                        {
                            name: "Delete Task",
                            fn: handleTaskDeletion
                        }
                    ]}>
                        {<FaTrash style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }} />}
                    </MenuButton>
                </Box>
                {task &&

                    // Form with Formik
                    <Formik

                        // Fields
                        initialValues={{
                            title: task.title ? task.title : "Untitled",
                            description: task.description ? task.description : "",
                            deadline: !!task.dueAt,
                            dueAt: task.dueAt ? new Date(task.dueAt) : new Date(),
                        }}

                        // Submit function
                        onSubmit={async (values) => {

                            // Updates tasklist
                            const newTask = await updateTask({
                                id: task.id,
                                title: values.title,
                                description: values.description,
                                dueAt: values.deadline ? values.dueAt : null
                            });

                            if (newTask.data?.updateTask) {
                                setBoard(board => {
                                    if (!board) {
                                        return board;
                                    }

                                    // Updates board with new info
                                    return {
                                        ...board,
                                        tasks: {
                                            ...board.tasks,
                                            [task.id]: newTask.data!.updateTask
                                        }
                                    }
                                })
                            }

                            // Closes editor
                            toggleDrawer(false)(undefined);
                        }}
                    >
                        {/* Form with Formik controls */}
                        <Form style={{
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: 300,
                            display: "flex",
                            flexDirection: "column"
                        }}>

                            {/* Title field */}
                            <InputField
                                label="Title"
                                name="title"
                                autoComplete="off"
                                placeholder="Untitled"
                                variant="filled"
                            />

                            {/* Description field */}
                            <InputField
                                label="Description"
                                name="description"
                                autoComplete="off"
                                placeholder=""
                                variant="filled"
                                multiline
                                style={{ fontSize: 14, color: "var(--primary)" }}
                            />

                            <Box marginY={4}>
                                {/* Checkbox for due date */}
                                <InputCheckbox
                                    label="Deadline"
                                    name="deadline"
                                />

                                {/* Due date (collapsed if checkbox unchecked) */}
                                <DatePicker
                                    label=""
                                    name="dueAt"
                                    variant="filled"
                                />
                            </Box>

                            {/* Submit button */}
                            <Box marginTop="auto">
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    style={{ marginTop: 16 }}
                                >
                                    Save Task
                                </Button>
                            </Box>
                        </Form>
                    </Formik>
                }
            </Box>
        </DisplacedDrawer>
    );
};