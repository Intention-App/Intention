import Box from "@material-ui/core/Box";
import React, { useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { withReact, Slate, Editable } from "slate-react";
import { withLists } from "../../slate/constraints";
import { toSlateElements } from "../../slate/toSlateElements";
import { colors } from "../../styles/theme";
import { insertModule } from "./InsertModule";
import { renderElement as renderElementFunction, renderLeaf } from "./SlateElements";
import { SlateToolbar } from "./SlateToolbar";

// Rich Text Editor for the Journal

interface RichTextEditorProps {

    // Use value of slate nodes
    useValue: [Descendant[] | undefined, React.Dispatch<React.SetStateAction<Descendant[] | undefined>>];

    // Function to save text to database
    save?: (...params: any) => any;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ useValue, save }) => {

    // Slate Editor with React with custom list constraints
    const editor = useMemo(() => withLists(withReact(createEditor())), []);

    // Value of the rich text
    const [value, setValue] = useValue;

    // Function to render slate elements
    const renderElement = useCallback(renderElementFunction, [])

    return (
        // Slate editor area
        <Slate editor={editor} value={value || [
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ]} onChange={value => setValue(value)}>
            {/* Box to align and scroll editable section */}
            <Box
                paddingX={4}
                padding={4}
                display="flex"
                flexDirection="column"
                flex="300px"
                flexGrow={1}
                flexShrink={1}
                width="calc(100vw - 250px)"
                bgcolor={colors.background.secondary}
                style={{ overflowY: "scroll" }}
            >

                {/* Editing area of slate */}
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={e => {
                        // Control keys with functions
                        if (e.ctrlKey) {

                            // "Ctrl s" saves the entry
                            if (e.key === "s" && save) {
                                save();
                                e.preventDefault();
                            }

                            // #TEST
                            // "Ctrl m" inserts test module
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

                {/* Box to align slate toolbar */}
                <Box position="absolute" bottom={24}>
                    <SlateToolbar editor={editor} />
                </Box>
            </Box>
        </Slate>
    );
};