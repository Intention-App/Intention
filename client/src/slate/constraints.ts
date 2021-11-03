import { Element, Node, Editor, Transforms } from 'slate'

// #WIP

// Constraints that ensures lists work in slate editor.
export const withLists = (editor: Editor) => {

    // Function that checks and alters nodes when they are changed
    const { normalizeNode } = editor

    // Change function
    editor.normalizeNode = entry => {

        // Get nodes and path of entry
        const [node, path] = entry;

        // Checks if list item is at base layer (not in a bullet or ordered list)
        if (Element.isElement(node) && path.length === 1 && node.type === "listItem") {
            // If it is, reset to paragraph
            // Prevents list items not in an actual list
            Transforms.setNodes(
                editor,
                { type: "paragraph" },
                { at: path }
            )
        }

        // Checks if element is a child of another node
        if (Element.isElement(node) && path.length > 1) {
            // Checks if parent is a list of any sort
            const parent = Node.parent(editor, path);
            if (Element.isElement(parent) && (parent.type === "bulletList" || parent.type === "orderedList"))
                // If it is, set to list element
                // Prevents list items that are paragraphs etc.
                Transforms.setNodes(
                    editor,
                    { type: "listItem" },
                    { at: path }
                )
        }

        // #TODO
        // Add constraints that merge adjacent lists of the same type

        // #TODO
        // Add list indenting

        // Run existing constraints as well
        normalizeNode(entry)
    }
    return editor
}