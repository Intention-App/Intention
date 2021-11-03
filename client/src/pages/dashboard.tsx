import React from "react";
import { ImageHeadWrapper } from "../components/main/ImageHeadWrapper";
import { Layout } from "../components/main/layout";

// Dashboard page for application
// #WIP

const Dashboard: React.FC = ({ }) => {
    return (
        // Sidebar & Image Header Wrappers
        <Layout>
            <ImageHeadWrapper
                // Time of day
                title={
                    new Date().toLocaleTimeString("default", {
                        hour: "numeric",
                        minute: "numeric"
                    })
                }

                // Date
                subtitle={
                    new Date().toLocaleDateString("default", {
                        day: "numeric",
                        month: "short",
                        weekday: "short"
                    })
                }
                // Reminders
                helper="Hello John! You have 1 meeting today!"
            >

            </ImageHeadWrapper>
        </Layout>
    );
};

export default Dashboard;