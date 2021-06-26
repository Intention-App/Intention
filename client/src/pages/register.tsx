import { Button, Paper } from "@material-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { Container } from "../components/container";
import { InputField } from "../components/fieldinput";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from 'next/router'

const validateName = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    else if (value.length <= 3) {
        error = "username must be longer than 3 characters"
    }
    return error;
}

const validatePass = (value: string, confirm: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    else if (value.length <= 6) {
        error = "password must be longer than 6 characters"
    }
    else if (value !== confirm) {
        error = "passwords do not match"
    }
    return error;
}

const confirmPassword = (value: string, confirm: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    else if (value !== confirm) {
        error = "passwords do not match"
    }
    return error;
}

const register: React.FC = () => {

    const router = useRouter();
    const [{ fetching }, register] = useRegisterMutation();

    return (

        <Container align="center" style={{ minHeight: "100vh" }}>
            <p style={{ color: "var(--secondary)" }}>Create a new account</p>
            <Paper elevation={4} style={{ padding: 16, minHeight: 300, minWidth: 400 }}>
                <Formik
                    initialValues={{ username: "", password: "", confirm_password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await register({ username: values.username, password: values.password });
                        if (response.data?.register?.errors) {
                            setErrors(toErrorMap(response.data.register.errors))
                        }
                        else if (response.data?.register?.user) {
                            router.push("/dashboard")
                        }
                    }}
                >
                    {({ values }) => (
                        <Form>
                            <InputField
                                label="Username"
                                name="username"
                                validate={validateName}
                                helper="*required"
                                autoComplete="off"
                                required
                            />
                            <InputField
                                type="password"
                                label="Password"
                                name="password"
                                validate={(pass) => validatePass(pass, values.confirm_password)}
                                helper="*required"
                                autoComplete="off"
                                required
                            />
                            <InputField
                                type="password"
                                label="Confirm Password"
                                name="confirm_password"
                                validate={(confirm) => confirmPassword(values.password, confirm)}
                                helper="*required"
                                autoComplete="off"
                                required
                            />

                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 16 }}
                                disabled={fetching}
                            >
                                Sign Up
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    )
};

export default register;