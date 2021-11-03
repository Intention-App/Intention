import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaUnderline } from "react-icons/fa";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import { isBold, isBulletList, isItalic, isOrderedList, isUnderlined, setBold, setBulletList, setItalic, setOrderedList, setUnderlined } from "../../slate/toSlateElements";
import { colors } from "../../styles/theme";

// Toolbar for text editor choices

// Toolbar button styles
const ToolButton = withStyles({
    root: {
        width: 36,
        height: 36,
    }
})(IconButton)

export const SlateToolbar: React.FC = ({ }) => {

    // Get editor that is used
    const editor = useSlate()

    return (
        // Container for all buttons
        <Paper elevation={4}>
            <Box display="flex" padding={1}>

                {/* Button for bolding text */}
                <ToolButton
                    style={{
                        backgroundColor: isBold(editor) ? colors.background.hover : undefined,
                        marginRight: 4
                    }}
                    onClick={() => {
                        setBold(editor)
                    }}
                >
                    {/* Bold icon */}
                    <FaBold />
                </ToolButton>

                {/* Button for italicizing text */}
                <ToolButton
                    style={{
                        backgroundColor: isItalic(editor) ? colors.background.hover : undefined,
                        marginRight: 4
                    }}
                    onClick={() => {
                        setItalic(editor)
                    }}
                >
                    {/* Italic icon */}
                    <FaItalic size={18} />
                </ToolButton>

                {/* Button for underlining text */}
                <ToolButton
                    style={{
                        backgroundColor: isUnderlined(editor) ? colors.background.hover : undefined,
                        marginRight: 8
                    }}
                    onClick={() => {
                        setUnderlined(editor)
                    }}
                >
                    {/* Underline icon */}
                    <FaUnderline size={28} />
                </ToolButton>

                {/* Button for bullet-listing text */}
                <ToolButton
                    style={{
                        backgroundColor: isBulletList(editor) ? colors.background.hover : undefined,
                        marginRight: 4
                    }}
                    onClick={() => {
                        setBulletList(editor)
                    }}
                >
                    {/* Unordered list icon */}
                    <FaListUl size={28} />
                </ToolButton>

                {/* Button for ordered-listing text */}
                <ToolButton
                    style={{ backgroundColor: isOrderedList(editor) ? colors.background.hover : undefined }}
                    onClick={() => {
                        setOrderedList(editor)
                    }}
                >
                    {/* Ordered list icon */}
                    <FaListOl size={28} />
                </ToolButton>
            </Box>
        </Paper>
    );
};