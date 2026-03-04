const mongoose = require("mongoose");

// Connection
const mongoURI = "mongodb+srv://jelsingearun2004_db_user:jsRvzxAyPlTdyrJR@academix.gig7osp.mongodb.net/?appName=Academix";

// Schemas (mirrors server.js)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  restricted: { type: Boolean, default: false },
  displayName: { type: String, trim: true },
  profilePicture: { type: String, trim: true },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: { type: [mongoose.Schema.Types.ObjectId], ref: "User", index: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const querySchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true },
  comments: [
    {
      authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      content: { type: String, required: true, trim: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  time: { type: String },
  category: { type: String },
  speakers: { type: String },
  location: { type: String },
  audienceLevel: { type: String, default: "General" },
  registrationLink: { type: String },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  level: { type: String },
  contactEmail: { type: String },
}, { timestamps: true, collection: "project" });

const studyGroupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prerequisites: { type: String },
  skills: { type: String },
  level: { type: String },
  duration: { type: String },
  mode: { type: String },
  contactEmail: { type: String },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);
const Query = mongoose.model("Query", querySchema);
const Event = mongoose.model("Event", eventSchema);
const Project = mongoose.model("Project", projectSchema);
const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);

async function seed() {
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB for seeding");

  // Users (upsert to avoid duplicates by email)
  const usersData = [
    { name: "Alice Johnson", email: "alice@example.com", password: "pass123", displayName: "Alice", skills: ["React", "Node"], interests: ["Web", "UI"] },
    { name: "Bob Smith", email: "bob@example.com", password: "pass123", displayName: "Bob", skills: ["MongoDB", "Express"], interests: ["APIs", "DevOps"] },
    { name: "Carol Lee", email: "carol@example.com", password: "pass123", displayName: "Carol", skills: ["Data", "Python"], interests: ["AI", "ML"] },
  ];
  const users = [];
  for (const u of usersData) {
    const res = await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true, setDefaultsOnInsert: true });
    users.push(res);
  }
  console.log(`Upserted ${users.length} users`);

  // Projects
  const projects = await Project.insertMany([
    {
      title: "Campus Navigator",
      description: "A platform to help students find peers for projects and study groups.",
      technologies: "React, Node.js, MongoDB",
      startDate: "2025-01-10",
      endDate: "2025-04-30",
      level: "Intermediate",
      contactEmail: "alice@example.com",
    },
    {
      title: "Event Pulse",
      description: "Event discovery and RSVP tracking for university clubs.",
      technologies: "Next.js, Express, MongoDB",
      startDate: "2025-02-01",
      endDate: "2025-05-15",
      level: "Beginner",
      contactEmail: "bob@example.com",
    },
  ], { ordered: false }).catch(() => []); // ignore dup errors
  console.log(`Inserted ${projects.length} projects`);

  // Study groups
  const studyGroups = await StudyGroup.insertMany([
    {
      title: "DSA Crash Course",
      description: "Weekly sessions solving DSA problems.",
      prerequisites: "Basic JS",
      skills: "Algorithms, Data Structures",
      level: "Intermediate",
      duration: "6 weeks",
      mode: "Online",
      contactEmail: "carol@example.com",
    },
    {
      title: "ML Reading Club",
      description: "Paper reading group for ML enthusiasts.",
      prerequisites: "Python, Linear Algebra",
      skills: "ML, Research",
      level: "Advanced",
      duration: "8 weeks",
      mode: "Hybrid",
      contactEmail: "alice@example.com",
    },
  ], { ordered: false }).catch(() => []);
  console.log(`Inserted ${studyGroups.length} study groups`);

  // Events
  const events = await Event.insertMany([
    {
      title: "Tech Talk: Building APIs",
      description: "Intro to RESTful API design.",
      date: "2025-03-05",
      time: "17:00",
      category: "Tech Talk",
      speakers: "Bob Smith",
      location: "Auditorium A",
      audienceLevel: "General",
      registrationLink: "https://example.com/rsvp/api",
    },
    {
      title: "AI Workshop",
      description: "Hands-on session with ML tools.",
      date: "2025-03-12",
      time: "15:00",
      category: "Workshop",
      speakers: "Carol Lee",
      location: "Lab 2",
      audienceLevel: "Intermediate",
      registrationLink: "https://example.com/rsvp/ai",
    },
  ], { ordered: false }).catch(() => []);
  console.log(`Inserted ${events.length} events`);

  // Queries and a sample message thread
  const query = await Query.create({
    authorId: users[0]._id,
    content: "How do I deploy a MERN app to Render or Railway?",
    comments: [
      { authorId: users[1]._id, content: "Use a CI pipeline and set env vars." },
      { authorId: users[2]._id, content: "Also check MongoDB Atlas IP allowlist." },
    ],
  }).catch(() => null);
  if (query) console.log("Inserted 1 query with comments");

  const msg = await Message.create({
    text: "Hey Bob, want to pair on the API?",
    senderId: users[0]._id,
    recipientId: users[1]._id,
    participants: [users[0]._id, users[1]._id],
    timestamp: new Date(),
  }).catch(() => null);
  if (msg) console.log("Inserted 1 sample message");

  await mongoose.disconnect();
  console.log("Seeding complete and connection closed.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
