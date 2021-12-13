import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { colors } from "../../styles/theme";
import { Editor } from "@tiptap/react";
import { Divider } from "../filler/divider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// Toolbar for text editor choices

interface ToolbarProps {
    editor: Editor;
}

// Toolbar button styles
const ToolButton = withStyles({
    root: {
        width: 36,
        height: 36,
        borderRadius: 8,
        padding: 8,
    }
})(IconButton)

// Select styles
const StyledSelect = withStyles({
    root: {
        width: 175,
        padding: 0,
        paddingLeft: 14,
        lineHeight: "32px",
    },
})(Select)

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            padding={1}
            borderRadius="8px 8px 0px 0px"
            border={`1px solid ${colors.border.secondary}`}
            borderBottom="none"
        >

            {/*
                Marks
            */}

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
                <FormatBoldIcon />
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
                <FormatItalicIcon />
            </ToolButton>

            {/* Button for underlining text */}
            <ToolButton
                style={{
                    backgroundColor: editor.isActive("underline") ? colors.background.hover : undefined
                }}
                onClick={() => {
                    editor.chain().focus().toggleUnderline().run();
                }}
            >
                {/* Underline icon */}
                <FormatUnderlinedIcon />
            </ToolButton>



            <Divider vertical length={24} style={{ margin: "0 8px" }} />


            {/*
                Nodes
            */}


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
                <FormatListBulletedIcon />
            </ToolButton>

            {/* Button for ordered-listing text */}
            <ToolButton
                style={{ backgroundColor: editor.isActive('orderedList') ? colors.background.hover : undefined }}
                onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                }}
            >
                {/* Ordered list icon */}
                <FormatListNumberedIcon />
            </ToolButton>


            {/* Select for paragraphs or headings */}
            <StyledSelect variant="outlined" style={{ width: 175, marginLeft: 8, height: 32 }}
                // Displayed value depends on type of text selected
                value={
                    editor.isActive('heading', { level: 1 })
                        ? 1
                        : editor.isActive('heading', { level: 2 })
                            ? 2
                            : editor.isActive('heading', { level: 3 })
                                ? 3
                                : editor.isActive('heading', { level: 4 })
                                    ? 4
                                    : editor.isActive('heading', { level: 5 })
                                        ? 5
                                        : editor.isActive('heading', { level: 6 })
                                            ? 6
                                            : "p"
                }
                // Changes text type when changed
                onChange={(e) => {
                    // If normal text is not selected, change to coresponding heading
                    if (e.target.value !== "p") {
                        editor.chain().focus().setHeading({ level: (e.target.value as 1 | 2 | 3 | 4 | 5 | 6) }).run();
                    }
                    // Else, change to paragraph
                    else {
                        editor.commands.setParagraph();
                    }
                }}>
                {/* Normal text (paragraph) */}
                <MenuItem value="p" selected>Normal Text</MenuItem>

                {/* Headings 1-6 */}
                <MenuItem value={1}>Heading 1</MenuItem>
                <MenuItem value={2}>Heading 2</MenuItem>
                <MenuItem value={3}>Heading 3</MenuItem>
                <MenuItem value={4}>Heading 4</MenuItem>
                <MenuItem value={5}>Heading 5</MenuItem>
                <MenuItem value={6}>Heading 6</MenuItem>
            </StyledSelect>
        </Box>
    );
};