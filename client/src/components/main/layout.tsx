import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "../../generated/graphql";
import { Sidebar } from "./sidebar";

export const Layout: React.FC = ({ children }) => {

    // Router for later functions
    const router = useRouter();

    // Router redirects to login if user is not logged in
    const [{ data, fetching }] = useMeQuery();
    if (!data?.me && !fetching) {
        router.push("/login");
    }

    // #TODO: Make confirmation modal global

    return (
        // Adds sidebar to application, renders nothing if not logged in
        data?.me
            ? <Box display="grid" gridTemplateColumns="250px 1fr" height="100vh" width="100vw">
                <Sidebar user={data.me} />
                {children}
            </Box>
            : <></>
    );
};