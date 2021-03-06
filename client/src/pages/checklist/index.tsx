import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import React from "react";
import { AddNew } from "../../components/buttons/AddNew";
import { HeadWrapper } from "../../components/main/HeadWrapper";
import { Layout } from "../../components/main/layout";
import { useCreateBoardMutation, useMyBoardsQuery } from "../../generated/graphql";
import { toHumanTime } from "../../utils/toHumanTime";
import { ListViewItem } from "../../components/util/ListViewItem";
import { FaCheckCircle, FaClipboardList, FaPlus } from "react-icons/fa";
import { Gradient } from "../../components/util/gradient";
import { colors } from "../../styles/theme";
import { Breadcrumbs } from "../../components/util/breadcrumbs";
import { IconContainer } from "../../components/buttons/IconContainer";

// Displays list of boards

const Checklist: React.FC = ({ }) => {

    // Router query for later
    const router = useRouter();

    // Fetch board data
    const [{ data }] = useMyBoardsQuery();

    // Board CRUD operations
    const [, createBoard] = useCreateBoardMutation();

    // Function for handling board creations
    const handleBoardCreation = async () => {
        const response = await createBoard({ title: "Untitled" });
        if (response.data?.createBoard) router.push(`/checklist/board/${response.data.createBoard.id}`)
    }

    return (
        // Sidebar & Header Wrappers
        <Layout>
            <HeadWrapper
                header="Checklist"
                buttonFunctions={[
                    {
                        name: "New Kanban Board",
                        fn: handleBoardCreation
                    }
                ]}
                icon={FaCheckCircle}
                iconContainer={<IconContainer icon={FaPlus} />}
            >

                {/* Box for content of page */}
                <Box display="flex" flexDirection="column" height="100%" marginX={4} paddingBottom={2} color={colors.text.primary}>

                    {/* Links to previous pages and functions for current page */}
                    <Breadcrumbs
                        current="My Todos"
                    />

                    {/* Box for list head */}
                    <Box
                        display="grid"
                        gridTemplateColumns="1fr 200px 200px"
                        borderBottom={`1px solid ${colors.border.primary}`}
                        paddingBottom={1}
                        paddingRight={3.5}
                        marginBottom={1}
                    >
                        <span style={{ marginLeft: 8 }}>Board Name</span>
                        <span>Created</span>
                        <span>Last Edited</span>
                    </Box>

                    {/* List container for gradient */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        flex="300px"
                        flexGrow={1}
                        flexShrink={1}
                        position="relative"
                    >

                        {/* List scroll container */}
                        <Box
                            flex="300px"
                            flexGrow={1}
                            flexShrink={1}
                            style={{ overflowY: "scroll" }}
                            paddingRight={2}
                            paddingBottom={2}
                        >

                            {/* List of boards */}
                            {data?.myBoards && data?.myBoards.map(board =>
                                <ListViewItem
                                    key={board.id}
                                    createdAt={toHumanTime(board.createdAt)!}
                                    updatedAt={toHumanTime(board.updatedAt)!}
                                    icon={FaClipboardList}
                                    href={`/checklist/board/${board.id}`}
                                >
                                    {board.title}
                                </ListViewItem>
                            )}
                        </Box>

                        {/* Gradient to fade out list at end */}
                        <Gradient direction="top" bottom={0} spread="calc(100% - 12px)" />
                    </Box>

                    {/* Button to add new boards */}
                    <AddNew variant="bordered" buttonFunctions={[
                        {
                            name: "New Board",
                            fn: handleBoardCreation
                        }
                    ]}>
                        Add New File
                    </AddNew>
                </Box>
            </HeadWrapper>
        </Layout>
    );
};

export default Checklist;