import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { RichTextEditor } from "../../../components/journal/RichTextEditor";
import { useDeleteEntryMutation, useFolderPathQuery, useMyEntryQuery, useUpdateEntryMutation } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";
import { useDebounce } from "use-debounce";
import { useSavePrompt } from "../../../hooks/util/useSavePrompt";
import { Loading } from "../../../components/filler/loading";
import { Breadcrumbs } from "../../../components/util/breadcrumbs";
import { FaBook } from "react-icons/fa";
import Box from "@material-ui/core/Box";

const EntryId: React.FC = ({ }) => {

    // FolderId from router query
    const router = useRouter();
    const { entryId } = router.query;

    // Fetch data based on id
    const [{ data, fetching }] = useMyEntryQuery({ variables: { entryId: (entryId as string) } });
    const [{ data: pathData }] = useFolderPathQuery({ variables: { id: (data?.myEntry?.rootFolderId) as string } });

    // Path data (excluding current entry)
    const folderPath = pathData?.folderPath?.map(folder => ({
        name: folder.title,
        href: `/journal/folder/${folder.id}`
    }));

    // CRUD operations
    const [{ fetching: updateFetching }, updateEntry] = useUpdateEntryMutation();
    const [, deleteEntry] = useDeleteEntryMutation();

    // Value of entry content
    const [value, setValue] = useState<string | undefined>(undefined)

    // Only set entry content on first fetch
    useEffect(() => {
        if (data?.myEntry.content !== undefined && value === undefined) setValue(data?.myEntry.content);
    }, [data]);

    // Redirect to error page if no data is found
    useEffect(() => {
        if (entryId && !fetching && !data) {
            router.push("/journal/entry/error?code=404&msg=Entry Not Found&link=/journal")
        }
    }, [entryId, fetching, data])

    // calls API if no change is detected after 5s for autosave
    const [debounceValue] = useDebounce(value, 5000);
    useEffect(() => {
        if (debounceValue && data?.myEntry) updateEntry({ id: data.myEntry.id, content: debounceValue })
    }, [debounceValue])

    // Prompts when page is closed but app is still saving
    useSavePrompt([value, debounceValue], () => {
        if (value && data?.myEntry) updateEntry({ id: data.myEntry.id, content: value })
    })

    // Function for handling title changes
    const handleTitleChange = (title: string) => {
        if (data?.myEntry && title !== data?.myEntry.title) {
            updateEntry({ id: data.myEntry.id, title })
        }
    }

    // Function for deleting the entry and rerouting to original folder
    const handleEntryDeletion = async () => {
        if (data?.myEntry?.id) {
            router.push(data?.myEntry?.rootFolderId
                ? `/journal/folder/${data?.myEntry?.rootFolderId}`
                : "/journal"
            )
            console.log(data?.myEntry?.rootFolderId
                ? `/journal/folder/${data?.myEntry?.rootFolderId}`
                : "/journal")
            deleteEntry({ id: data.myEntry.id });
        }
    }

    return (

        // Sidebar & Header Wrappers
        <Layout>
            <HeadWrapper
                header={"My Entries"}
                icon={FaBook}
            >

                {/* Box for links */}
                <Box marginX={4} paddingBottom={1}>

                    {/* Links to previous pages and functions for current page */}
                    <Breadcrumbs
                        links={[{
                            name: "My Entries",
                            href: "/journal"
                        }, ...(folderPath || [])]}
                        current={data?.myEntry?.title || "Untitled"}
                        options={[
                            {
                                name: "Delete Folder",
                                fn: handleEntryDeletion
                                // #TODO: add confirmation modal to delete button
                            }]}
                        titleChanger={handleTitleChange}
                        helper={updateFetching ? "Saving..." : toHumanTime(data?.myEntry.updatedAt) ? `Last edited ${toHumanTime(data?.myEntry.updatedAt)}` : "Loading..."}
                    />
                </Box>

                {/* Rich text editor component for journal */}
                {value !== undefined
                    ? <RichTextEditor
                        useValue={[value, setValue]}
                        save={async () => {
                            if (data?.myEntry) { updateEntry({ id: data.myEntry.id, content: value }) }
                        }}
                    />
                    : <Loading />
                }
            </HeadWrapper>
        </Layout>
    );
};

export default EntryId;