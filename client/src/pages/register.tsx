
import { Formik, Form } from "formik";
import React from "react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from 'next/router'
import Box from "@material-ui/core/Box";
import { RegisterInput } from "../components/user/RegisterInput";
import { RegisterButton } from "../components/user/RegisterButton";
import { Divider } from "../components/util/divider";
import Link from "next/link";
import theme from "../styles/theme";

// Validation functions, checks if first name value is valid
const validateFirstName = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "First name required"
    }
    else if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(value)) {
        error = "Name contains invalid characters"
    }
    return error;
}

// Validation functions, checks if last name value is valid
const validateLastName = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "Last name required"
    }
    else if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(value)) {
        error = "Name contains invalid characters"
    }
    return error;
}

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

    // Router for later
    const router = useRouter();

    // Registration operation for later
    const [{ fetching }, register] = useRegisterMutation();

    return (
        // Box to center align content
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">

            {/* Sign up header */}
            <h1 style={{ color: "var(--title)", marginBottom: 24 }}>Sign Up</h1>

            {/* Formik form */}
            <Formik

                // form fields
                initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
                onSubmit={async (values, { setErrors }) => {

                    // Register in backend
                    const response = await register({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        password: values.password,
                        email: values.email
                    });

                    // Reroutes to dashboard if valid, set input errors if not
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

                        {/* Box center aligns values */}
                        <Box display="flex" alignItems="center" flexDirection="column">

                            {/*
                                Input Fields
                            */}
                            
                            <RegisterInput
                                label="First Name"
                                name="firstName"
                                validate={validateFirstName}
                                required
                            />
                            <RegisterInput
                                label="Last Name"
                                name="lastName"
                                validate={validateLastName}
                                required
                            />
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

            {/* Divider and login link */}
            <Divider length={250} marginTop={4} marginBottom={2} />

            <Link href="/login"><a style={{ color: theme.palette.primary.main }}>Already have an account?</a></Link>
        </Box>
    )
};

export default register;