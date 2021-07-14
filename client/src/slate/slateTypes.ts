import { BaseEditor } from "slate";
import { ReactEditor, Slate } from "slate-react";


export type ParagraphElement = {
    type: 'paragraph';
    children: CustomText[];
}

export type ListItemElement = {
    type: 'listItem';
    level?: number;
    children: CustomText[];
}

export type BulletListElement = {
    type: 'bulletList';
    children: ListItemElement[];
}

export type OrderedListElement = {
    type: 'orderedList';
    children: ListItemElement[];
}

export type CheckListElement = {
    type: 'checkList';
    checked: boolean;
    children: CustomText[];
}

export type FormattedText = { text: string; bold?: boolean; italic?: boolean, underlined?: boolean }

export type CustomText = FormattedText

export type CustomElement = ParagraphElement | BulletListElement | OrderedListElement | CheckListElement | ListItemElement;

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}