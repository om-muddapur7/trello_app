function getBoardId() {
	const params = new URLSearchParams(window.location.search);
	return params.get("brdId");
}
 
const brdId = getBoardId();

async function getIssues() {
	try {
		const response = await axios.get(
			`${window.location.origin}/api/issues/?boardId=${brdId}`,
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		const issue_data = response.data.issues;

		const todoContainer = document.getElementById("TODO-body");
		const progressContainer = document.getElementById("IN_PROGRESS-body");
		const doneContainer = document.getElementById("DONE-body");

		for (let i = 0; i < issue_data.length; i++) {
			const issue = issue_data[i];

			const cardHTML = `
                        <div class="issue-card">
                            <div class="card-header">
                                Issue ${i + 1}
                            </div>

                            <div class="card-body">
                                <h3><b>Title:</b> ${issue.title}</h3> 
                                <h3><b>Board_Id:</b> ${issue.boardId}</h3>
                                <h3><b>State:</b> ${issue.state}</h3>

                                <button onclick="changeState('${issue._id}', '${brdId}')" id="addissuebtn">Update state >></button>
                                <button onclick="deleteIssue(event, '${issue._id}')" id="delissuebtn">Issue completed</button>
                            </div>
                        </div>
                    `;

			if (issue.state === "TODO") {
				todoContainer.innerHTML += cardHTML;
			} else if (issue.state === "IN_PROGRESS") {
				progressContainer.innerHTML += cardHTML;
			} else if (issue.state === "DONE") {
				doneContainer.innerHTML += cardHTML;
			}
		}

		const formHTML = `
                    <div id="issue-card-input">
                        <div class="card-header-input">
                            Add new Issue
                        </div>

                        <div class="card-body-input">
                            <div class="input-field">
                                <label for="Inptitle">Title: </label>
                                <input type="text" id="Inptitle">
                            </div>

                            <div class="input-field">
                                <label for="state">State: </label>
                                <input type="text" id="state">
                            </div>

                            <button onclick="addIssue(brdId)" id="submitbtn">Add Issue</button>
                        </div>
                    </div>
                `;

		todoContainer.innerHTML += formHTML;
	} catch (error) {
		console.log("Fetch Issues failed", error);
		alert("Something went wrong.");
	}
}

async function changeState(issueId, boardId) {
	const newState = prompt("Enter new Issue state: [TODO, IN_PROGRESS, DONE]");
	if (!newState) return;

	try {
		const response = await axios.put(
			`${window.location.origin}/issues_state`,
			{ issueId, boardId, newState },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Changing issue state. Please reload..");
	} catch (error) {
		console.log("Change issue failed", error);
		alert("Something went wrong.");
	}
}

async function deleteIssue(event, issueId) {
	event.stopPropagation(); //  prevents card click

	try {
		const response = await axios.delete(
			`${window.location.origin}/delete_issue`,
			{
				data: {
					issueId: issueId,
				},
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Issue Completed Successfully. Please reload ...");
	} catch (error) {
		console.log("Delete issue failed", error);
		alert("Something went wrong.");
	}
}

async function addIssue(boardId) {
	const title = document.getElementById("Inptitle").value;
	const state = document.getElementById("state").value;

	if (!title || !state) {
		alert("Fill all fields");
		return;
	}

	try {
		const response = await axios.post(
			`${window.location.origin}/add_issue`,
			{ title, boardId, state },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Adding new Issue. Please reload..");
	} catch (error) {
		console.log("Add Issue failed", error);
		alert("Something went wrong.");
	}
}

function signout() {
	localStorage.removeItem("token");

	alert("Signing out...");
	window.location = "/signin";
}

getIssues();
