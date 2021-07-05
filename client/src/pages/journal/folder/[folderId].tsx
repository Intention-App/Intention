import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Entry } from "../../../components/entry";
import { Folder } from "../../../components/folder";
import { HeadWrapper } from "../../../components/HeadWrapper";
import { Layout } from "../../../components/layout";
import { useCreateEntryMutation, useMyEntriesQuery, useMyFoldersQuery, useMyFolderQuery } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";

const FolderId: React.FC = ({ }) => {

    const router = useRouter();
    const { folderId } = router.query;
    const [{ data: rootFolderData, fetching: rootFolderFetching }] = useMyFolderQuery({ variables: { id: parseInt(folderId as string) } });
    const [{ data: entryData, fetching: entryFetching }] = useMyEntriesQuery({ variables: { rootFolderId: parseInt(folderId as string) } });
    const [{ data: folderData, fetching: folderFetching }] = useMyFoldersQuery({ variables: { rootFolderId: parseInt(folderId as string) } });
    const [, createEntry] = useCreateEntryMutation();

    useEffect(() => {
        if (folderId && !rootFolderFetching && !rootFolderData) {
            router.push("/journal/folder/error?code=404&msg=Entry Not Found&link=/journal")
        }
    }, [folderId, rootFolderFetching, rootFolderData])

    const handleEntryCreation = async () => {
        const response = await createEntry({ folderId: parseInt(folderId as string), title: "Untitled" });
        if (response.data?.createEntry) router.push(`/journal/entry/${response.data.createEntry.id}`)
    }

    return (
        <Layout>
            <HeadWrapper
                header={rootFolderData?.myFolder?.title ? rootFolderData.myFolder.title : "Untitled"}
                creator={handleEntryCreation}
                helper={rootFolderFetching ? "Saving..." : `Last edited ${toHumanTime(rootFolderData?.myFolder.updatedAt)}`}
                backlink={rootFolderData?.myFolder?.rootFolderId
                    ? `/journal/folder/${rootFolderData?.myFolder?.rootFolderId}`
                    : "/journal"
                }
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
                        {entryData?.myEntries && entryData?.myEntries.map(entry => {
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
                    </Box>
                </Box>
            </HeadWrapper>
        </Layout>
    );

};

export default FolderId;