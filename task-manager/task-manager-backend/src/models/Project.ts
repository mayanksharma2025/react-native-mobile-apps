import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    description?: string;
    members: mongoose.Types.ObjectId[];
    tasks: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);
