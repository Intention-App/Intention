import React from "react";
import { Layout } from "../../../components/layout";
import { Error } from "../../../components/error";

const ErrorPage: React.FC = ({}) => {
    return(
        <Layout>
            <Error />
        </Layout>
    );
};

export default ErrorPage;