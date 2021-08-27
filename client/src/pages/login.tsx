import { Button, Paper } from "@material-ui/core";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Container } from "../components/util/container";
import { InputField } from "../components/util/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

const validateName = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    return error;
}

const validatePass = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    return error;
}

const login: React.FC = () => {

    const router = useRouter();
    const [{ fetching }, login] = useLoginMutation();

    return (
        <Container align="center" style={{ minHeight: "100vh" }}>
            <p style={{ color: "var(--secondary)" }}>Sign in to your account</p>
            <Paper elevation={4} style={{ padding: 16, minHeight: 300, minWidth: 400 }}>
                <Formik
                    initialValues={{ username: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await login(values);
                        console.log(response)
                        if (response.data?.login?.user) {
                            router.push("/dashboard")
                        }
                        else if (response.data?.login?.errors) {
                            setErrors(toErrorMap(response.data.login.errors))
                        }
                    }}
                >
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
                            Log In
                        </Button>
                    </Form>
                </Formik>
            </Paper>
        </Container>
    );
};

export default login;