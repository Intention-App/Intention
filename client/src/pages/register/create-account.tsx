
import { Formik, Form } from "formik";
import React from "react";
import { useRegisterMutation, useVerifyEmailTokenQuery } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from 'next/router'
import Box from "@material-ui/core/Box";
import { RegisterInput } from "../../components/user/RegisterInput";
import { RegisterButton } from "../../components/user/RegisterButton";
import { Divider } from "../../components/filler/divider";
import Link from "next/link";
import { colors } from "../../styles/theme";
import { Error } from "../../components/filler/error";
import { Loading } from "../../components/filler/loading";
import { BrandingHeader } from "../../components/branding/BrandingHeader";
import { useIsAuth } from "../../hooks/util/useIsAuth";

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

// Validation functions, checks if password value is valid
const validatePass = (value: string): string | undefined => {
    let error;
    if (!value) {
        error = "Password required"
    }
    return error;
}

const createAccount: React.FC = () => {

    // Router for later
    const router = useRouter();

    // Token in link
    const { v: token } = router.query as { v: string };

    // Token verification operation
    const [{ data, fetching: verifyFetching }] = useVerifyEmailTokenQuery({ variables: { token } });

    // Email that is fetched from token (possibly undefined if token is not valid)
    const email = data?.verifyEmailToken || undefined;

    // Registration operation for later
    const [{ fetching }, register] = useRegisterMutation();

    return (
        // Box to center align content
        <Box display="flex" flexDirection="column" height="100vh">

            {/* Header for project branding */}
            <BrandingHeader />

            {/* Box to center content */}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} >

                {/* Finish account creation header */}
                <h1 style={{ color: colors.text.title, fontSize: "3em", marginBottom: 24 }}>Finish creating your account!</h1>

                {/* Formik form when email exists */}
                {email &&
                    <Formik

                        // form fields
                        initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
                        onSubmit={async (values, { setErrors }) => {

                            // Register in backend
                            const response = await register({
                                firstName: values.firstName,
                                lastName: values.lastName,
                                password: values.password,
                                token: token
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
                        {({ values }) => (<>
                            <p style={{ marginBottom: "0.5rem" }}>Current Email: <Link href={"mailto:" + email}><a style={{ color: colors.action.primary }}>{email}</a></Link></p>

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
                                        Sign Up
                                    </RegisterButton>
                                </Box>
                            </Form>
                        </>)}
                    </Formik>
                }

                {/* If token is not valid, give 404 error */}
                {(!email && !verifyFetching) &&
                    <Error error={{ code: 404, msg: "Resource Not Found", link: "/register" }} />
                }

                {/* If fetching, use loading animation */}
                {verifyFetching &&
                    <Box height={300}>
                        <Loading />
                    </Box>
                }

                {/* Divider and login link */}
                <Divider length={250} marginTop={3} marginBottom={4} />

                {/* Link to redirect to login */}
                <Link href="/login"><a style={{ color: colors.action.primary }}>Already have an account?</a></Link>

                {/* Terms and Conditions */}
                {/* TODO: Write up some actual legal documents */}
                <p style={{ marginTop: "2rem", maxWidth: 500, textAlign: "center" }}>
                    By signing up, you acknowledge that you have read and understood, and agree to Intention's {" "}
                    <Link href="#"><a><strong><u>Terms and Conditions</u></strong></a></Link> and {" "}
                    <Link href="#"><a><strong><u>Privacy Policy</u></strong></a></Link>.
                </p>
            </Box>
        </Box>
    )
};


export default createAccount;