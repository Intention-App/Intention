import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaUnderline } from "react-icons/fa";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import { isBold, isBulletList, isItalic, isOrderedList, isUnderlined, setBold, setBulletList, setItalic, setOrderedList, setUnderlined } from "../../slate/toSlateElements";

interface SlateToolbarProps {
    editor: Editor;
};

const ToolButton = withStyles({
    root: {
        width: 36,
        height: 36,
    }
})(IconButton)

export const SlateToolbar: React.FC<SlateToolbarProps> = ({ }) => {
    const editor = useSlate()

    return (
        <Paper elevation={4}>
            <Box display="flex" padding={1}>
                <ToolButton
                    style={{
                        backgroundColor: isBold(editor) ? "var(--bg-hover)" : undefined,
                        marginRight: 4
                    }}
                    onClick={() => {
                        setBold(editor)
                    }}
                >
                    <FaBold />
                </ToolButton>
                <ToolButton
                    style={{
                        backgroundColor: isItalic(editor) ? "var(--bg-hover)" : undefined,
                        marginRight: 4
                    }}
                    onClick={() => {
                        setItalic(editor)
                    }}
                >
                    <FaItalic size={18} />
                </ToolButton>
                <ToolButton
                    style={{
                        backgroundColor: isUnderlined(editor) ? "var(--bg-hover)" : undefined,
                        marginRight: 8
                    }}
                    onClick={() => {
                        setUnderlined(editor)
                    }}
                >
                    <FaUnderline size={28} />
                </ToolButton>
                <ToolButton
                    style={{
                        backgroundColor: isBulletList(editor) ? "var(--bg-hover)" : undefined,
                        marginRight: 4
                    }}
                    onClick={() => {
                        setBulletList(editor)
                    }}
                >
                    <FaListUl size={28} />
                </ToolButton>
                <ToolButton
                    style={{ backgroundColor: isOrderedList(editor) ? "var(--bg-hover)" : undefined }}
                    onClick={() => {
                        setOrderedList(editor)
                    }}
                >
                    <FaListOl size={28} />
                </ToolButton>
            </Box>
        </Paper>
    );
};