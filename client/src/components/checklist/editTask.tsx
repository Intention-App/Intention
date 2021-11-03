
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { IoAlarm } from "react-icons/io5";
import { Task, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";
import { colors } from "../../styles/theme";
import { ModalState } from "../util/ConfirmModal";
import { DatePicker } from "../util/datePicker";
import { IconContainer } from "../util/IconContainer";
import { InputCheckbox } from "../util/InputCheckbox";
import { InputField } from "../util/InputField";

// Task Editor

export interface EditTaskProps {

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Func for closing modal
    closeModal: (e: any) => any;

    // For confirming actions
    setConfirmationModal: React.Dispatch<React.SetStateAction<ModalState | undefined>>;

    // Task information
    task?: Task;
    tasklistId?: string;
};

export const EditTask: React.FC<EditTaskProps> = ({ setBoard, task, tasklistId, closeModal, setConfirmationModal }) => {

    // CRUD operations for later
    const [, createTask] = useCreateTaskMutation();
    const [, updateTask] = useUpdateTaskMutation();
    const [, deleteTask] = useDeleteTaskMutation();

    // Disable button when submit to prevent multiple tasks with same id
    const [buttonDisabled, setButtonDisabled] = useState(false);

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
        closeModal(event);
    };

    return (
        // Box for all editor content
        <Box minWidth={500} padding={4} height="100%" display="flex" flexDirection="column">

            {/* Box for header and menu options */}
            <Box display="flex" justifyContent="space-between" alignItems="center" >
                <h2>Edit Task</h2>

                <Box display="flex" alignItems="center">
                    {/* Delete button */}
                    <IconButton
                        onClick={handleTaskDeletion}
                    >
                        {<FaTrash style={{ width: 20, height: 20, color: colors.icon.primary, cursor: "pointer" }} />}
                    </IconButton>

                    {/* Cancel Changes Button */}
                    <IconButton
                        onClick={() => {
                            setConfirmationModal({
                                message: "There are unsaved changes, do you still want to cancel?",
                                fn: closeModal
                            })
                        }}
                    >
                        {<IconContainer icon={FaTimes} />}
                    </IconButton>
                </Box>
            </Box>

            {/* Form with Formik */}
            <Formik

                // Fields
                initialValues={{
                    title: task?.title ? task.title : "Untitled",
                    description: task?.description ? task.description : "",
                    deadline: !!task?.dueAt,
                    dueAt: task?.dueAt ? new Date(task.dueAt) : undefined,
                }}

                // Submit function
                onSubmit={async (values) => {

                    // Disable button when submit to prevent multiple tasks with same id
                    setButtonDisabled(true);

                    // If task exists, update task
                    if (task?.id) {
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
                    }

                    // If task does not exist, create new one
                    else if (tasklistId) {
                        // Creates new task in backend
                        const task = await createTask({ tasklistId: tasklistId, ...values });

                        if (task?.data?.createTask) {
                            // Takes id of new task
                            const taskId = task.data.createTask.id;

                            setBoard(board => {

                                if (!board) {
                                    return board;
                                }

                                // New task order with task
                                const newTaskOrder = [...(board.tasklists[tasklistId].taskOrder || []), taskId]

                                // New tasklist with new task order
                                const newTaskList = {
                                    ...board.tasklists[tasklistId],
                                    taskOrder: newTaskOrder
                                }

                                // Update client board with new info
                                return {
                                    ...board,
                                    tasklists: {
                                        ...board.tasklists,
                                        [tasklistId]: newTaskList
                                    },
                                    tasks: {
                                        ...board.tasks,
                                        [taskId]: task.data?.createTask!
                                    }
                                }
                            })
                        }
                    }

                    // Closes editor
                    closeModal(event);
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
                        style={{ fontSize: 14, color: colors.text.primary }}
                    />

                    <Box marginY={4}>
                        {/* Checkbox for due date */}
                        <InputCheckbox
                            label="Deadline"
                            name="deadline"
                            icon={IoAlarm}
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
                            disabled={buttonDisabled}
                        >
                            Save Task
                        </Button>
                    </Box>
                </Form>
            </Formik>
        </Box>
    );
};