import Box from "@material-ui/core/Box";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { RegisterInput } from "../components/user/RegisterInput";
import { RegisterButton } from "../components/user/RegisterButton";
import { colors } from "../styles/theme";
import { Divider } from "../components/util/divider";
import Link from "next/link";

// Validation functions, checks if first email value is valid
const validateEmail = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "Email required"
    } else if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value)) {
        error = "Invalid email"
    }
    return error;
}

// Validation functions, checks if first password value is valid
const validatePass = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "*required"
    }
    return error;
}

const login: React.FC = () => {

    // Router for later
    const router = useRouter();

    // Login operation for later
    const [{ fetching }, login] = useLoginMutation();

    return (
        // Box to center align content
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">

            {/* Sign up header */}
            <h1 style={{ color: colors.text.title, marginBottom: 24 }}>Log in</h1>

            {/* Formik form */}
            <Formik

                // Form fields
                initialValues={{ email: "", password: "" }}

                onSubmit={async (values, { setErrors }) => {

                    // Login in backend
                    const response = await login(values);

                    // Reroutes to dashboard if valid, set input errors if not
                    if (response.data?.login?.user) {
                        router.push("/dashboard")
                    }
                    else if (response.data?.login?.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    }
                }}
            >
                <Form>

                    {/* Box center aligns values */}
                    <Box display="flex" alignItems="center" flexDirection="column">

                        {/*
                                Input Fields
                            */}

                        <RegisterInput
                            type="email"
                            label="Email"
                            name="email"
                            validate={validateEmail}
                            required
                        />
                        <RegisterInput
                            type="password"
                            label="Password"
                            name="password"
                            validate={validatePass}
                            required
                        />

                        {/* Submits form, disabled when submitting */}
                        <RegisterButton
                            disabled={fetching}
                        >
                            Log In
                        </RegisterButton>
                    </Box>
                </Form>
            </Formik>

            {/* Divider and registration link */}
            <Divider length={250} marginTop={4} marginBottom={2} />

            {/* Link to redirect to signup */}
            <Link href="/register"><a style={{ color: colors.action.primary }}>Create a new account</a></Link>
        </Box>
    );
};

export default login;