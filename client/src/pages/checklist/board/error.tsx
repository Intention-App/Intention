import React from "react";
import { Loading } from "../../../components/filler/loading";
import { Layout } from "../../../components/main/layout";
import { Error } from "../../../components/util/error";

const ErrorPage: React.FC = ({ }) => {
    return (
        <Layout>
            <Error />
        </Layout>
    );
};

export default ErrorPage;