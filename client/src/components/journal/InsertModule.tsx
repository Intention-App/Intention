import { Editor } from "slate";
import intentionModules from "../../modules"
import { BulletListElement, CustomElement, OrderedListElement } from "../../slate/slateTypes";

export const insertModule = (moduleName: string, editor: Editor) => {

    const intentionModule = intentionModules[moduleName].journal;

    if (intentionModule) {

        const nodes = [];

        if (intentionModule.title) {
            const element: CustomElement = { type: "paragraph", children: [{ text: intentionModule.title, bold: true }] };
            nodes.push(element)
        }

        if (intentionModule.prompts && intentionModule.prompts.length) {
            intentionModule.prompts.forEach((prompt) => {
                const emptySpace: CustomElement = { type: "paragraph", children: [{ text: "" }] };
                nodes.push(emptySpace);

                const element: CustomElement = { type: "paragraph", children: [{ text: prompt.prompt }] };
                nodes.push(element);

                if (prompt.space && prompt.type) {
                    if (prompt.type === "bulletList" || prompt.type === "orderedList") {

                        const element: BulletListElement | OrderedListElement = { type: prompt.type, children: [] };

                        for (let i = 0; i < prompt.space; i++) {
                            element.children.push({ type: "listItem", children: [{ text: "" }] })
                        }

                        nodes.push(element);
                    }
                }
            })
        }

        editor.insertFragment(nodes);
    }
}