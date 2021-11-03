import { RenderElementProps, RenderLeafProps } from "slate-react";
import { BulletListElement, CheckListElement, ListItemElement, OrderedListElement, ParagraphElement } from "../../slate/slateTypes";

// Default paragraph element
const Default: React.FC<RenderElementProps & { element: ParagraphElement }> = (props) => {
    return (
        <p {...props.attributes}>{props.children}</p>
    )
}

// Bulleted list wrapper
const BulletList: React.FC<RenderElementProps & { element: BulletListElement }> = (props) => {
    return (
        <ul {...props.attributes}>{props.children}</ul>
    )
}

// Ordered list wrapper
const OrderedList: React.FC<RenderElementProps & { element: OrderedListElement }> = (props) => {
    return (
        <ol {...props.attributes}>{props.children}</ol>
    )
}

// List Item element
const ListItem: React.FC<RenderElementProps & { element: ListItemElement }> = (props) => {
    return (
        <li {...props.attributes}>{props.children}</li>
    )
}

// #WIP
// Checklist wrapper
const CheckList: React.FC<RenderElementProps & { element: CheckListElement }> = (props) => {
    return (
        <p {...props.attributes}><input type="checkbox" />{props.children}</p>
    )
}

// Leaves based on styles
const Leaf: React.FC<RenderLeafProps> = props => {

    // Returns leaf with styles of bold, italic, or underlined
    return (
        <span
            {...props.attributes}
            style={{
                fontWeight: props.leaf.bold ? "bold" : "normal",
                fontStyle: props.leaf.italic ? "italic" : "normal",
                textDecoration: props.leaf.underlined ? "underline" : "none"
            }}
        >
            {props.children}
        </span>
    )
}

// Function to render element based on type
export const renderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
        case 'bulletList':
            return <BulletList {...props as RenderElementProps & { element: BulletListElement }} />
        case 'orderedList':
            return <OrderedList {...props as RenderElementProps & { element: OrderedListElement }} />
        case 'checkList':
            return <CheckList {...props as RenderElementProps & { element: CheckListElement }} />
        case 'listItem':
            return <ListItem {...props as RenderElementProps & { element: ListItemElement }} />
        default:
            return <Default {...props as RenderElementProps & { element: ParagraphElement }} />
    }
}

// Function to render leaves
export const renderLeaf = (props: RenderLeafProps) => {
    return <Leaf {...props} />
}