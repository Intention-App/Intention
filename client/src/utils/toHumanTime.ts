export const toHumanTime = (dateString: string): string => {
    let date: Date;
    const now = new Date();

    try {
        date = new Date(dateString)
    }
    catch (err) {
        console.error(err);
        return "";
    }

    const diff = Math.abs(date.getTime() - now.getTime());

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
}