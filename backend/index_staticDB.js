const express = require('express');
const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken');

const {authMiddleware} = require('./middleware.js')


//database Schemas----------------------------------------------------------------------------------

let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUES_ID = 1;

//users data
const USERS = [
    {
        id: 1,
        username: "om",
        password: "1234"
    },
    {
        id: 2,
        username: "raman",
        password: "5678"
    }
];

//org 
const ORGANIZATIONS = [
    {
        id: 1,
        title: "100xdevs",
        description: "learning coding platform",
        admin: 1,
        members: [2]
    }
];

//board
const BOARDS = [
    {
        id: 1,
        title: "100x school website",
        organizationId: 1
    }
];

//issues
const ISSUES = [
    {
        id: 1,
        title: "Add dark mode",
        boardId: 1,
        state: "IN_PROGRESS" // IN_PROGRESS, NEXT_UP, DONE, ARCHIEVED
    }
];

// --------------------------------------------------------------------------------------------------


//end point -----------------------------------------------------------------------------------------

// CREATE
//signup page
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExixts = USERS.find(u => u.username === username)
    if(userExixts){
        res.status(411).json({
            message: "User already exists"
        })
    }

    USERS.push({
        username,
        password,
        id: USERS_ID++
    })

    res.json({
        message: "You have signed up successfully"
    })

})

//sigin page
app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExixts = USERS.find(u => u.username === username && u.password === password)
    if(!userExixts){
        res.status(403).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        userId: userExixts.id
    }, "trello_password")

    res.json({
        token
    })
})

//Authencated routes - middleware
// add organizations
app.post("/organization",authMiddleware, (req, res) => {
    const userId = req.userId;

    ORGANIZATIONS.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: ORGANIZATION_ID - 1
    })
})

//add mems to organizations
app.post("/add-mem-to-organization", authMiddleware,  (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.body.organizationId);
    const memUserUsername = req.body.memUserUsername;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    if(!organization || organization.admin != userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    const memberuser = USERS.find(u => u.username === memUserUsername);
    if(!memberuser){
        res.status(411).json({
            message: "No user exists in the db"
        })
        return;
    }

    organization.members.push(memberuser.id);

    res.json({
        message: "new member added!"
    })
    
})

//add boards
app.post("/board", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.body.organizationId)

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    if(!organization || organization.admin != userId){
        return res.status(403).json({
            messgae: "Either org is not there or person is not admin"
        })
    }

    BOARDS.push({
        id: BOARD_ID++,
        title: req.body.title,
        organizationId
    })

    res.json({
        message: "New board added"
    })

})

// add or switch issues
app.post("/issue", authMiddleware, (req, res) => {
    const boardId = parseInt(req.body.boardId);
    const state = req.body.state;

    const board = BOARDS.find(brd => brd.id === boardId);
    if(!board){
        return res.status(403).json({
            message: "Board not there"
        })
    }

    const validStates = ["TODO", "IN_PROGRESS", "DONE"];
    if (!validStates.includes(state)) {
        return res.status(400).json({ message: "Invalid state" });
    }

    ISSUES.push({
        id: ISSUES_ID++,
        title: req.body.title,
        boardId,
        state: req.body.state
    })

    res.json({
        message: "New issue added"
    })
})

//READ
//display orgs
app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    if(!organization || organization.admin != userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return{
                    id: user.id,
                    username: user.username
                }
            })
        }
    })

})


//display boards as per orgID
app.get("/boards", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    if(!organization){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    const boards = BOARDS.filter(brd => brd.organizationId === organizationId);

    res.json({
        boards: {
            ...boards
        }
    })
})

//display issues
app.get("/issues", authMiddleware, (req, res) => {
    const userId = req.userId;
    const boardId = parseInt(req.query.boardId);

    const board = BOARDS.find(brd => brd.id === boardId);
    if(!board){
        res.status(411).json({
            message: "board doesnt exist"
        })
        return;
    }

    const issues = ISSUES.filter(iss => iss.id === boardId);

    res.json({
        issues: {
            ...issues
        }
    })
})

//display mems of org
app.get("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    if(!organization){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    res.json({
        organization: {
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return{
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
})


//UPDATE
//change status of issue
app.put("/issues", authMiddleware, (req, res) => {
    const issueId = parseInt(req.body.issueId);
    const boardId = parseInt(req.body.boardId);

    const newState = req.body.newState;

    const board = BOARDS.find(brd => brd.id === boardId);
    if(!board){
        res.status(411).json({
            message: "board doesnt exist"
        })
        return;
    }

    const issue = ISSUES.find(iss => iss.id === issueId);
    if(!issue){
        res.status(411).json({
            message: "issue doesnt exist"
        })
        return;
    }

    if (issue.boardId !== boardId) {
        return res.status(400).json({ message: "Issue does not belong to this board" });
    }

    const validStates = ["TODO", "IN_PROGRESS", "DONE"];
    if (!validStates.includes(newState)) {
        return res.status(400).json({ message: "Invalid state" });
    }

    issue.state = newState;

    res.status(200).json({
        message: "Issue updated successfully",
        issue
    })
})

//DELETE
app.delete("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.body.organizationId);
    const memUserUsername = req.body.memUserUsername;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin != userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not the admin"
        })
        return;
    }

    const memberuser = USERS.find(u => u.username === memUserUsername);
    if(!memberuser){
        res.status(411).json({
            message: "No user exists in the db"
        })
        return;
    }

    organization.members = organization.members.filter((memberId) => memberId != memberuser.id);

    res.json({
        message: "member deleted"
    })
    
})

// --------------------------------------------------------------------------------------------------


app.listen(3000);