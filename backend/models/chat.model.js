const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderType: {
      type: String,
      enum: ["student", "faculty"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentDetail",
      required: true,
      index: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyDetail",
      required: true,
      index: true,
    },
    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ studentId: 1, facultyId: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
