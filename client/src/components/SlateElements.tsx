import { RenderElementProps, RenderLeafProps } from "slate-react";
import { BulletListElement, CheckListElement, ListItemElement, OrderedListElement, ParagraphElement } from "../slate/slateTypes"

const Default: React.FC<RenderElementProps & { element: ParagraphElement }> = (props) => {
    return (
        <p {...props.attributes}>{props.children}</p>
    )
}

const BulletList: React.FC<RenderElementProps & { element: BulletListElement }> = (props) => {
    return (
        <ul {...props.attributes}>{props.children}</ul>
    )
}

const OrderedList: React.FC<RenderElementProps & { element: OrderedListElement }> = (props) => {
    return (
        <ol {...props.attributes}>{props.children}</ol>
    )
}

const ListItem: React.FC<RenderElementProps & { element: ListItemElement }> = (props) => {
    return (
        <li {...props.attributes}>{props.children}</li>
    )
}

const CheckList: React.FC<RenderElementProps & { element: CheckListElement }> = (props) => {
    return (
        <p {...props.attributes}><input type="checkbox" />{props.children}</p>
    )
}

const Leaf: React.FC<RenderLeafProps> = props => {
    if (props.leaf.underlined) {
        return (
            <u
                {...props.attributes}
                style={{
                    fontWeight: props.leaf.bold ? "bold" : "normal",
                    fontStyle: props.leaf.italic ? "italic" : "normal",
                }}
            >
                {props.children}
            </u>
        )
    }
    return (
        <span
            {...props.attributes}
            style={{
                fontWeight: props.leaf.bold ? "bold" : "normal",
                fontStyle: props.leaf.italic ? "italic" : "normal",
            }}
        >
            {props.children}
        </span>
    )
}

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

export const renderLeaf = (props: RenderLeafProps) => {
    return <Leaf {...props} />
}