// Transforms dateString into human readable time

export const toHumanTime = (dateString: string): string|undefined => {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) return "";

    const diff = Math.abs(date.getTime() - now.getTime());

    if (date.getTime() < now.getTime()) {
        if (diff < 1000 * 60) {
            return "a few seconds ago";
        }
        if (diff < 1000 * 60 * 2) {
            return "a minute ago";
        }
        if (diff < 1000 * 60 * 60) {
            return `${Math.floor(diff / (1000 * 60))} minutes ago`;
        }
        if (diff < 1000 * 60 * 60 * 2) {
            return "an hour ago";
        }
        if (diff < 1000 * 60 * 60 * 24) {
            return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`;
        }
        if (diff < 1000 * 60 * 60 * 24 * 2) {
            return `Yesterday at ${date.toLocaleTimeString("default", {
                hour: "numeric",
                minute: "numeric"
            })}`;
        }
        return `${date.toLocaleString("default", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        })}`;
    } else {
        if (diff < 1000 * 60) {
            return "in a few seconds";
        }
        if (diff < 1000 * 60 * 2) {
            return "in a minute";
        }
        if (diff < 1000 * 60 * 60) {
            return `in ${Math.floor(diff / (1000 * 60))} minutes`;
        }
        if (diff < 1000 * 60 * 60 * 2) {
            return "in an hour";
        }
        if (diff < 1000 * 60 * 60 * 24) {
            return `in ${Math.floor(diff / (1000 * 60 * 60))} hours`;
        }
        if (diff < 1000 * 60 * 60 * 24 * 2) {
            return `Tomorrow at ${date.toLocaleTimeString("default", {
                hour: "numeric",
                minute: "numeric"
            })}`;
        }
        return undefined;
    }
}