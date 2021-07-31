import React from "react";
import { ImageHeadWrapper } from "../components/main/ImageHeadWrapper";
import { Layout } from "../components/main/layout";

const Dashboard: React.FC = ({}) => {
    return(
        <Layout>
            <ImageHeadWrapper
                title={
                    new Date().toLocaleTimeString("default", {
                        hour: "numeric",
                        minute: "numeric"
                    })
                }
                subtitle={
                    new Date().toLocaleDateString("default", {
                        day: "numeric",
                        month: "short",
                        weekday: "short"
                    })
                }
                helper="Hello John! You have 1 meeting today!"
            >

            </ImageHeadWrapper>
        </Layout>
    );
};

export default Dashboard;