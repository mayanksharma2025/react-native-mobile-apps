import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
    action: string;
    user: mongoose.Types.ObjectId;
    entityType: "Task" | "Project" | "User";
    entityId: mongoose.Types.ObjectId;
    details?: string;
}

const activitySchema = new Schema<IActivity>(
    {
        action: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        entityType: { type: String, enum: ["Task", "Project", "User"], required: true },
        entityId: { type: Schema.Types.ObjectId, required: true },
        details: String
    },
    { timestamps: true }
);

activitySchema.post("save", function (doc) {
    console.log(`🪶 Activity logged: ${doc.action}`);
});

export default mongoose.model<IActivity>("Activity", activitySchema);
