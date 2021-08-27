import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Formik, Form } from "formik";
import React from "react";
import { Container } from "../components/util/container";
import { InputField } from "../components/util/InputField";
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

const validateEmail = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }

    if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value)) {
        error = "invalid email"
    }
    return error;
}


const validatePass = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    else if (value.length <= 6) {
        error = "password must be longer than 6 characters"
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
                    initialValues={{ username: "", email: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await register({
                            username: values.username,
                            password: values.password,
                            email: values.email
                        });
                        if (response.data?.register?.user) {
                            router.push("/dashboard")
                        }
                        else if (response.data?.register?.errors) {
                            setErrors(toErrorMap(response.data.register.errors))
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
                                type="email"
                                label="Email"
                                name="email"
                                validate={validateEmail}
                                helper="*required"
                                autoComplete="off"
                                required
                            />
                            <InputField
                                type="password"
                                label="Password"
                                name="password"
                                validate={validatePass}
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