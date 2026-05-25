const Chat = require("../models/chat.model");
const StudentDetail = require("../models/details/student-details.model");
const FacultyDetail = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");

const getFacultyOptionsController = async (req, res) => {
  try {
    const student = await StudentDetail.findById(req.userId).select("branchId");

    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    const facultyList = await FacultyDetail.find({
      branchId: student.branchId,
      status: "active",
    })
      .select("firstName lastName email designation profile branchId")
      .populate("branchId", "name");

    return ApiResponse.success(
      facultyList,
      "Faculty list fetched successfully"
    ).send(res);
  } catch (error) {
    console.error("Get Faculty Options Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getStudentChatController = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const studentId = req.userId;

    const faculty = await FacultyDetail.findById(facultyId).select(
      "firstName lastName email designation profile"
    );

    if (!faculty) {
      return ApiResponse.notFound("Faculty not found").send(res);
    }

    const chat = await Chat.findOne({ studentId, facultyId });

    return ApiResponse.success(
      {
        conversationWith: faculty,
        messages: chat?.messages || [],
      },
      "Chat fetched successfully"
    ).send(res);
  } catch (error) {
    console.error("Get Student Chat Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const sendStudentMessageController = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const studentId = req.userId;
    const text = req.body?.text?.trim();

    if (!text) {
      return ApiResponse.badRequest("Message text is required").send(res);
    }

    const [student, faculty] = await Promise.all([
      StudentDetail.findById(studentId).select("branchId"),
      FacultyDetail.findById(facultyId).select("branchId status"),
    ]);

    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    if (!faculty) {
      return ApiResponse.notFound("Faculty not found").send(res);
    }

    if (faculty.status !== "active") {
      return ApiResponse.badRequest("Selected faculty is not active").send(res);
    }

    if (String(student.branchId) !== String(faculty.branchId)) {
      return ApiResponse.forbidden(
        "You can only chat with faculty from your branch"
      ).send(res);
    }

    const chat = await Chat.findOneAndUpdate(
      { studentId, facultyId },
      {
        $setOnInsert: { studentId, facultyId },
        $push: {
          messages: {
            senderId: studentId,
            senderType: "student",
            text,
          },
        },
      },
      { new: true, upsert: true }
    );

    return ApiResponse.success(chat.messages, "Message sent successfully").send(
      res
    );
  } catch (error) {
    console.error("Send Student Message Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getFacultyChatsController = async (req, res) => {
  try {
    const facultyId = req.userId;

    const chats = await Chat.find({ facultyId })
      .populate("studentId", "firstName middleName lastName email semester profile")
      .sort({ updatedAt: -1 });

    const chatList = chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1] || null;

      return {
        _id: chat._id,
        student: chat.studentId,
        lastMessage,
        updatedAt: chat.updatedAt,
      };
    });

    return ApiResponse.success(chatList, "Faculty chats fetched successfully").send(
      res
    );
  } catch (error) {
    console.error("Get Faculty Chats Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getFacultyChatController = async (req, res) => {
  try {
    const { studentId } = req.params;
    const facultyId = req.userId;

    const student = await StudentDetail.findById(studentId).select(
      "firstName middleName lastName email semester profile"
    );

    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    const chat = await Chat.findOne({ studentId, facultyId });

    return ApiResponse.success(
      {
        conversationWith: student,
        messages: chat?.messages || [],
      },
      "Chat fetched successfully"
    ).send(res);
  } catch (error) {
    console.error("Get Faculty Chat Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const sendFacultyMessageController = async (req, res) => {
  try {
    const { studentId } = req.params;
    const facultyId = req.userId;
    const text = req.body?.text?.trim();

    if (!text) {
      return ApiResponse.badRequest("Message text is required").send(res);
    }

    const chat = await Chat.findOne({ studentId, facultyId });

    if (!chat) {
      return ApiResponse.notFound(
        "No conversation found with this student yet"
      ).send(res);
    }

    chat.messages.push({
      senderId: facultyId,
      senderType: "faculty",
      text,
    });

    await chat.save();

    return ApiResponse.success(chat.messages, "Message sent successfully").send(
      res
    );
  } catch (error) {
    console.error("Send Faculty Message Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  getFacultyOptionsController,
  getStudentChatController,
  sendStudentMessageController,
  getFacultyChatsController,
  getFacultyChatController,
  sendFacultyMessageController,
};
