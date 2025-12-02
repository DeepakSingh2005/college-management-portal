require("dotenv").config();
const studentDetails = require("./models/details/student-details.model");
const facultyDetails = require("./models/details/faculty-details.model");
const branchModel = require("./models/branch.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const seedDemoData = async () => {
  try {
    await connectToMongo();

    // Create a demo branch first
    let demoBranch = await branchModel.findOne({ branchId: "CS001" });
    if (!demoBranch) {
      demoBranch = await branchModel.create({
        branchId: "CS001",
        name: "Computer Science",
      });
      console.log("Demo branch created:", demoBranch.name);
    }

    // Clear existing demo data
    await studentDetails.deleteMany({ email: { $in: ["student@demo.com"] } });
    await facultyDetails.deleteMany({ email: { $in: ["faculty@demo.com"] } });

    // Create Demo Student
    const studentPassword = "student123";
    const studentData = {
      enrollmentNo: 2024001,
      firstName: "John",
      middleName: "D",
      lastName: "Doe",
      email: "student@demo.com",
      phone: "9876543210",
      semester: 3,
      branchId: demoBranch._id,
      gender: "male",
      dob: new Date("2003-05-15"),
      address: "123 Student Street",
      city: "Student City",
      state: "State",
      pincode: "123456",
      country: "India",
      profile: "Faculty_Profile_123456.jpg",
      status: "active",
      bloodGroup: "A+",
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Parent",
        phone: "9876543211",
      },
      password: studentPassword,
    };

    await studentDetails.create(studentData);

    // Create Demo Faculty
    const facultyPassword = "faculty123";
    const facultyData = {
      employeeId: 2024001,
      firstName: "Dr. Sarah",
      lastName: "Smith",
      email: "faculty@demo.com",
      phone: "9876543220",
      profile: "Faculty_Profile_123456.jpg",
      address: "456 Faculty Avenue",
      city: "Faculty City",
      state: "State",
      pincode: "123456",
      country: "India",
      gender: "female",
      dob: new Date("1985-08-20"),
      designation: "Assistant Professor",
      joiningDate: new Date("2020-01-15"),
      salary: 75000,
      status: "active",
      bloodGroup: "B+",
      branchId: demoBranch._id,
      emergencyContact: {
        name: "Mike Smith",
        relationship: "Spouse",
        phone: "9876543221",
      },
      password: facultyPassword,
    };

    await facultyDetails.create(facultyData);

    console.log("\n=== Demo Credentials ===");
    console.log("\n📚 STUDENT:");
    console.log("Email: student@demo.com");
    console.log("Password: student123");
    console.log("Enrollment No: 2024001");
    
    console.log("\n👨‍🏫 FACULTY:");
    console.log("Email: faculty@demo.com");
    console.log("Password: faculty123");
    console.log("Employee ID: 2024001");
    
    console.log("\n=======================\n");
    console.log("Demo accounts created successfully!");
  } catch (error) {
    console.error("Error while seeding demo data:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedDemoData();



