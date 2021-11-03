import { BaseEditor } from "slate";
import { ReactEditor} from "slate-react";

// Custom slate elements

export type ParagraphElement = {
    type: 'paragraph';
    children: CustomText[];
}

export type ListItemElement = {
    type: 'listItem';
    level?: number; // Indent level of list
    children: CustomText[];
}

export type BulletListElement = {
    type: 'bulletList';
    children: ListItemElement[]; // Child must be list item
}

export type OrderedListElement = {
    type: 'orderedList';
    children: ListItemElement[];  // Child must be list item
}

export type CheckListElement = {
    type: 'checkList';
    checked: boolean;
    children: CustomText[];
}

export type CustomElement = ParagraphElement | BulletListElement | OrderedListElement | CheckListElement | ListItemElement;

// Styles of text
export type FormattedText = { text: string; bold?: boolean; italic?: boolean, underlined?: boolean };
export type CustomText = FormattedText;

// Add custom declarations to slate
declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}