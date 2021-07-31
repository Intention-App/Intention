import { IntentionModule } from ".";

export const delayArguments: IntentionModule = {
    name: "Arguments against Procrastination",
    journal: {
        title: "Arguments against Procrastination",
        prompts: [
            {
                prompt: "I'm delaying ______ because ______",
            },
            {
                prompt: "Reasons for delay:",
                space: 4,
                type: "orderedList"
            },
            {
                prompt: "Arguments against delay:",
                space: 4,
                type: "orderedList"
            }
        ]
    }
}
