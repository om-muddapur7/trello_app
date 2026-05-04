function getOrgId() {
	const params = new URLSearchParams(window.location.search);
	return params.get("orgId");
}

const orgId = getOrgId();

async function getBoards() {
	
	const cards = document.getElementById("cards");
	let html = "";

	try {
		const response = await axios.get(
			`${window.location.origin}/api/boards?organizationId=${orgId}`,
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		const brd = response.data.boards;

		console.log(brd);

		for (let i = 0; i < brd.length; i++) {
			html += `
                        <div id="brd-card" onclick="openBoard('${brd[i]._id}')">
                            <div class="card-header">
                                Board ${i + 1}
                            </div>

                            <div class="card-body" >
                                <h3><b>Title:</b>  ${brd[i].title}</h3> 
                                <h3><b>Organization_Id:</b>  ${brd[i].organizationId}</h3>

                                <button onclick="deleteBoard(event, '${brd[i]._id}')" id="delBrdbtn">Delete Board</button>
                            </div>
                        </div>
                    `;
		}

        html += `
                    <div id="brd-card-input">
                        <div class="card-header-input">
                            Add new Board
                        </div>

                        <div class="card-body-input">
                            <div class="input-field">
                                <label for="Inptitle">Title: </label>
                                <input type="text" id="Inptitle">
                            </div>

                            <button onclick="addBoard(orgId)" id="submitbtn">Add Board</button>
                        </div>
                    </div>
                `;

		cards.innerHTML = html;

	} catch (error) {
		console.log("Fetch Board failed", error);
		alert("Something went wrong.");
	}
}

function openBoard(brdId) {
	alert("Opening Board ", brdId);
	window.location.href = `issues.html?brdId=${brdId}`;
}

async function addBoard(organizationId) {
	const title = document.getElementById("Inptitle").value;

	if (!title) {
		alert("Fill all fields");
		return;
	}

	try {
		const response = await axios.post(
			`${window.location.origin}/add_board`,
			{ title, organizationId },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Adding new Board. Please reload..");
	} catch (error) {
		console.log("Add Board failed", error);
		alert("Something went wrong.");
	}
}

async function deleteBoard(event, brdId) {
	event.stopPropagation(); //  prevents card click

	try {
		const response = await axios.delete(
			`${window.location.origin}/delete_board`,
			{
				data: {
					boardId: brdId,
				},
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);
 
		alert("Board deleted. Please reload ...");
	} catch (error) {
		console.log("Delete Board failed", error);
		alert("Something went wrong.");
	}
}

function signout() {
	localStorage.removeItem("token");

	alert("Signing out...");
	window.location = "/signin";
}

getBoards();
