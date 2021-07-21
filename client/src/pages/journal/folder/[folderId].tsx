import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AddNew } from "../../../components/util/AddNew";
import { Entry } from "../../../components/journal/entry";
import { Folder } from "../../../components/journal/folder";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { useCreateEntryMutation, useMyEntriesQuery, useMyFoldersQuery, useMyFolderQuery, useUpdateFolderMutation, useCreateFolderMutation, useDeleteEntryMutation, useDeleteFolderMutation } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";

const FolderId: React.FC = ({ }) => {

    const router = useRouter();
    const { folderId } = router.query;
    const [{ data, fetching }] = useMyFolderQuery({ variables: { id: (folderId as string) } });
    const [{ fetching: updateFetching }, updateFolder] = useUpdateFolderMutation();
    const [, createEntry] = useCreateEntryMutation();
    const [, createFolder] = useCreateFolderMutation();
    const [, deleteFolder] = useDeleteFolderMutation();

    useEffect(() => {
        if (folderId && !fetching && !data) {
            router.push("/journal/folder/error?code=404&msg=Entry Not Found&link=/journal")
        }
    }, [folderId, fetching, data])

    const handleEntryCreation = async () => {
        const response = await createEntry({ folderId: (folderId as string), title: "Untitled" });
        if (response.data?.createEntry) router.push(`/journal/entry/${response.data.createEntry.id}`)
    }

    const handleFolderCreation = async () => {
        const response = await createFolder({ folderId: (folderId as string), title: "Untitled" });
        if (response.data?.createFolder) router.push(`/journal/folder/${response.data.createFolder.id}`)
    }

    const handleFolderDeletion = async () => {
        if (data?.myFolder?.id) {
            deleteFolder({ id: data.myFolder.id });
            router.push(data.myFolder.rootFolderId
                ? `/journal/folder/${data.myFolder.rootFolderId}`
                : "/journal"
            )
        }
    }

    const handleTitleChange = (title: string) => {
        if (data?.myFolder && title !== data?.myFolder.title) {
            updateFolder({ id: data?.myFolder.id, title })
        }
    }

    return (
        <Layout>
            <HeadWrapper
                header={data?.myFolder?.title || "Untitled"}
                buttonFunctions={[
                    {
                        name: "New Entry",
                        func: handleEntryCreation
                    },
                    {
                        name: "New Folder",
                        func: handleFolderCreation
                    },
                    {
                        name: "Delete Folder",
                        func: handleFolderDeletion
                    }
                ]}
                helper={updateFetching ? "Saving..." : `Last edited ${toHumanTime(data?.myFolder.updatedAt)}`}
                backlink={data?.myFolder?.rootFolderId
                    ? `/journal/folder/${data?.myFolder?.rootFolderId}`
                    : "/journal"
                }
                titleChanger={handleTitleChange}
            >
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
                        {data?.myFolder.children && data.myFolder.children.map(folder =>
                            <Folder
                                key={`folder-${folder.id}`}
                                id={folder.id}
                                createdAt={toHumanTime(folder.createdAt)}
                                updatedAt={toHumanTime(folder.updatedAt)}
                            >
                                {folder.title}
                            </Folder>
                        )}
                        {data?.myFolder.content && data.myFolder.content.map(entry => {
                            return <Entry
                                key={`entry-${entry.id}`}
                                id={entry.id}
                                createdAt={toHumanTime(entry.createdAt)}
                                updatedAt={toHumanTime(entry.updatedAt)}
                            >
                                {entry.title}
                            </Entry>;
                        }
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

export default FolderId;

function deleteEntry(arg0: { id: string; }) {
    throw new Error("Function not implemented.");
}
