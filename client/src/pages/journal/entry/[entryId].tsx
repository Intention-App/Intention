import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Descendant } from "slate";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { RichTextEditor } from "../../../components/journal/RichTextEditor";
import { useDeleteEntryMutation, useMyEntryQuery, useUpdateEntryMutation } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";
import { useDeepCompareEffect } from "../../../utils/useDeepCompareEffect";
import { useDebounce } from "use-debounce";
import _ from "lodash";
import { useSavePrompt } from "../../../utils/useSavePrompt";

const EntryId: React.FC = ({ }) => {

    // FolderId from router query
    const router = useRouter();
    const { entryId } = router.query;

    // Fetch data based on id
    const [{ data, fetching }] = useMyEntryQuery({ variables: { entryId: (entryId as string) } });

    // CRUD operations
    const [{ fetching: updateFetching }, updateEntry] = useUpdateEntryMutation();
    const [, deleteEntry] = useDeleteEntryMutation();

    // Value of entry content
    const [value, setValue] = useState<Descendant[] | undefined>(undefined)

    // Only set entry content on first fetch
    useEffect(() => {
        if (data?.myEntry.content && !value) setValue(data?.myEntry.content as Descendant[]);
    }, [data]);

    // Redirect to error page if no data is found
    useEffect(() => {
        if (entryId && !fetching && !data) {
            router.push("/journal/entry/error?code=404&msg=Entry Not Found&link=/journal")
        }
    }, [entryId, fetching, data])

    // calls API if no change is detected after 5s for autosave
    const [debounceValue] = useDebounce(value, 5000, { equalityFn: (prev, next) => _.isEqual(prev, next) });
    useDeepCompareEffect(() => {
        if (debounceValue && data?.myEntry) updateEntry({ id: data.myEntry.id, content: debounceValue })
    }, [debounceValue])

    // Prompts when page is closed but app is still saving
    useSavePrompt([value, debounceValue], ()=>{
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
                header={data?.myEntry.title || "Untitled"}
                buttonFunctions={[{
                    name: "Delete Entry",
                    fn: handleEntryDeletion
                }]}
                buttonIcon={FaTrash}
                backlink={data?.myEntry?.rootFolderId
                    ? `/journal/folder/${data?.myEntry?.rootFolderId}`
                    : "/journal"
                }
                helper={updateFetching ? "Saving..." : `Last edited ${toHumanTime(data?.myEntry.updatedAt)}`}
                titleChanger={handleTitleChange}
            >
                {/* Rich text editor component for journal */}
                <RichTextEditor
                    useValue={[value, setValue]}
                    save={async () => {
                        if (data?.myEntry) { updateEntry({ id: data.myEntry.id, content: value }) }
                    }}
                />
            </HeadWrapper>
        </Layout>
    );
};

export default EntryId;