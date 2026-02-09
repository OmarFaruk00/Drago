/**
 * Message Model - Chat messages
 */

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel", required: true },
    senderModel: { type: String, enum: ["Admin", "User"], required: true },
    content: { type: String, default: "" },
    attachment: { type: String, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

messageSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
