import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaUnderline } from "react-icons/fa";
import { colors } from "../../styles/theme";
import { Editor } from "@tiptap/react";

// Toolbar for text editor choices

interface ToolbarProps {
    editor: Editor;
}

// Toolbar button styles
const ToolButton = withStyles({
    root: {
        width: 36,
        height: 36,
    }
})(IconButton)

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    return (
        <Box display="flex" padding={1} borderRadius="8px 8px 0px 0px" border={`1px solid ${colors.border.secondary}`} borderBottom="none">

            {/* Button for bolding text */}
            <ToolButton
                style={{
                    backgroundColor: editor.isActive("bold") ? colors.background.hover : undefined,
                    marginRight: 4
                }}
                onClick={() => {
                    editor.chain().focus().toggleBold().run();
                }}
            >
                {/* Bold icon */}
                <FaBold />
            </ToolButton>

            {/* Button for italicizing text */}
            <ToolButton
                style={{
                    backgroundColor: editor.isActive("italic") ? colors.background.hover : undefined,
                    marginRight: 4
                }}
                onClick={() => {
                    editor.chain().focus().toggleItalic().run();
                }}
            >
                {/* Italic icon */}
                <FaItalic size={18} />
            </ToolButton>

            {/* Button for underlining text */}
            <ToolButton
                style={{
                    backgroundColor: editor.isActive("underline") ? colors.background.hover : undefined,
                    marginRight: 8
                }}
                onClick={() => {
                    editor.chain().focus().toggleUnderline().run();
                }}
            >
                {/* Underline icon */}
                <FaUnderline size={28} />
            </ToolButton>

            {/* Button for bullet-listing text */}
            <ToolButton
                style={{
                    backgroundColor: editor.isActive('bulletList') ? colors.background.hover : undefined,
                    marginRight: 4
                }}
                onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                }}
            >
                {/* Unordered list icon */}
                <FaListUl size={28} />
            </ToolButton>

            {/* Button for ordered-listing text */}
            <ToolButton
                style={{ backgroundColor: editor.isActive('orderedList') ? colors.background.hover : undefined }}
                onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                }}
            >
                {/* Ordered list icon */}
                <FaListOl size={28} />
            </ToolButton>
        </Box>
    );
};