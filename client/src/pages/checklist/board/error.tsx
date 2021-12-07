import React from "react";
import { Layout } from "../../../components/main/layout";
import { Error } from "../../../components/filler/error";

const ErrorPage: React.FC = ({ }) => {
    return (
        <Layout>
            <Error />
        </Layout>
    );
};

export default ErrorPage;