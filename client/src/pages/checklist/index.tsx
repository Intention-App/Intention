import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { AddNew } from "../../components/util/AddNew";
import { HeadWrapper } from "../../components/main/HeadWrapper";
import { Layout } from "../../components/main/layout";
import { useCreateBoardMutation, useMyBoardsQuery } from "../../generated/graphql";
import { toHumanTime } from "../../utils/toHumanTime";
import { Board } from "../../components/checklist/board";

const Journal: React.FC = ({ }) => {

    const router = useRouter();
    const [{ data }] = useMyBoardsQuery();
    const [, createBoard] = useCreateBoardMutation();

    const handleBoardCreation = async () => {
        const response = await createBoard({ title: "Untitled" });
        if (response.data?.createBoard) router.push(`/checklist/board/${response.data.createBoard.id}`)
    }

    return (
        <Layout>
            <HeadWrapper header="My Checklists" buttonFunctions={[
                {
                    name: "New Kanban Board",
                    func: handleBoardCreation
                }
            ]}>
                <Box display="flex" flexDirection="column" height="100%" marginLeft={4} color="var(--primary)">
                    <Box
                        display="grid"
                        gridTemplateColumns="3fr 1fr 1fr"
                        borderBottom="1px solid var(--border)"
                        paddingBottom={1}
                        marginRight={4}
                    >
                        <span style={{ marginLeft: 8 }}>Board Name</span>
                        <span>Created</span>
                        <span>Last Edited</span>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        flex="300px"
                        flexGrow={1}
                        flexShrink={1}
                        style={{ overflowY: "scroll" }}
                        paddingRight={2.5}
                    >
                        {data?.myBoards && data?.myBoards.map(board =>
                            <Board
                                key={board.id}
                                id={board.id}
                                createdAt={toHumanTime(board.createdAt)}
                                updatedAt={toHumanTime(board.updatedAt)}
                            >
                                {board.title}
                            </Board>
                        )}
                        <AddNew buttonFunctions={[
                            {
                                name: "New Board",
                                func: handleBoardCreation
                            }
                        ]}>
                            Add New File
                        </AddNew>
                    </Box>
                </Box>
            </HeadWrapper>
        </Layout>
    );
};

export default Journal;