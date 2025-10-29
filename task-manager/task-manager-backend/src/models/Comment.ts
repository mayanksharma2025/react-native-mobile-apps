import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    task: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
}

const commentSchema = new Schema<IComment>(
    {
        task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);
