import React, { useMemo } from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { withReact, Slate, Editable, ReactEditor } from "slate-react";

type RichElementType = "paragraph";
type CustomText = { text: string; bold?: boolean; italic?: boolean }

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: { type: RichElementType; children: CustomText[] }
        Text: CustomText
    }
}

interface RichTextEditorProps {
    useValue: [Descendant[], React.Dispatch<React.SetStateAction<Descendant[]>>]
    save?: (...params: any) => any;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ useValue, save }) => {
    const editor = useMemo(() => withReact(createEditor()), [])
    const [value, setValue] = useValue;

    return (
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
            <Editable onKeyDown={e => {
                if (e.ctrlKey) {
                    if (e.key === "s" && save) {
                        save();
                        e.preventDefault();
                    }
                }
            }} />
        </Slate>
    );
};