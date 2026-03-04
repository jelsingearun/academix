const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); 
const corsOptions = {
  origin: true, // Reflect request origin
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// MongoDB Connection (use localhost for consistency)
const mongoURI = "mongodb+srv://jelsingearun2004_db_user:jsRvzxAyPlTdyrJR@academix.gig7osp.mongodb.net/?appName=Academix";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Cleanup: Drop stray 'projects' collection if it exists (we use 'project')
mongoose.connection.once("open", async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasPluralProjects = collections.some((c) => c.name === "projects");
    if (hasPluralProjects) {
      await mongoose.connection.db.dropCollection("projects");
      console.log("🧹 Dropped stray 'projects' collection");
    }
  } catch (cleanupErr) {
    console.warn("Cleanup check failed:", cleanupErr?.message || cleanupErr);
  }
});

// Mongoose Schemas
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    restricted: { type: Boolean, default: false },
    displayName: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: { type: [mongoose.Schema.Types.ObjectId], ref: "User", index: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// Query (Q&A) schema
const querySchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    comments: [
      {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Query = mongoose.models.Query || mongoose.model("Query", querySchema);

// Event schema
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String },
    time: { type: String },
    category: { type: String },
    speakers: { type: String },
    location: { type: String },
    audienceLevel: { type: String, default: "General" },
    registrationLink: { type: String },
  },
  { timestamps: true }
);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

// Project schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    level: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true, collection: "project" }
);
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

// Study Group schema
const studyGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    prerequisites: { type: String },
    skills: { type: String },
    level: { type: String },
    duration: { type: String },
    mode: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true }
);
const StudyGroup = mongoose.models.StudyGroup || mongoose.model("StudyGroup", studyGroupSchema);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health check
app.get("/api/health", async (req, res) => {
  const state = mongoose.connection.readyState; // 1 = connected
  res.json({ ok: true, mongoState: state });
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, phone, displayName } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    console.log("➡️  Signup request:", { name, email });
    const newUser = await User.create({ name, email, password, phone: phone || null, displayName: displayName || name });
    console.log("✅ User saved:", newUser._id.toString());
    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    // Handle duplicate key error explicitly
    if (error && error.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List users (debug)
app.get("/api/users", async (req, res) => {
  const users = await User.find({}, { name: 1, email: 1, displayName: 1, profilePicture: 1, skills: 1, interests: 1, restricted: 1, phone: 1 }).sort({ createdAt: -1 }).limit(100);
  res.json(users);
});

// Update user fields
app.patch("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body || {};
    const updated = await User.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create message
app.post("/api/messages", async (req, res) => {
  try {
    const { text, senderId, recipientId } = req.body || {};
    if (!text || !senderId || !recipientId) {
      return res.status(400).json({ error: "text, senderId, recipientId are required" });
    }
    const message = await Message.create({
      text,
      senderId,
      recipientId,
      participants: [senderId, recipientId],
      timestamp: new Date(),
    });
    res.status(201).json(message);
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages between two users
app.get("/api/messages", async (req, res) => {
  try {
    const { a, b } = req.query;
    if (!a || !b) return res.status(400).json({ error: "Query params 'a' and 'b' are required" });
    const messages = await Message.find({
      $or: [
        { senderId: a, recipientId: b },
        { senderId: b, recipientId: a },
      ],
    })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a query
app.post("/api/queries", async (req, res) => {
  try {
    const { authorId, content } = req.body || {};
    if (!authorId || !content) return res.status(400).json({ error: "authorId and content are required" });
    const created = await Query.create({ authorId, content });
    res.status(201).json(created);
  } catch (err) {
    console.error("Create query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List queries
app.get("/api/queries", async (_req, res) => {
  try {
    const items = await Query.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    console.error("List queries error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a query content
app.patch("/api/queries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body || {};
    const updated = await Query.findByIdAndUpdate(id, { content }, { new: true });
    if (!updated) return res.status(404).json({ error: "Query not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a query
app.delete("/api/queries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Query.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a comment to a query
app.post("/api/queries/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, content } = req.body || {};
    if (!authorId || !content) return res.status(400).json({ error: "authorId and content are required" });
    const updated = await Query.findByIdAndUpdate(
      id,
      { $push: { comments: { authorId, content, createdAt: new Date() } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Query not found" });
    res.json(updated);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Events routes
app.post("/api/events", async (req, res) => {
  try {
    const created = await Event.create(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/events", async (_req, res) => {
  try {
    const items = await Event.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    console.error("List events error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Projects routes
app.post("/api/projects", async (req, res) => {
  try {
    const payload = req.body || {};
    const { title, description, contactEmail, startDate, endDate } = payload;
    if (!title || !description || !contactEmail || !startDate || !endDate) {
      return res.status(400).json({ error: "title, description, contactEmail, startDate, endDate are required" });
    }
    console.log("➡️  Create Project:", { title });
    const created = await Project.create(payload);
    console.log("✅ Project saved:", created._id.toString());
    res.status(201).json(created);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/projects", async (_req, res) => {
  try {
    const items = await Project.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    console.error("List projects error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Study Groups routes
app.post("/api/study-groups", async (req, res) => {
  try {
    const created = await StudyGroup.create(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error("Create study group error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/study-groups", async (_req, res) => {
  try {
    const items = await StudyGroup.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    console.error("List study groups error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/study-groups/:id", async (req, res) => {
  try {
    await StudyGroup.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete study group error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
