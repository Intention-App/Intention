import React from 'react';
import { Editor, Element, Transforms, Text } from "slate"

// Functions for altering slate elements

// Keyboard detection for formatting text
export const toSlateElements = (e: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
    if (e.ctrlKey) {
        e.preventDefault()
        switch (e.key) {
            case "b":
                setBold(editor)
                break;
            case "i":
                setItalic(editor)
                break;
            case "u":
                setUnderlined(editor)
                break;
        }
    }
}

// #TODO: Update to smarter selection
// Checks whether selected text is a bulleted list
export const isBulletList = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'bulletList',
    })

    return !!match;
}

// Sets text to bulleted list or resets it to paragraphs
export const setBulletList = (editor: Editor) => {

    // First checks whether if text is already in list
    const match = isBulletList(editor);

    // Sets selected block to paragraph if it is a list item, and vice versa
    Transforms.setNodes(
        editor,
        { type: match ? 'paragraph' : 'listItem' },
        { match: n => Editor.isBlock(editor, n) }
    )

    // #WIP
    // If block is a bullet list item
    if (match) {
        // Lift list item nodes from bullet list
        Transforms.liftNodes(editor);

        // Dissolve bullet list wrapper
        Transforms.unwrapNodes(
            editor,
            { match: n => Editor.isBlock(editor, n) && n.type === "bulletList" }
        )
    }

    // If block is not a bullet list item
    else {
        // #WIP
        // Checks whether if text is in an ordered list
        const [orderedMatch] = Editor.nodes(editor, {
            match: (n) => (n as Element).type === 'orderedList',
        })

        // If in an ordered list
        if (orderedMatch) {
            // Lift nodes from ordered list
            Transforms.liftNodes(editor)
        }

        // Wrap all blocks in a bulleted list
        Transforms.wrapNodes(
            editor,
            { type: "bulletList", children: [] },
            { split: false, match: n => Editor.isBlock(editor, n) }
        )
    }
}

// #TODO: Update to smarter selection
// Checks whether selected text is a ordered list
export const isOrderedList = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'orderedList',
    })

    return !!match
}

// Sets text to ordered list or resets it to paragraphs
export const setOrderedList = (editor: Editor) => {

    // First checks whether if text is already in ordered list
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'orderedList',
    })

    // Sets selected block to paragraph if it is a list item, and vice versa
    Transforms.setNodes(
        editor,
        { type: match ? 'paragraph' : 'listItem' },
        { match: n => Editor.isBlock(editor, n) }
    )


    // #WIP
    // If block is an ordered list item
    if (match) {
        // Lift list item nodes from ordered list
        Transforms.liftNodes(editor);

        // Dissolve ordered list wrapper
        Transforms.unwrapNodes(
            editor,
            { match: n => Editor.isBlock(editor, n) && n.type === "orderedList" }
        )
    }

    // If block is not an ordered list item
    else {
        // #WIP
        // Checks whether if text is in a bulleted list
        const [bulletMatch] = Editor.nodes(editor, {
            match: (n) => (n as Element).type === 'bulletList',
        })

        // If in a bullet list
        if (bulletMatch) {
            // Lift nodes from ordered list
            Transforms.liftNodes(editor)
        }

        // Wrap all blocks in an ordered list
        Transforms.wrapNodes(
            editor,
            { type: "orderedList", children: [] },
            { split: false, match: n => Editor.isBlock(editor, n) }
        )
    }
}

// Checks whether selected text is bold
export const isBold = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.bold,
        universal: true,
    })

    return !!match
}

// Sets text to bold
export const setBold = (editor: Editor) => {
    Transforms.setNodes(
        editor,
        { bold: !isBold(editor) },
        { match: n => Text.isText(n), split: true }
    )
}

// Checks whether selected text is italic
export const isItalic = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.italic,
        universal: true,
    })

    return !!match
}

// Sets text to italic
export const setItalic = (editor: Editor) => {
    Transforms.setNodes(
        editor,
        { italic: !isItalic(editor) },
        { match: n => Text.isText(n), split: true }
    )
}

// Checks whether selected text is underlined
export const isUnderlined = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.underlined,
        universal: true,
    })

    return !!match
}

// Sets text to underlined
export const setUnderlined = (editor: Editor) => {
    Transforms.setNodes(
        editor,
        { underlined: !isUnderlined(editor) },
        { match: n => Text.isText(n), split: true }
    )
}