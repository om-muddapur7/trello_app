const express = require('express');
const app = express();
app.use(express.json());

const path = require('path');
const cors = require("cors");
app.use(cors());

const frontend_path = path.join(__dirname, "..", "frontend");
app.use(express.static(frontend_path));

const jwt = require('jsonwebtoken');
const {authMiddleware} = require('./middleware.js')
const {userModel, organizationModel, boardModel, issueModel} = require('./models.js')
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

//end point -----------------------------------------------------------------------------------------

// CREATE
//signup page
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExixts = await userModel.findOne({
        username: username
    })

    if(userExixts){
        res.status(411).json({
            message: "User already exists"
        })
    }

    const newUser = await userModel.create({
        username: username,
        password: password
    })

    res.json({
        id: newUser._id,
        message: "You have signed up successfully"
    })

})

//sigin page
app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExixts = await userModel.findOne({
        username: username,
        password: password
    })

    if(!userExixts){
        return res.status(403).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        userId: userExixts.id
    }, JWT_SECRET)

    res.json({
        token
    })
})

//Authencated routes - middleware
// add organizations
app.post("/add_organization",authMiddleware, async (req, res) => {
    const userId = req.userId;

    const newOrg = await organizationModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: newOrg._id
    })
})

//add mems to organizations
app.post("/add-mem-to-organization", authMiddleware,  async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memUserUsername = req.body.memUserUsername;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    if(!organization || organization.admin.toString() != userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    const memberuser = await userModel.findOne({
        username: memUserUsername
    })

    if(!memberuser){
        res.status(411).json({
            message: "No user exists in the db"
        })
        return;
    }

    await organizationModel.updateOne(
        { 
            _id: organizationId,
        },
        { 
            $addToSet: { members: memberuser._id } 
        }
    );

    res.json({
        message: "new member added!",
        id: memberuser._id
    })
    
})

//add boards
app.post("/add_board", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    if(!organization){
        return res.status(403).json({
            messgae: "org is not there"
        })
    }

    const newBoard = await boardModel.create({
        title: req.body.title,
        organizationId: organizationId
    })

    res.json({
        message: "New board added"
    })

})

// add or switch issues
app.post("/add_issue", authMiddleware, async (req, res) => {
    const boardId = req.body.boardId;
    const state = req.body.state;

    const board = await boardModel.findOne({
        _id: boardId
    });

    if(!board){
        return res.status(403).json({
            message: "Board not there"
        })
    }

    const validStates = ["TODO", "IN_PROGRESS", "DONE"];
    if (!validStates.includes(state)) {
        return res.status(400).json({ message: "Invalid state" });
    }

    const newIssue = await issueModel.create({
        title: req.body.title,
        boardId: boardId,
        state: state
    })

    res.json({
        message: "New issue added"
    })
})

//READ
//display orgs (JSON API — page is served at GET /organization)
app.get("/api/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const organizations = await organizationModel.find({
        admin: userId
    });

    const result = [];

    for (let i = 0; i < organizations.length; i++) {
        const org = organizations[i];

        const members = await userModel.find({
            _id: { $in: org.members }
        });

        result.push({
            id: org._id,
            title: org.title,
            description: org.description,
            admin: org.admin,
            members: members.map(m => ({
                username: m.username,
                id: m._id
            }))
        });
    }

    res.json({
        organizations: result  
    });
});


//display boards as per orgID
app.get("/api/boards", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    if(!organization){
        res.status(411).json({
            message: "Either org doesnt exist"
        })
        return;
    }

    const boards = await boardModel.find({
        organizationId: organizationId
    })

    res.json({
        boards: boards
    })

})

//display issues
app.get("/api/issues", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const boardId = req.query.boardId;

    const board = await boardModel.findOne({
        _id: boardId
    })

    if(!board){
        res.status(411).json({
            message: "board doesnt exist"
        })
        return;
    }

    const issues = await issueModel.find({
        boardId: boardId
    })

    res.json({
        issues: issues
    })
})

//display mems of org
app.get("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

   const organization = await organizationModel.findOne({
        _id: organizationId
    })

    if(!organization){
        res.status(411).json({
            message: "org doesnt exist"
        })
        return;
    }

    const users = await userModel.find({
        _id: {$in: organization.members}
    }).select("_id username")

    const members = users.map(user => ({
        id: user._id,
        username: user.username
    }));

    res.json({
        members: members
    });

})


//UPDATE
//change status of issue
app.put("/issues_state", authMiddleware, async (req, res) => {
    try {
        const { issueId, boardId, newState } = req.body;

        console.log("BODY:", req.body);

        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(issueId) || 
            !mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const board = await boardModel.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const issue = await issueModel.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        if (issue.boardId && issue.boardId.toString() !== boardId) {
            return res.status(400).json({ message: "Mismatch board" });
        }

        const validStates = ["TODO", "IN_PROGRESS", "DONE"];
        if (!validStates.includes(newState)) {
            return res.status(400).json({ message: "Invalid state" });
        }

        issue.state = newState; 
        await issue.save();

        res.json({ message: "Updated", issue });

    } catch (err) {
        console.error("FULL ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//DELETE
app.delete("/delete_organization", authMiddleware,  async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    if(!organization || organization.admin.toString() != userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    await organizationModel.deleteOne({
        _id: organizationId
    });

    res.json({
        message: "Organization deleted"
    })
    
})

app.delete("/delete_board", authMiddleware,  async (req, res) => {
    const userId = req.userId;
    const boardId = req.body.boardId;

    const board = await boardModel.findOne({
        _id: boardId
    });

    if(!board){
        return res.status(403).json({
            message: "Board not there"
        })
    }

    await boardModel.deleteOne({
        _id: boardId
    });

    res.json({
        message: "Board deleted"
    })
    
})

app.delete("/delete_issue", authMiddleware,  async (req, res) => {
    const userId = req.userId;
    const issueId = req.body.issueId;

    const issue = await issueModel.findOne({
        _id: issueId
    })

    if(!issue){
        res.status(411).json({
            message: "issue doesnt exist"
        })
        return;
    }

    await issueModel.deleteOne({
        _id: issueId
    });

    res.json({
        message: "Issue deleted"
    })
    
})

app.delete("/delete_members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memUserUsername = req.body.memUserUsername;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    if(!organization || organization.admin.toString() != userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    const memberuser = await userModel.findOne({
        username: memUserUsername
    })

    if(!memberuser){
        res.status(411).json({
            message: "No user exists in the db"
        })
        return;
    }

    await organizationModel.updateOne({
        _id: organizationId
    },{
        $pull: {
            members: memberuser._id
        }
    })

    res.json({
        message: "member deleted"
    })
    
})

// --------------------------------------------------------------------------------------------------

app.get("/signup", (req, res) => {
    res.sendFile(path.join(frontend_path, "signup.html"));
})

app.get("/signin", (req, res) => {
    res.sendFile(path.join(frontend_path, "signin.html"));
})

app.get("/organization", (req, res) => {
    res.sendFile(path.join(frontend_path, "organization.html"));
})

app.get("/board", (req, res) => {
    res.sendFile(path.join(frontend_path, "board.html"));
})

app.get("/issues", (req, res) => {
    res.sendFile(path.join(frontend_path, "issues.html"));
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running");
});