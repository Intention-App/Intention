import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AddNew } from "../../../components/buttons/AddNew";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { useCreateEntryMutation, useMyFolderQuery, useUpdateFolderMutation, useCreateFolderMutation, useDeleteFolderMutation, useFolderPathQuery } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";
import { FaFolder, FaFileAlt, FaPlus, FaBook } from "react-icons/fa";
import { ListViewItem } from "../../../components/util/ListViewItem";
import { Gradient } from "../../../components/util/gradient";
import { colors } from "../../../styles/theme";
import { Breadcrumbs } from "../../../components/util/breadcrumbs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { IconContainer } from "../../../components/buttons/IconContainer";

interface FolderProps {
    folderId: string;
}

const FolderId: NextPage<FolderProps> = ({ folderId }) => {

    // FolderId from router query
    const router = useRouter();

    // Fetch data based on id
    const [{ data, fetching }] = useMyFolderQuery({ variables: { id: folderId } });
    const [{ data: pathData }] = useFolderPathQuery({ variables: { id: folderId } });

    // Path data (excluding current folder)
    const folderPath = pathData?.folderPath?.map(folder => ({
        name: folder.title,
        href: `/journal/folder/${folder.id}`
    }));
    folderPath?.pop()

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
                header={"Journal"}
                buttonFunctions={[
                    {
                        name: "New Entry",
                        fn: handleEntryCreation
                    },
                    {
                        name: "New Folder",
                        fn: handleFolderCreation
                    },
                ]}
                icon={FaBook}
                iconContainer={<IconContainer icon={FaPlus} />}
            >

                {/* Box for content of page */}
                <Box display="flex" flexDirection="column" height="100%" marginX={4} paddingBottom={2} color={colors.text.primary}>

                    {/* Links to previous pages and functions for current page */}
                    <Breadcrumbs
                        links={[{
                            name: "My Entries",
                            href: "/journal"
                        }, ...(folderPath || [])]}
                        current={data?.myFolder?.title || "Untitled"}
                        options={[
                            {
                                name: "Delete Folder",
                                fn: handleFolderDeletion
                                // #TODO: add confirmation modal to delete button
                            }]}
                        titleChanger={handleTitleChange}
                        helper={updateFetching ? "Saving..." : toHumanTime(data?.myFolder.updatedAt) ? `Last edited ${toHumanTime(data?.myFolder.updatedAt)}` : "Loading..."}
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
                                    createdAt={toHumanTime(folder.createdAt)!}
                                    updatedAt={toHumanTime(folder.updatedAt)!}
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
                                    createdAt={toHumanTime(entry.createdAt)!}
                                    updatedAt={toHumanTime(entry.updatedAt)!}
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
                    <AddNew variant="bordered" buttonFunctions={[
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

export const getStaticPaths: GetStaticPaths<{ folderId: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps<FolderProps> = async (context) => {
    const folderId = context.params?.folderId as string;

    return {
        props: { folderId }, // will be passed to the page component as props
    }
}
