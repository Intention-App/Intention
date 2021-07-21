import { Box, Button, Collapse, Drawer, withStyles } from "@material-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Task, useDeleteTaskMutation, useUpdateTaskMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { DatePicker } from "../util/datePicker";
import { InputCheckbox } from "../util/InputCheckbox";
import { InputField } from "../util/InputField";
import { MenuButton } from "../util/menuButton";

interface EditTaskProps {
    open: boolean;
    toggleDrawer: (open: boolean, taskId?: string) => (e: any) => any;
    container?: HTMLElement | null;
    task?: Task;
};

const DisplacedDrawer = withStyles({
    paper: {
        left: 250
    }
})(Drawer)

export const EditTask: React.FC<EditTaskProps> = ({ open, toggleDrawer, container, task }) => {

    const [, updateTask] = useUpdateTaskMutation();
    const [, deleteTask] = useDeleteTaskMutation();

    const handleTaskDeletion = async () => {
        if (task) await deleteTask({ id: task.id })
        toggleDrawer(false)(undefined)
    };

    return (
        <>
            <DisplacedDrawer anchor="left" style={{ zIndex: 1000 }} open={open} onClose={toggleDrawer(false)} container={container} >
                <Box minWidth={500} padding={4} height="100%" display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="space-between" alignItems="center" >
                        <h3 style={{ margin: 0 }}>Edit Task</h3>
                        <MenuButton options={[
                            {
                                name: "Delete Task",
                                func: handleTaskDeletion
                            }
                        ]}>
                            {<FaTrash style={{ width: 16, height: 16, color: "var(--icon)", cursor: "pointer" }} />}
                        </MenuButton>
                    </Box>
                    {task &&
                        <Formik
                            initialValues={{
                                title: task.title ? task.title : "Untitled",
                                description: task.description ? task.description : "",
                                deadline: !!task.dueAt,
                                dueAt: task.dueAt ? new Date(task.dueAt) : new Date(),
                            }}
                            onSubmit={async (values) => {
                                await updateTask({
                                    id: task.id,
                                    title: values.title,
                                    description: values.description,
                                    dueAt: values.deadline ? values.dueAt : null
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
                                    label="Description"
                                    name="description"
                                    autoComplete="off"
                                    placeholder=""
                                    variant="filled"
                                    multiline
                                    style={{ fontSize: 14, color: "var(--primary)" }}
                                />
                                <Box marginY={4}>
                                    <InputCheckbox
                                        label="Deadline"
                                        name="deadline"
                                    />
                                    <DatePicker
                                        label=""
                                        name="dueAt"
                                        variant="filled"
                                    />
                                </Box>

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
        </>
    );
};