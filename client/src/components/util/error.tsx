import { Box } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const Error: React.FC = ({ }) => {

    const router = useRouter();
    const { code, msg, link } = router.query;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <h1>{code}</h1>
            <p>{msg}</p>
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