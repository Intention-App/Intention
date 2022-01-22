import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Divider } from "../../../components/filler/divider";
import { Layout } from "../../../components/main/layout";
import { ModulesHeadWrapper } from "../../../components/modules/ModulesHeadWrapper";
import { colors } from "../../../styles/theme";
import { FaCloudDownloadAlt } from "react-icons/fa";

// Modules Page
// #WIP

// Button styles
const StyledButton = withStyles({
    root: {
        padding: 8,
        borderRadius: 16
    },
})(Button)

const Library: React.FC = ({ }) => {



    return (
        // Sidebar & Image Header Wrappers
        <Layout>
            <ModulesHeadWrapper>
                <h2 style={{ color: colors.text.title, fontSize: 18 }}>Featured</h2>
                <Divider marginBottom="1rem" marginTop="0.5rem" />
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr"
                    gridTemplateRows="1fr 1fr"
                    gridTemplateAreas={`"main main secondary-1" "main main secondary-2"`}
                    gridColumnGap="1rem"
                    gridRowGap="1rem"
                    height={300}
                >
                    <Box width="100%" height="100%" bgcolor="#c4c4c4" borderRadius={16} gridArea="main"></Box>
                    <Box width="100%" height="100%" bgcolor="#c4c4c4" borderRadius={16} gridArea="secondary-1"></Box>
                    <Box width="100%" height="100%" bgcolor="#c4c4c4" borderRadius={16} gridArea="secondary-2"></Box>
                </Box>

                <h2 style={{ color: colors.text.title, fontSize: 18, marginTop: 32 }}>Recommended for You!</h2>
                <Divider marginBottom="1rem" marginTop="0.5rem" />
                <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    height={175}
                    overflow="scroll"
                    paddingBottom={1}
                >
                    <Box display="flex" marginRight={3}>
                        <Box width={150} height={150} bgcolor="#c4c4c4" borderRadius={16}></Box>
                        <Box width={200} marginLeft={2} display="flex" flexDirection="column">
                            <h3 style={{ color: colors.text.title, fontSize: 18 }}>Lorem Ipsum</h3>
                            <p style={{ flexGrow: 1, marginTop: 8 }}>Basic description or prompt to encourage you to click into this</p>

                            <StyledButton
                                type="submit"
                                color="primary"
                                variant="contained"
                            >
                                Implement
                                <FaCloudDownloadAlt size={24} style={{ marginLeft: 8 }} />
                            </StyledButton>
                        </Box>
                    </Box>
                </Box>
                <Box paddingBottom={2}></Box>
            </ModulesHeadWrapper>
        </Layout>
    );
};

export default Library;