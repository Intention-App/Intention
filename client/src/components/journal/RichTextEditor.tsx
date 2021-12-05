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

    //editor style
    editor: {
        height: "100%",

        "&:focus": {
            outline: "none"
        }
    },

    editorWrapper: {
        height: "100%",
        backgroundColor: colors.background.secondary,
        padding: 16,
        borderRadius: "0px 0px 8px 8px"
    }
});

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ useValue, save }) => {
    const styles = useStyles();

    const [value, setValue] = useValue;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            setValue(editor.getHTML());
        }
    })

    useEffect(() => {
        editor?.view.dom.classList.add(styles.editor)
    }, [editor])

    return (
        // Box to align and scroll editable section
        <Box
            paddingX={4}
            padding={4}
            display="flex"
            flexDirection="column"
            flex="300px"
            flexGrow={1}
            flexShrink={1}
            width="calc(100vw - 250px)"
            style={{ overflowY: "scroll" }}
        >
            {/* Box to align toolbar */}
            {editor &&
                <Box borderRadius="8px 8px 0px 0px">
                    <Toolbar editor={editor} />
                </Box>
            }
            <EditorContent editor={editor} className={styles.editorWrapper} />
        </Box >
    )
}