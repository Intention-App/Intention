import { Editor } from "slate";
import intentionModules from "../../modules"
import { BulletListElement, CustomElement, OrderedListElement } from "../../slate/slateTypes";

// Function to insert text into the journal (Prompt Modules)
export const insertModule = (moduleName: string, editor: Editor) => {

    // Takes journal section of module
    const intentionModule = intentionModules[moduleName].journal;

    // If such a module exists
    if (intentionModule) {

        // Create a list of slate nodes to add
        const nodes = [];

        // Add slate node for title of the module
        if (intentionModule.title) {
            // Node is a paragraph
            const element: CustomElement = { type: "paragraph", children: [{ text: intentionModule.title, bold: true }] };
            nodes.push(element)
        }

        // If journal prompts exist
        if (intentionModule.prompts && intentionModule.prompts.length) {

            // Insert each prompt
            intentionModule.prompts.forEach((prompt) => {
                // Define and insert a blank line to space out text
                const emptySpace: CustomElement = { type: "paragraph", children: [{ text: "" }] };
                nodes.push(emptySpace);

                // Insert the text for the prompt
                const element: CustomElement = { type: "paragraph", children: [{ text: prompt.prompt }] };
                nodes.push(element);

                // Insert the spaces
                if (prompt.space && prompt.type) {

                    // If type is a list
                    if (prompt.type === "bulletList" || prompt.type === "orderedList") {

                        // Insert space type depending on what the module calls for
                        const element: BulletListElement | OrderedListElement = { type: prompt.type, children: [] };

                        // Add list items to list
                        for (let i = 0; i < prompt.space; i++) {
                            element.children.push({ type: "listItem", children: [{ text: "" }] })
                        }

                        // Add list to nodes
                        nodes.push(element);
                    }
                }
            })
        }

        // Insert node set into the journal
        editor.insertFragment(nodes);
    }
}