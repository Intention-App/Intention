import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Descendant } from "slate";
import { HeadWrapper } from "../../../components/main/HeadWrapper";
import { Layout } from "../../../components/main/layout";
import { RichTextEditor } from "../../../components/journal/RichTextEditor";
import { useDeleteEntryMutation, useMyEntryQuery, useUpdateEntryMutation } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";

const EntryId: React.FC = ({ }) => {

    const router = useRouter();
    const { entryId } = router.query;
    const [{ data, fetching }] = useMyEntryQuery({ variables: { entryId: (entryId as string) } });
    const [{ fetching: updateFetching }, updateEntry] = useUpdateEntryMutation();
    const [, deleteEntry] = useDeleteEntryMutation();

    const [value, setValue] = useState<Descendant[] | undefined>(undefined)

    useEffect(() => {
        if (data?.myEntry.content && !value) setValue(data?.myEntry.content as Descendant[]);
    }, [data]);

    useEffect(() => {
        if (entryId && !fetching && !data) {
            router.push("/journal/entry/error?code=404&msg=Entry Not Found&link=/journal")
        }
    }, [entryId, fetching, data])

    const handleTitleChange = (title: string) => {
        if (data?.myEntry && title !== data?.myEntry.title) {
            updateEntry({ id: data.myEntry.id, title })
        }
    }

    const handleEntryDeletion = async () => {
        if (data?.myEntry?.id) {
            deleteEntry({ id: data.myEntry.id });
            router.push(data.myEntry.rootFolderId
                ? `/journal/folder/${data.myEntry.rootFolderId}`
                : "/journal"
            )
        }
    }

    console.log(value)

    return (
        <Layout>
            <HeadWrapper
                header={data?.myEntry.title || "Untitled"}
                buttonFunctions={[{
                    name: "Delete Entry",
                    func: handleEntryDeletion
                }]}
                ButtonIcon={FaTrash}
                backlink={data?.myEntry?.rootFolderId
                    ? `/journal/folder/${data?.myEntry?.rootFolderId}`
                    : "/journal"
                }
                helper={updateFetching ? "Saving..." : `Last edited ${toHumanTime(data?.myEntry.updatedAt)}`}
                titleChanger={handleTitleChange}
            >
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