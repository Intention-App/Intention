import * as journalModules from "./journal"

// Intention module type
export interface IntentionModule {
    name: string;
    journal?: JournalModule;
}

// Journal module types
interface JournalModule {
    title?: string;
    prompts?: Prompt[];
}

// Journal prompt type
interface Prompt {
    // Question or food for though
    prompt: string;

    // Number of spaces provided beneath question
    space?: number;

    // Type of space
    type?: "bulletList" | "orderedList"
}

// #PLACEHOLDER
// #TODO move modules to backend
// List of all modules
const intentionModules: Record<string, IntentionModule> = {...journalModules};
export default intentionModules;