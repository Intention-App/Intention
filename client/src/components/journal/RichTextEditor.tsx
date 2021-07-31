import { Box, Paper } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { withReact, Slate, Editable } from "slate-react";
import { withLists } from "../../slate/constraints";
import { toSlateElements } from "../../slate/toSlateElements";
import { insertModule } from "./InsertModule";
import { renderElement as renderElementFunction, renderLeaf } from "./SlateElements";
import { SlateToolbar } from "./SlateToolbar";

interface RichTextEditorProps {
    useValue: [Descendant[] | undefined, React.Dispatch<React.SetStateAction<Descendant[] | undefined>>];
    save?: (...params: any) => any;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ useValue, save }) => {
    const editor = useMemo(() => withLists(withReact(createEditor())), [])
    const [value, setValue] = useValue;
    const renderElement = useCallback(renderElementFunction, [])

    return (
        <Slate editor={editor} value={value || [
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ]} onChange={value => setValue(value)}>
            <Box
                paddingX={4}
                padding={4}
                display="flex"
                flexDirection="column"
                flex="300px"
                flexGrow={1}
                flexShrink={1}
                width="calc(100vw - 250px)"
                bgcolor="var(--bg-secondary)"
                style={{ overflowY: "scroll" }}
            >
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={e => {
                        if (e.ctrlKey) {
                            if (e.key === "s" && save) {
                                save();
                                e.preventDefault();
                            }
                            if (e.key === "m") {
                                insertModule("delayArguments", editor)
                            }
                        }
                        toSlateElements(e, editor)
                    }}
                    spellCheck="false"
                    autoCorrect="false"
                    autoCapitalize="false"
                    style={{ height: "100%" }}
                />

                <Box position="absolute" bottom={24}>
                    <SlateToolbar editor={editor} />
                </Box>
            </Box>
        </Slate>
    );
};