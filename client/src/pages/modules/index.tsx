import React from "react";;
import { ImageHeadWrapper } from "../../components/main/ImageHeadWrapper";
import { Layout } from "../../components/main/layout";

// Modules Page
// #WIP

const Modules: React.FC = ({ }) => {
    return (
        // Sidebar & Image Header Wrappers
        <Layout>
            <ImageHeadWrapper
                title="Modules"
                subtitle="for self-improvement, productivity, and more!"
                src="/images/Desk.png"
            >
            </ImageHeadWrapper>
        </Layout>
    );
};

export default Modules;