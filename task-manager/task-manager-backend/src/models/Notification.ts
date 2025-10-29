import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    message: string;
    read: boolean;
    type: "task" | "project" | "system";
}

const notificationSchema = new Schema<INotification>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        type: { type: String, enum: ["task", "project", "system"], default: "system" }
    },
    { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
