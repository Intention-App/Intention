import * as journalModules from "./journal"

export interface IntentionModule {
    name: string;
    journal?: JournalModule;
}

interface JournalModule {
    title?: string;
    prompts?: Prompt[];
}

interface Prompt {
    prompt: string;
    space?: number;
    type?: "bulletList" | "orderedList"
}

const intentionModules: Record<string, IntentionModule> = {...journalModules};

export default intentionModules;