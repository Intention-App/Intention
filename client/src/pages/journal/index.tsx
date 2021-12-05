import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import React from "react";
import { AddNew } from "../../components/util/AddNew";
import { HeadWrapper } from "../../components/main/HeadWrapper";
import { Layout } from "../../components/main/layout";
import { useCreateEntryMutation, useCreateFolderMutation, useMyEntriesQuery, useMyFoldersQuery } from "../../generated/graphql";
import { toHumanTime } from "../../utils/toHumanTime";
import { FaFileAlt, FaFolder, FaPlus } from "react-icons/fa";
import { ListViewItem } from "../../components/util/ListViewItem";
import { Gradient } from "../../components/util/gradient";
import { colors } from "../../styles/theme";
import { IconContainer } from "../../components/util/IconContainer";

const Journal: React.FC = ({ }) => {

    // Router query for later
    const router = useRouter();

    // Fetch folder and entry data
    const [{ data: folderData }] = useMyFoldersQuery();
    const [{ data: entryData }] = useMyEntriesQuery();

    // Folder CRUD operations
    const [, createFolder] = useCreateFolderMutation();
    const [, createEntry] = useCreateEntryMutation();

    // Function for handling folder creations
    const handleFolderCreation = async () => {
        const response = await createFolder({ title: "Untitled" });
        if (response.data?.createFolder) router.push(`/journal/folder/${response.data.createFolder.id}`)
    }

    // Function for handling entry creations
    const handleEntryCreation = async () => {
        const response = await createEntry({ title: "Untitled" });
        if (response.data?.createEntry) router.push(`/journal/entry/${response.data.createEntry.id}`)
    }

    return (
        // Sidebar & Header Wrappers
        <Layout>
            <HeadWrapper header="My Journal" buttonFunctions={[
                {
                    name: "New Entry",
                    fn: handleEntryCreation
                },
                {
                    name: "New Folder",
                    fn: handleFolderCreation
                }
            ]}
                iconContainer={<IconContainer icon={FaPlus} />}
                buttonColor={colors.action.primary}
            >

                {/* Box for content of page */}
                <Box display="flex" flexDirection="column" height="100%" marginX={4} paddingBottom={2} color={colors.text.primary}>

                    {/* Box for list head */}
                    <Box
                        display="grid"
                        gridTemplateColumns="1fr 200px 200px"
                        borderBottom={`1px solid ${colors.border.primary}`}
                        paddingBottom={1}
                        paddingRight={3.5}
                        marginBottom={1}
                    >
                        <span style={{ marginLeft: 8 }}>Entry Name</span>
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

                            {/* List of folders */}
                            {folderData?.myFolders && folderData?.myFolders.map(folder =>
                                <ListViewItem
                                    key={`folder-${folder.id}`}
                                    createdAt={toHumanTime(folder.createdAt)}
                                    updatedAt={toHumanTime(folder.updatedAt)}
                                    icon={FaFolder}
                                    href={`/journal/folder/${folder.id}`}
                                >
                                    {folder.title}
                                </ListViewItem>
                            )}

                            {/* List of entries */}
                            {entryData?.myEntries && entryData?.myEntries.map(entry =>
                                <ListViewItem
                                    key={`entry-${entry.id}`}
                                    createdAt={toHumanTime(entry.createdAt)}
                                    updatedAt={toHumanTime(entry.updatedAt)}
                                    icon={FaFileAlt}
                                    href={`/journal/entry/${entry.id}`}
                                >
                                    {entry.title}
                                </ListViewItem>
                            )}
                        </Box>

                        {/* Gradient to fade out list at end */}
                        <Gradient direction="top" bottom={0} spread="calc(100% - 12px)" />
                    </Box>

                    {/* Button to add new folders and entries */}
                    <AddNew buttonFunctions={[
                        {
                            name: "New Entry",
                            fn: handleEntryCreation
                        },
                        {
                            name: "New Folder",
                            fn: handleFolderCreation
                        }
                    ]}>
                        Add New File
                    </AddNew>
                </Box>
            </HeadWrapper>
        </Layout>
    );
};

export default Journal;