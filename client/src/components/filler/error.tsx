import Box from "@material-ui/core/Box";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface ErrorProps {
    error?: {
        code: number;
        msg: string;
        link: string;
    }
}

export const Error: React.FC<ErrorProps> = ({ error }) => {

    // Get error queries from router
    const router = useRouter();

    const { code, msg, link } = error || router.query;

    return (

        // Display of errors and back button
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">

            {/* Error code */}
            <h1>{code}</h1>

            {/* Error message */}
            <p>{msg}</p>

            {/* Link back to a certain page */}
            {link &&
                <Link href={link as string}>
                    <a style={{ color: "blue", textDecoration: "underline" }}>
                        Go Back
                    </a>
                </Link>
            }
        </Box>
    );
};