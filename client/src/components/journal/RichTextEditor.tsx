import Box from '@material-ui/core/Box';
import { Toolbar } from "./toolbar";
import { colors } from "../../styles/theme";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import makeStyles from '@material-ui/styles/makeStyles';
import { useEffect } from 'react';

// Rich Text Editor for the Journal

interface RichTextEditorProps {

    // Use value of slate nodes
    useValue: [string, React.Dispatch<React.SetStateAction<string | undefined>>];

    // Function to save text to database
    save?: (...params: any) => any;
};

const useStyles = makeStyles({

    // Editor style
    editor: {
        flex: "200px 1 1",
        padding: 16,
        overflowY: "scroll",

        "&:focus": {
            outline: "none"
        }
    },

    // Editor container
    editorWrapper: {
        flex: "200px 1 1",
        backgroundColor: colors.background.secondary,
        borderRadius: "0px 0px 8px 8px",
        display: "flex",
        flexDirection:"column"
    }
});

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ useValue, save }) => {

    // Styles of of editors
    const classes = useStyles();

    // State of editor content (for debounce saving)
    const [value, setValue] = useValue;

    // Tiptap editor
    const editor = useEditor({
        extensions: [
            // Extensions for styling
            StarterKit,
            Underline,
        ],

        // Content from backend
        content: value,

        // Sets value to be saved
        onUpdate: ({ editor }) => {
            setValue(editor.getHTML());
        }
    })

    // Appends editor class to element
    useEffect(() => {
        editor?.view.dom.classList.add(classes.editor)
    }, [editor])

    return (
        // Box to align and scroll editable section
        <Box
            paddingX={4}
            padding={4}
            paddingTop={0}
            display="flex"
            flexDirection="column"
            flex="300px"
            flexGrow={1}
            flexShrink={1}
            width="calc(100vw - 250px)"
        >
            {/* Box to align toolbar */}
            {editor &&
                <Box borderRadius="8px 8px 0px 0px">
                    <Toolbar editor={editor} />
                </Box>
            }

            {/* Tiptap editor */}
            <EditorContent editor={editor} className={classes.editorWrapper} />
        </Box >
    )
}