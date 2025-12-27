export type MessageStatus = "pending" | "sending" | "sent" | "failed";

export type Message = {
    id: string;
    to: string;
    content: string;
    status: MessageStatus;
    createdAt: string;
};
