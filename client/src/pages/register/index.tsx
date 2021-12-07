
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { useVerifyEmailMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import Box from "@material-ui/core/Box";
import { RegisterInput } from "../../components/user/RegisterInput";
import { RegisterButton } from "../../components/user/RegisterButton";
import { Divider } from "../../components/util/divider";
import Link from "next/link";
import { colors } from "../../styles/theme";


// Validation functions, checks if email value is valid
const validateEmail = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "Email required"
    } else if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value)) {
        error = "Invalid email"
    }
    return error;
}

// Validation functions, checks if password value is valid
const validatePass = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "Password required"
    }
    else if (value.length <= 6) {
        error = "Password must have >6 characters"
    }
    return error;
}

// Validation functions, checks if passwords are the same
const validateConfPass = (value: string, confirm: string): string | undefined => {
    let error;
    if (!confirm) {
        error = "Please confirm password"
    }
    else if (value !== confirm) {
        error = "Passwords do not match"
    }
    return error;
}

const register: React.FC = () => {

    // Registration operation for later
    const [{ fetching }, verifyEmail] = useVerifyEmailMutation();

    // State to check whether email has been sent
    const [sent, setSent] = useState<string | undefined>(undefined);

    return (
        // Box to center align content
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">

            {/* Sign up header */}
            <h1 style={{ color: colors.text.title, marginBottom: 24 }}>{sent ? "Verify Email" : "Sign Up"}</h1>


            {// Show registration form verification email has not already been sent, else show message
                !sent ?
                    // Formik form
                    < Formik
                        // form fields
                        initialValues={{ email: "", password: "", confirmPassword: "" }}
                        onSubmit={async (values, { setErrors }) => {

                            // Register in backend
                            const response = await verifyEmail({
                                email: values.email,
                                password: values.password
                            });

                            // Reroutes to dashboard if valid, set input errors if not
                            if (response.data?.verifyEmail.success) {
                                setSent(values.email);
                            }
                            else if (response.data?.verifyEmail.errors) {
                                setErrors(toErrorMap(response.data.verifyEmail.errors))
                            }
                        }}
                    >
                        {({ values }) => (
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
                                    <RegisterInput
                                        type="password"
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        validate={() => validateConfPass(values.password, values.confirmPassword)}
                                        required
                                    />

                                    {/* Submits form, disabled when submitting */}
                                    <RegisterButton
                                        disabled={fetching}
                                    >
                                        Sign Up
                                    </RegisterButton>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                    : <Box display="flex" flexDirection="column" alignItems="center">
                        <p style={{ marginBottom: 16 }}>An email containing a verification link has just been sent to{" "}
                            <strong>{sent}</strong>
                        </p>
                        <p style={{ marginBottom: 16 }}>Please verify you email by clicking on the provided link within 24 hours to continue the creation of your account!</p>
                        <p>Did not recieve an email? Check your spam or resend it <a>here</a></p>
                    </Box>
            }



            {/* Divider and login link */}
            <Divider length={250} marginTop={4} marginBottom={2} />

            {/* Link to redirect to login */}
            <Link href="/login"><a>Already have an account?</a></Link>
        </Box >
    )
};

export default register;