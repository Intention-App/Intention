import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { Tasklist, useCreateTasklistMutation, useDeleteTasklistMutation, useUpdateTasklistMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";
import { colors } from "../../styles/theme";
import { ModalState } from "../util/ConfirmModal";
import { IconContainer } from "../util/IconContainer";
import { InputField } from "../util/InputField";
import { InputSelect } from "../util/InputSelect";

// Tasklist Editor

export interface EditTasklistProps {

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Func for closing modal
    closeModal: () => any;

    // For confirming actions
    setConfirmationModal: React.Dispatch<React.SetStateAction<ModalState | undefined>>;

    // Tasklist information
    tasklist?: Tasklist;
    boardId?: string;
};


export const EditTasklist: React.FC<EditTasklistProps> = ({ setBoard, tasklist, boardId, setConfirmationModal, closeModal }) => {

    // CRUD operations for later
    const [, createTasklist] = useCreateTasklistMutation();
    const [, updateTasklist] = useUpdateTasklistMutation();
    const [, deleteTasklist] = useDeleteTasklistMutation();

    // Disable button when submit to prevent multiple tasks with same id
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // Tasklist Deletion
    const handleTasklistDeletion = async () => {
        if (tasklist) {

            setBoard(board => {

                if (!board) {
                    return board;
                }

                // New tasklist order without tasklist
                const newTasklistOrder = [...(board.tasklistOrder || [])];

                const tasklistIndex = newTasklistOrder.indexOf(tasklist.id)
                newTasklistOrder.splice(tasklistIndex, 1)

                // Update board state
                return {
                    ...board,
                    tasklistOrder: newTasklistOrder
                }
            })

            // Deletes tasklist in backend too
            console.log(await deleteTasklist({ id: tasklist.id }))
        }

        // Closes editor
        closeModal()
    };

    return (

        // Box for all editor content
        <Box minWidth={500} padding={4} height="100%" display="flex" flexDirection="column">

            {/* Form with Formik */}
            <Formik

                // Fields
                initialValues={{
                    title: tasklist?.title || "Untitled",
                    color: tasklist?.color || ""
                }}

                // Submit function
                onSubmit={async (values) => {

                    // Disable button when submit to prevent multiple tasks with same id
                    setButtonDisabled(true);

                    // If tasklist exists, update tasklist
                    if (tasklist) {
                        // Updates tasklist
                        const newTasklist = await updateTasklist({
                            id: tasklist.id,
                            title: values.title,
                            color: values.color
                        });

                        if (newTasklist.data?.updateTasklist) {
                            setBoard(board => {
                                if (!board) {
                                    return board;
                                }

                                // Updates board with new info
                                return {
                                    ...board,
                                    tasklists: {
                                        ...board.tasklists,
                                        [tasklist.id]: {
                                            ...board.tasklists[tasklist.id],
                                            ...newTasklist.data!.updateTasklist
                                        }
                                    }
                                }
                            })
                        }
                    }

                    // If task does not exist, create new one
                    else {
                        // Creates new tasklist and toggles tasklist drawer
                        const tasklist = await createTasklist({ boardId: (boardId as string), ...values });

                        // Insert new data from backend into frontend
                        if (tasklist.data?.createTasklist) {
                            // Takes id of new tasklist
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
                    }

                    // Closes editor
                    closeModal()
                }}
            >

                {({ values }) => (<>
                    {/* Box for header and menu options */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" >
                        <h3>Edit Tasklist</h3>


                        <Box display="flex" alignItems="center">
                            {/* Delete button, but only when editing existing tasklist */}
                            {tasklist &&
                                <IconButton
                                    onClick={() => {
                                        setConfirmationModal({
                                            message: "Are you sure you want to delete this tasklist?",
                                            fn: handleTasklistDeletion
                                        })
                                    }}
                                >
                                    <FaTrash style={{ width: 20, height: 20, color: colors.icon.primary, cursor: "pointer" }} />
                                </IconButton>
                            }

                            {/* Cancel Changes Button */}
                            <IconButton
                                onClick={() => {

                                    // Open confirmation modal if there are unsaved changes
                                    if (
                                        tasklist?.title != values.title ||
                                        tasklist?.color != values.color
                                    ) {
                                        setConfirmationModal({
                                            message: "There are unsaved changes. Do you still want to cancel?",
                                            fn: closeModal
                                        })
                                    }

                                    // Otherwise, directly close it
                                    else {
                                        closeModal();
                                    }
                                }}
                            >
                                {<IconContainer icon={FaTimes} />}
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Form with Formik controls */}
                    < Form style={{
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

                        {/* #TODO: Make this more accessible and clear */}
                        {/* Color field */}
                        <InputSelect
                            label="Color"
                            name="color"
                            variant="filled"
                            options={[
                                {
                                    name: "Purple",
                                    value: "#6e61fa"
                                },
                                {
                                    name: "Blue",
                                    value: "#246eB9"
                                },
                                {
                                    name: "Sea Green",
                                    value: "#00a6a6"
                                },
                                {
                                    name: "Yellow",
                                    value: "#efca08"
                                },
                                {
                                    name: "Tomato",
                                    value: "#f15025"
                                },
                                {
                                    name: "Orange",
                                    value: "#f08700"
                                },
                                {
                                    name: "Green",
                                    value: "#5efc8d"
                                },
                            ]}
                        />

                        {/* Submit Button */}
                        <Box marginTop="auto">
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 16 }}
                                disabled={buttonDisabled}
                            >
                                Save Tasklist
                            </Button>
                        </Box>
                    </Form>
                </>)}
            </Formik>
        </Box >
    );
};

function createTasklist(arg0: { title: string; color: import("../../generated/graphql").Maybe<string> | undefined; boardId: string; }) {
    throw new Error("Function not implemented.");
}
