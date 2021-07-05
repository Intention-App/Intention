import { Box, withStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Descendant } from "slate";
import { HeadWrapper } from "../../../components/HeadWrapper";
import { Layout } from "../../../components/layout";
import { RichTextEditor } from "../../../components/RichTextEditor";
import { useMyEntryQuery, useUpdateEntryMutation } from "../../../generated/graphql";
import { toHumanTime } from "../../../utils/toHumanTime";

const EntryId: React.FC = ({ }) => {

    const router = useRouter();
    const { entryId } = router.query;
    const [{ data, fetching }] = useMyEntryQuery({ variables: { entryId: parseInt(entryId as string) } });
    const [{ fetching: fetchingUpdate }, updateEntry] = useUpdateEntryMutation();

    const [value, setValue] = useState<Descendant[]>(
        data?.myEntry.content
            ? data?.myEntry.content as Descendant[]
            : [
                {
                    type: 'paragraph',
                    children: [{ text: '' }],
                },
            ]
    )

    useEffect(() => {
        if (data?.myEntry.content) setValue(data?.myEntry.content as Descendant[]);
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

    return (
        <Layout>
            <HeadWrapper
                header={data?.myEntry.title ? data?.myEntry.title : ""}
                backlink={data?.myEntry?.rootFolderId
                    ? `/journal/folder/${data?.myEntry?.rootFolderId}`
                    : "/journal"
                }
                helper={fetchingUpdate ? "Saving..." : `Last edited ${toHumanTime(data?.myEntry.updatedAt)}`}
                titleChanger={handleTitleChange}
            >
                <Box paddingX={4} padding={4} flex="300px" flexGrow={1} flexShrink={1} style={{ backgroundColor: "var(--bg-secondary)", overflowY: "scroll" }}>
                    <RichTextEditor
                        useValue={[value, setValue]}
                        save={async () => {
                            if (data?.myEntry) { updateEntry({ id: data.myEntry.id, content: value }) }
                        }} />
                </Box>
            </HeadWrapper>
        </Layout>
    );
};

export default EntryId;