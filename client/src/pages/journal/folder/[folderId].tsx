import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AddNew } from "../../../components/util/AddNew";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { useCreateEntryMutation, useMyFolderQuery, useUpdateFolderMutation, useCreateFolderMutation, useDeleteEntryMutation, useDeleteFolderMutation } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";
import { FaFolder, FaFileAlt } from "react-icons/fa";
import { ListViewItem } from "../../../components/util/ListViewItem";
import { Gradient } from "../../../components/util/gradient";
import { colors } from "../../../styles/theme";

const FolderId: React.FC = ({ }) => {

    // FolderId from router query
    const router = useRouter();
    const { folderId } = router.query;

    // Fetch data based on id
    const [{ data, fetching }] = useMyFolderQuery({ variables: { id: (folderId as string) } });

    // Folder CRUD operations
    const [{ fetching: updateFetching }, updateFolder] = useUpdateFolderMutation();
    const [, createFolder] = useCreateFolderMutation();
    const [, deleteFolder] = useDeleteFolderMutation();

    // Entry CRUD operations
    const [, createEntry] = useCreateEntryMutation();

    // Redirect to error page if no data is found
    useEffect(() => {
        if (folderId && !fetching && !data) {
            router.push("/journal/folder/error?code=404&msg=Entry Not Found&link=/journal")
        }
    }, [folderId, fetching, data])

    // Function for handling folder creations
    const handleFolderCreation = async () => {
        const response = await createFolder({ folderId: (folderId as string), title: "Untitled" });
        if (response.data?.createFolder) router.push(`/journal/folder/${response.data.createFolder.id}`)
    }

    // Function for handling entry creations
    const handleEntryCreation = async () => {
        const response = await createEntry({ folderId: (folderId as string), title: "Untitled" });
        if (response.data?.createEntry) router.push(`/journal/entry/${response.data.createEntry.id}`)
    }

    // Function for handling title changes
    const handleTitleChange = (title: string) => {
        if (data?.myFolder && title !== data?.myFolder.title) {
            updateFolder({ id: data?.myFolder.id, title })
        }
    }

    // Function for deleting the folder and rerouting to original folder
    const handleFolderDeletion = async () => {
        if (data?.myFolder?.id) {
            deleteFolder({ id: data.myFolder.id });
            router.push(data.myFolder.rootFolderId
                ? `/journal/folder/${data.myFolder.rootFolderId}`
                : "/journal"
            )
        }
    }

    return (
        // Sidebar & Header Wrappers
        <Layout>
            <HeadWrapper
                header={data?.myFolder?.title || "Untitled"}
                buttonFunctions={[
                    {
                        name: "New Entry",
                        fn: handleEntryCreation
                    },
                    {
                        name: "New Folder",
                        fn: handleFolderCreation
                    },
                    "divider",
                    {
                        name: "Delete Folder",
                        fn: handleFolderDeletion
                    }
                ]}
                helper={updateFetching ? "Saving..." : `Last edited ${toHumanTime(data?.myFolder.updatedAt)}`}
                backlink={data?.myFolder?.rootFolderId
                    ? `/journal/folder/${data?.myFolder?.rootFolderId}`
                    : "/journal"
                }
                titleChanger={handleTitleChange}
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
                            {data?.myFolder.folders && data.myFolder.folders.map(folder =>
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
                            {data?.myFolder.entries && data.myFolder.entries.map(entry =>
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

export default FolderId;

function deleteEntry(arg0: { id: string; }) {
    throw new Error("Function not implemented.");
}
