import { Box, Button, Collapse, Drawer, withStyles } from "@material-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Tasklist, useDeleteTasklistMutation, useUpdateTasklistMutation } from "../../generated/graphql";
import { DatePicker } from "../util/datePicker";
import { InputCheckbox } from "../util/InputCheckbox";
import { InputField } from "../util/InputField";
import { MenuButton } from "../util/menuButton";

interface EditTasklistProps {
    open: boolean;
    toggleDrawer: (open: boolean, taskId?: string) => (e: any) => any;
    container?: HTMLElement | null;
    tasklist?: Tasklist;
};

const DisplacedDrawer = withStyles({
    paper: {
        left: 250
    }
})(Drawer)

export const EditTasklist: React.FC<EditTasklistProps> = ({ open, toggleDrawer, container, tasklist }) => {

    const [, updateTasklist] = useUpdateTasklistMutation();
    const [, deleteTasklist] = useDeleteTasklistMutation();

    const handleTaskDeletion = async () => {
        if (tasklist) await deleteTasklist({ id: tasklist.id })
        toggleDrawer(false)(undefined)
    };

    return (
        <>
            <DisplacedDrawer anchor="left" style={{ zIndex: 1000 }} open={open} onClose={toggleDrawer(false)} container={container} >
                <Box minWidth={500} padding={4} height="100%" display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="space-between" alignItems="center" >
                        <h3 style={{ margin: 0 }}>Edit Tasklist</h3>
                        <MenuButton options={[
                            {
                                name: "Delete Tasklist",
                                func: handleTaskDeletion
                            }
                        ]}>
                            {<FaTrash style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }} />}
                        </MenuButton>
                    </Box>
                    {tasklist &&
                        <Formik
                            initialValues={{
                                title: tasklist.title ? tasklist.title : "Untitled",
                                color: tasklist.color
                            }}
                            onSubmit={async (values) => {
                                await updateTasklist({
                                    id: tasklist.id,
                                    title: values.title,
                                    color: values.color
                                });
                                toggleDrawer(false)(undefined);
                            }}
                        >
                            <Form style={{
                                flexGrow: 1,
                                flexShrink: 1,
                                flexBasis: 300,
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <InputField
                                    label="Title"
                                    name="title"
                                    autoComplete="off"
                                    placeholder="Untitled"
                                    variant="filled"
                                />
                                <InputField
                                    label="Color"
                                    name="color"
                                    autoComplete="off"
                                    placeholder=""
                                    variant="filled"
                                />

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
        </>
    );
};