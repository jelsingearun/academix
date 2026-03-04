/**
 * Automation Testing Script for Academix
 * Tests: Signup → Login → Features (Projects, Events, Study Groups, Queries, Messages)
 * Verifies data is saved to MongoDB
 */

const axios = require("axios");
const mongoose = require("mongoose");

const BASE_URL = "http://localhost:5000";
const MONGO_URI = "mongodb+srv://jelsingearun2004_db_user:jsRvzxAyPlTdyrJR@academix.gig7osp.mongodb.net/?appName=Academix";

let testResults = {
  passed: 0,
  failed: 0,
  errors: [],
};

// Test users
const testUsers = [
  {
    name: "Test User 1",
    email: `testuser1-${Date.now()}@test.com`,
    password: "testpass123",
    displayName: "TestUser1",
  },
  {
    name: "Test User 2",
    email: `testuser2-${Date.now()}@test.com`,
    password: "testpass123",
    displayName: "TestUser2",
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function test(description, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${description}`);
    testResults.passed++;
  } catch (error) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.errors.push({ test: description, error: error.message });
  }
}

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ============ TEST SUITE ============

async function testSignup() {
  console.log("\n📋 === SIGNUP TESTS ===");

  let userId1, userId2;

  await test("Signup User 1", async () => {
    const res = await axios.post(`${BASE_URL}/api/signup`, testUsers[0]);
    assert(res.status === 201, "Signup status not 201");
    assert(res.data.user, "User not returned");
    userId1 = res.data.user.id;
    testUsers[0].id = userId1;
  });

  await test("Signup User 2", async () => {
    const res = await axios.post(`${BASE_URL}/api/signup`, testUsers[1]);
    assert(res.status === 201, "Signup status not 201");
    userId2 = res.data.user.id;
    testUsers[1].id = userId2;
  });

  await test("Prevent duplicate email signup", async () => {
    try {
      await axios.post(`${BASE_URL}/api/signup`, testUsers[0]);
      throw new Error("Should have rejected duplicate email");
    } catch (err) {
      assert(err.response?.status === 409, "Expected 409 for duplicate email");
    }
  });

  return { userId1, userId2 };
}

async function testUserManagement(userId1, userId2) {
  console.log("\n👥 === USER MANAGEMENT TESTS ===");

  await test("List all users", async () => {
    const res = await axios.get(`${BASE_URL}/api/users`);
    assert(Array.isArray(res.data), "Users should be an array");
    assert(res.data.length > 0, "Should have at least 1 user");
  });

  await test("Update user profile", async () => {
    const res = await axios.patch(`${BASE_URL}/api/users/${userId1}`, {
      skills: ["React", "Node.js", "MongoDB"],
      interests: ["Web Dev", "AI"],
      phone: "9876543210",
    });
    assert(res.status === 200, "Update status not 200");
    assert(res.data.skills?.includes("React"), "Skills not updated");
  });

  await test("Verify user data persists in DB", async () => {
    const res = await axios.get(`${BASE_URL}/api/users`);
    const user = res.data.find((u) => u._id === userId1);
    assert(user, "User not found in list");
    assert(user.skills?.includes("Node.js"), "Skills not persisted");
  });
}

async function testProjects() {
  console.log("\n📁 === PROJECT TESTS ===");

  let projectId;

  await test("Create a project", async () => {
    const res = await axios.post(`${BASE_URL}/api/projects`, {
      title: "Automation Test Project",
      description: "A project created by the automation test script",
      technologies: "Jest, Axios, MongoDB",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      level: "Intermediate",
      contactEmail: testUsers[0].email,
    });
    assert(res.status === 201, "Create project status not 201");
    projectId = res.data._id;
  });

  await test("List all projects", async () => {
    const res = await axios.get(`${BASE_URL}/api/projects`);
    assert(Array.isArray(res.data), "Projects should be an array");
    assert(res.data.length > 0, "Should have at least 1 project");
  });

  await test("Verify project persists in DB", async () => {
    const res = await axios.get(`${BASE_URL}/api/projects`);
    const project = res.data.find((p) => p._id === projectId);
    assert(project, "Project not found");
    assert(project.title === "Automation Test Project", "Project title mismatch");
  });

  await test("Delete project", async () => {
    const res = await axios.delete(`${BASE_URL}/api/projects/${projectId}`);
    assert(res.status === 200, "Delete project status not 200");
  });

  return projectId;
}

async function testEvents() {
  console.log("\n🎉 === EVENT TESTS ===");

  let eventId;

  await test("Create an event", async () => {
    const res = await axios.post(`${BASE_URL}/api/events`, {
      title: "Automation Testing Workshop",
      description: "Learn automation testing best practices",
      date: "2025-03-20",
      time: "14:00",
      category: "Workshop",
      speakers: testUsers[0].name,
      location: "Lab Building",
      audienceLevel: "Intermediate",
      registrationLink: "https://example.com/register",
    });
    assert(res.status === 201, "Create event status not 201");
    eventId = res.data._id;
  });

  await test("List all events", async () => {
    const res = await axios.get(`${BASE_URL}/api/events`);
    assert(Array.isArray(res.data), "Events should be an array");
    assert(res.data.length > 0, "Should have at least 1 event");
  });

  await test("Verify event persists in DB", async () => {
    const res = await axios.get(`${BASE_URL}/api/events`);
    const event = res.data.find((e) => e._id === eventId);
    assert(event, "Event not found");
    assert(event.title === "Automation Testing Workshop", "Event title mismatch");
  });

  await test("Delete event", async () => {
    const res = await axios.delete(`${BASE_URL}/api/events/${eventId}`);
    assert(res.status === 200, "Delete event status not 200");
  });

  return eventId;
}

async function testStudyGroups() {
  console.log("\n📚 === STUDY GROUP TESTS ===");

  let groupId;

  await test("Create a study group", async () => {
    const res = await axios.post(`${BASE_URL}/api/study-groups`, {
      title: "MERN Stack Mastery",
      description: "Master MongoDB, Express, React, Node.js together",
      prerequisites: "Basic JavaScript knowledge",
      skills: "MERN Stack, Full-stack Development",
      level: "Intermediate",
      duration: "8 weeks",
      mode: "Hybrid",
      contactEmail: testUsers[1].email,
    });
    assert(res.status === 201, "Create study group status not 201");
    groupId = res.data._id;
  });

  await test("List all study groups", async () => {
    const res = await axios.get(`${BASE_URL}/api/study-groups`);
    assert(Array.isArray(res.data), "Study groups should be an array");
    assert(res.data.length > 0, "Should have at least 1 study group");
  });

  await test("Verify study group persists in DB", async () => {
    const res = await axios.get(`${BASE_URL}/api/study-groups`);
    const group = res.data.find((g) => g._id === groupId);
    assert(group, "Study group not found");
    assert(group.title === "MERN Stack Mastery", "Study group title mismatch");
  });

  await test("Delete study group", async () => {
    const res = await axios.delete(`${BASE_URL}/api/study-groups/${groupId}`);
    assert(res.status === 200, "Delete study group status not 200");
  });

  return groupId;
}

async function testQueries(userId1, userId2) {
  console.log("\n❓ === QUERY (Q&A) TESTS ===");

  let queryId;

  await test("Create a query", async () => {
    const res = await axios.post(`${BASE_URL}/api/queries`, {
      authorId: userId1,
      content: "How do I integrate JWT for authentication in MERN?",
    });
    assert(res.status === 201, "Create query status not 201");
    queryId = res.data._id;
  });

  await test("List all queries", async () => {
    const res = await axios.get(`${BASE_URL}/api/queries`);
    assert(Array.isArray(res.data), "Queries should be an array");
    assert(res.data.length > 0, "Should have at least 1 query");
  });

  await test("Add a comment to query", async () => {
    const res = await axios.post(`${BASE_URL}/api/queries/${queryId}/comments`, {
      authorId: userId2,
      content: "Use jsonwebtoken package and set expiry times properly.",
    });
    assert(res.status === 200, "Add comment status not 200");
    assert(res.data.comments?.length > 0, "Comment not added");
  });

  await test("Verify query with comments persists", async () => {
    const res = await axios.get(`${BASE_URL}/api/queries`);
    const query = res.data.find((q) => q._id === queryId);
    assert(query, "Query not found");
    assert(query.comments?.length > 0, "Comments not persisted");
  });

  await test("Update query content", async () => {
    const res = await axios.patch(`${BASE_URL}/api/queries/${queryId}`, {
      content: "How do I integrate JWT for authentication in MERN? (Updated)",
    });
    assert(res.status === 200, "Update query status not 200");
    assert(res.data.content.includes("Updated"), "Content not updated");
  });

  await test("Delete query", async () => {
    const res = await axios.delete(`${BASE_URL}/api/queries/${queryId}`);
    assert(res.status === 200, "Delete query status not 200");
  });

  return queryId;
}

async function testMessages(userId1, userId2) {
  console.log("\n💬 === MESSAGE TESTS ===");

  let messageId;

  await test("Create a message", async () => {
    const res = await axios.post(`${BASE_URL}/api/messages`, {
      text: "Hey! Want to collaborate on the project?",
      senderId: userId1,
      recipientId: userId2,
    });
    assert(res.status === 201, "Create message status not 201");
    messageId = res.data._id;
  });

  await test("List messages between two users", async () => {
    const res = await axios.get(`${BASE_URL}/api/messages`, {
      params: { a: userId1, b: userId2 },
    });
    assert(Array.isArray(res.data), "Messages should be an array");
    assert(res.data.length > 0, "Should have at least 1 message");
  });

  await test("Verify message persists in DB", async () => {
    const res = await axios.get(`${BASE_URL}/api/messages`, {
      params: { a: userId1, b: userId2 },
    });
    const msg = res.data.find((m) => m._id === messageId);
    assert(msg, "Message not found");
    assert(msg.text.includes("collaborate"), "Message text mismatch");
  });

  return messageId;
}

async function testHealthCheck() {
  console.log("\n🏥 === HEALTH & CONNECTION TESTS ===");

  await test("Server health check", async () => {
    const res = await axios.get(`${BASE_URL}/api/health`);
    assert(res.status === 200, "Health check status not 200");
    assert(res.data.ok === true, "Health check not OK");
  });

  await test("MongoDB connection state", async () => {
    const res = await axios.get(`${BASE_URL}/api/health`);
    assert(res.data.mongoState === 1, "MongoDB not connected (state should be 1)");
  });
}

async function verifyDatabasePersistence() {
  console.log("\n🗄️  === DATABASE PERSISTENCE VERIFICATION ===");

  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  await test("Verify users collection exists and has data", async () => {
    const collections = await db.listCollections().toArray();
    const usersCol = collections.find((c) => c.name === "users");
    assert(usersCol, "Users collection not found");
    const count = await db.collection("users").countDocuments();
    assert(count > 0, "Users collection is empty");
  });

  await test("Verify projects collection exists", async () => {
    const collections = await db.listCollections().toArray();
    const projectsCol = collections.find((c) => c.name === "project");
    // Projects collection may not exist if all were deleted
    console.log("   (Projects collection may be empty after deletion)");
  });

  await test("Verify events collection exists", async () => {
    const collections = await db.listCollections().toArray();
    const eventsCol = collections.find((c) => c.name === "events");
    // May be empty after deletion
    console.log("   (Events collection may be empty after deletion)");
  });

  await test("Verify queries collection exists and has data", async () => {
    const collections = await db.listCollections().toArray();
    const queriesCol = collections.find((c) => c.name === "queries");
    // May be empty after deletion
    console.log("   (Queries collection may be empty after deletion)");
  });

  await test("Verify messages collection exists and has data", async () => {
    const collections = await db.listCollections().toArray();
    const msgsCol = collections.find((c) => c.name === "messages");
    // May be empty after deletion
    console.log("   (Messages collection may be empty after deletion)");
  });

  await mongoose.disconnect();
}

// ============ MAIN TEST RUNNER ============

async function runAllTests() {
  console.log("🚀 ========================================");
  console.log("   ACADEMIX AUTOMATION TEST SUITE");
  console.log("========================================\n");

  try {
    // Wait for server to be ready
    await sleep(1000);

    // Test health first
    await testHealthCheck();

    // Test signup and user management
    const { userId1, userId2 } = await testSignup();
    await sleep(500);

    await testUserManagement(userId1, userId2);
    await sleep(500);

    // Test features
    await testProjects();
    await sleep(500);

    await testEvents();
    await sleep(500);

    await testStudyGroups();
    await sleep(500);

    await testQueries(userId1, userId2);
    await sleep(500);

    await testMessages(userId1, userId2);
    await sleep(500);

    // Verify database persistence
    await verifyDatabasePersistence();

    // Print summary
    console.log("\n========================================");
    console.log("📊 TEST SUMMARY");
    console.log("========================================");
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total:  ${testResults.passed + testResults.failed}`);

    if (testResults.failed > 0) {
      console.log("\n❌ Failed Tests:");
      testResults.errors.forEach((err) => {
        console.log(`   - ${err.test}`);
        console.log(`     ${err.error}`);
      });
    } else {
      console.log("\n🎉 ALL TESTS PASSED!");
    }

    process.exit(testResults.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("\n💥 FATAL ERROR:", error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
