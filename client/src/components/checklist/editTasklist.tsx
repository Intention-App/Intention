import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles"
import { Formik, Form } from "formik";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Tasklist, useDeleteTasklistMutation, useUpdateTasklistMutation } from "../../generated/graphql";
import { ClientBoard } from "../../pages/checklist/board/[boardId]";
import { InputField } from "../util/InputField";
import { MenuButton } from "../util/menuButton";

// Tasklist Editor

export interface EditTasklistProps {

    // Is the tasklist editor open?
    open: boolean;

    // Toggles task editor
    toggleDrawer: (open: boolean, taskId?: string) => (e: any) => any;

    // Setting board state
    setBoard: React.Dispatch<React.SetStateAction<ClientBoard | undefined>>;

    // Container of editor (if it isn't doc body)
    container?: HTMLElement | null;

    // Tasklist information
    tasklist?: Tasklist;
};

// Drawer styles
const DisplacedDrawer = withStyles({
    paper: {
        left: 250
    }
})(Drawer)


export const EditTasklist: React.FC<EditTasklistProps> = ({ open, toggleDrawer, setBoard, container, tasklist }) => {

    // CRUD operations for later
    const [, updateTasklist] = useUpdateTasklistMutation();
    const [, deleteTasklist] = useDeleteTasklistMutation();

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
            await deleteTasklist({ id: tasklist.id })
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
                    <h3>Edit Tasklist</h3>

                    {/* Delete button */}
                    <MenuButton options={[
                        {
                            name: "Delete Tasklist",
                            fn: handleTasklistDeletion
                        }
                    ]}>
                        {<FaTrash style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }} />}
                    </MenuButton>
                </Box>
                {tasklist &&

                    // Form with Formik
                    <Formik

                        // Fields
                        initialValues={{
                            title: tasklist.title ? tasklist.title : "Untitled",
                            color: tasklist.color
                        }}

                        // Submit function
                        onSubmit={async (values) => {

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
                                >
                                    Save Tasklist
                                </Button>
                            </Box>
                        </Form>
                    </Formik>
                }
            </Box>
        </DisplacedDrawer>
    );
};