// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');
// dns.setServers(['8.8.8.8', '1.1.1.1']); // ← force Google DNS

const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection failed:", err.message));

//schema and models
const userSchema = mongoose.Schema({
    username: String,
    email : String,
    password: String
})

const organizationSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId]
})

const boardSchema = mongoose.Schema({
    title: String,
    organizationId: mongoose.Types.ObjectId
})

const issueSchema = mongoose.Schema({
    title: String,
    boardId: mongoose.Types.ObjectId,
    state: String
})

const organizationModel = mongoose.model("organizations", organizationSchema);
const userModel = mongoose.model("users", userSchema);
const boardModel = mongoose.model("boards", boardSchema);
const issueModel = mongoose.model("issues", issueSchema);

module.exports = {
    organizationModel,
    userModel,
    boardModel,
    issueModel
}