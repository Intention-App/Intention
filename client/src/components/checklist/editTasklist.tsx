import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Tasklist, useCreateTasklistMutation, useDeleteTasklistMutation, useUpdateTasklistMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";
import { colors } from "../../styles/theme";
import { InputField } from "../util/InputField";
import { MenuButton } from "../util/menuButton";

// Tasklist Editor

export interface EditTasklistProps {

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Func for closing modal
    closeModal: (e: any) => any;

    // Tasklist information
    tasklist?: Tasklist;
    boardId?: string;
};


export const EditTasklist: React.FC<EditTasklistProps> = ({ setBoard, tasklist, boardId, closeModal }) => {

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
        closeModal(event)
    };

    return (

        // Box for all editor content
        <Box minWidth={500} padding={4} height="100%" display="flex" flexDirection="column">

            {/* Box for header and menu options */}
            <Box display="flex" justifyContent="space-between" alignItems="center" >
                <h3>Edit Tasklist</h3>

                {/* Delete button */}
                <MenuButton options={[
                    {
                        name: "Delete Tasklist",
                        fn: handleTasklistDeletion
                    }
                ]}>
                    {<FaTrash style={{ width: 16, height: 16, color: colors.icon.primary, cursor: "pointer" }} />}
                </MenuButton>
            </Box>
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
                    closeModal(event)
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

                    {/* Color field */}
                    <InputField
                        label="Color"
                        name="color"
                        autoComplete="off"
                        placeholder=""
                        variant="filled"
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
            </Formik>
        </Box>
    );
};

function createTasklist(arg0: { title: string; color: import("../../generated/graphql").Maybe<string> | undefined; boardId: string; }) {
    throw new Error("Function not implemented.");
}
