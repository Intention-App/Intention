import { Element, Node, Editor, Transforms } from 'slate'

export const withLists = (editor: Editor) => {
    const { normalizeNode } = editor

    editor.normalizeNode = entry => {
        const [node, path] = entry;

        if (Element.isElement(node) && path.length === 1 && node.type === "listItem") {
            Transforms.setNodes(
                editor,
                { type: "paragraph" },
                { at: path }
            )
        }

        if (Element.isElement(node) && path.length > 1) {
            const parent = Node.parent(editor, path);
            if (Element.isElement(parent) && (parent.type === "bulletList" || parent.type === "orderedList"))
                Transforms.setNodes(
                    editor,
                    { type: "listItem" },
                    { at: path }
                )
        }

        normalizeNode(entry)
    }
    return editor
}