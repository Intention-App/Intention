import { Box, Paper } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { withReact, Slate, Editable } from "slate-react";
import { withLists } from "../slate/constraints";
import { toSlateElements } from "../slate/toSlateElements";
import { renderElement as renderElementFunction, renderLeaf } from "./SlateElements";
import { SlateToolbar } from "./SlateToolbar";

interface RichTextEditorProps {
    useValue: [Descendant[], React.Dispatch<React.SetStateAction<Descendant[]>>]
    save?: (...params: any) => any;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ useValue, save }) => {
    const editor = useMemo(() => withLists(withReact(createEditor())), [])
    const [value, setValue] = useValue;
    const renderElement = useCallback(renderElementFunction, [])

    return (
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
            <Box
                paddingX={4}
                padding={4}
                display="flex"
                flexDirection="column"
                flex="300px"
                flexGrow={1}
                flexShrink={1}
                style={{ backgroundColor: "var(--bg-secondary)", overflowY: "scroll" }}
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