import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { AddNew } from "../../components/util/AddNew";
import { Entry } from "../../components/journal/entry";
import { Folder } from "../../components/journal/folder";
import { HeadWrapper } from "../../components/main/HeadWrapper";
import { Layout } from "../../components/main/layout";
import { useCreateEntryMutation, useCreateFolderMutation, useMyEntriesQuery, useMyFoldersQuery } from "../../generated/graphql";
import { toHumanTime } from "../../utils/toHumanTime";

const Journal: React.FC = ({ }) => {

    const router = useRouter();
    const [{ data: entryData }] = useMyEntriesQuery();
    const [{ data: folderData }] = useMyFoldersQuery();
    const [, createEntry] = useCreateEntryMutation();
    const [, createFolder] = useCreateFolderMutation();

    const handleEntryCreation = async () => {
        const response = await createEntry({ title: "Untitled" });
        if (response.data?.createEntry) router.push(`/journal/entry/${response.data.createEntry.id}`)
    }

    const handleFolderCreation = async () => {
        const response = await createFolder({ title: "Untitled" });
        if (response.data?.createFolder) router.push(`/journal/folder/${response.data.createFolder.id}`)
    }

    return (
        <Layout>
            <HeadWrapper header="My Journal" buttonFunctions={[
                {
                    name: "New Entry",
                    func: handleEntryCreation
                },
                {
                    name: "New Folder",
                    func: handleFolderCreation
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
                        <span style={{ marginLeft: 8 }}>Entry Name</span>
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
                        {folderData?.myFolders && folderData?.myFolders.map(folder =>
                            <Folder
                                key={`folder-${folder.id}`}
                                id={folder.id}
                                createdAt={toHumanTime(folder.createdAt)}
                                updatedAt={toHumanTime(folder.updatedAt)}
                            >
                                {folder.title}
                            </Folder>
                        )}
                        {entryData?.myEntries && entryData?.myEntries.map(entry =>
                            <Entry
                                key={`entry-${entry.id}`}
                                id={entry.id}
                                createdAt={toHumanTime(entry.createdAt)}
                                updatedAt={toHumanTime(entry.updatedAt)}
                            >
                                {entry.title}
                            </Entry>
                        )}
                        <AddNew buttonFunctions={[
                            {
                                name: "New Entry",
                                func: handleEntryCreation
                            },
                            {
                                name: "New Folder",
                                func: handleFolderCreation
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