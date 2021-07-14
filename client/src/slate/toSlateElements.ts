import React from 'react';
import { Editor, Element, Transforms, Text } from "slate"

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

export const isBulletList = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'bulletList',
    })

    return !!match
}

export const setBulletList = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'bulletList',
    })

    Transforms.setNodes(
        editor,
        { type: match ? 'paragraph' : 'listItem' },
        { match: n => Editor.isBlock(editor, n) }
    )
    if (match) {
        Transforms.liftNodes(editor)
        Transforms.unwrapNodes(
            editor,
            { match: n => Editor.isBlock(editor, n) && n.type === "bulletList" }
        )
    }
    else {
        const [orderedMatch] = Editor.nodes(editor, {
            match: (n) => (n as Element).type === 'orderedList',
        })

        if (orderedMatch) {
            Transforms.liftNodes(editor)
        }

        Transforms.wrapNodes(
            editor,
            { type: "bulletList", children: [] },
            { split: false, match: n => Editor.isBlock(editor, n) }
        )
    }
}

export const isOrderedList = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'orderedList',
    })

    return !!match
}

export const setOrderedList = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => (n as Element).type === 'orderedList',
    })

    Transforms.setNodes(
        editor,
        { type: match ? 'paragraph' : 'listItem' },
        { match: n => Editor.isBlock(editor, n) }
    )
    if (match) {
        Transforms.liftNodes(editor)
        Transforms.unwrapNodes(
            editor,
            { match: n => Editor.isBlock(editor, n) && n.type === "orderedList" }
        )
    }
    else {
        const [bulletMatch] = Editor.nodes(editor, {
            match: (n) => (n as Element).type === 'bulletList',
        })

        if (bulletMatch) {
            Transforms.liftNodes(editor)
        }

        Transforms.wrapNodes(
            editor,
            { type: "orderedList", children: [] },
            { split: false, match: n => Editor.isBlock(editor, n) }
        )
    }
}

export const isBold = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.bold,
        universal: true,
    })

    return !!match
}

export const setBold = (editor: Editor) => {
    Transforms.setNodes(
        editor,
        { bold: !isBold(editor) },
        { match: n => Text.isText(n), split: true }
    )
}

export const isItalic = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.italic,
        universal: true,
    })

    return !!match
}

export const setItalic = (editor: Editor) => {
    Transforms.setNodes(
        editor,
        { italic: !isItalic(editor) },
        { match: n => Text.isText(n), split: true }
    )
}

export const isUnderlined= (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.underlined,
        universal: true,
    })

    return !!match
}

export const setUnderlined = (editor: Editor) => {
    Transforms.setNodes(
        editor,
        { underlined: !isUnderlined(editor) },
        { match: n => Text.isText(n), split: true }
    )
}