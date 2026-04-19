async function getOrgs() {
	const cards = document.getElementById("cards");
	let html = "";

	try {
		const response = await axios.get(
			`${window.location.origin}/api/organization`,
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		const org = response.data.organizations;

		for (let i = 0; i < org.length; i++) {
			html += `
                        <div id="org-card" onclick="openOrg('${org[i].id}')">
                            <div class="card-header">
                                Organization ${i + 1}
                            </div>

                            <div class="card-body" >
                                <h3><b>Title:</b>  ${org[i].title}</h3> 
                                <h3><b>Description:</b>  ${org[i].description}</h3>
                                <h3><b>Admin ID:</b>  ${org[i].admin}</h3> 
                                <h3><b>Members: </b></h3>
                                <ul>
                                    ${org[i].members
																			.map(
																				(m) => `
                                        <li data-id="${m.id}">
                                            ${m.username}
                                            <button onclick="removeMember(event, '${m.id}', '${m.username}', '${org[i].id}')">Remove</button>
                                        </li>
                                    `,
																			)
																			.join("")}
                                </ul>
                                <button onclick="addMember(event, '${org[i].id}')" id="addMembtn">Add members</button>
                                <button onclick="deleteOrg(event, '${org[i].id}')" id="delOrgbtn">Delete organization</button>
                            </div>
                        </div>
                    `;
		}

		html += `
                    <div id="org-card-input">
                        <div class="card-header-input">
                            Add new organization
                        </div>

                        <div class="card-body-input">
                            <div class="input-field">
                                <label for="Inptitle">Title: </label>
                                <input type="text" id="Inptitle">
                            </div>

                            <div class="input-field">
                                <label for="description">Description: </label>
                                <input type="text" id="description">
                            </div>

                            <button onclick="addOrg()" id="submitbtn">Add organization</button>
                        </div>
                    </div>
                `;

		cards.innerHTML = html;
	} catch (error) {
		console.log("Fetch Org's failed", error);
		alert("Something went wrong.");
		showToast("Something went wrong.", "error");
	}
}

function openOrg(orgId) {
	alert("Opening Org");
	window.location.href = `board.html?orgId=${orgId}`;
}

async function deleteOrg(event, orgId) {
	event.stopPropagation(); //  prevents card click

	try {
		const response = await axios.delete(
			`${window.location.origin}/delete_organization`,
			{
				data: {
					organizationId: orgId,
				},
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Org deleted. Please reload ...");
	} catch (error) {
		console.log("Delete Org failed", error);
		alert("Something went wrong.");
	}
}

async function addMember(event, orgId) {
	event.stopPropagation(); //  prevents card click

	const memUserUsername = prompt("Enter member username:");
	if (!memUserUsername) return;

	try {
		const response = await axios.post(
			`${window.location.origin}/add-mem-to-organization`,
			{
				organizationId: orgId,
				memUserUsername,
			},
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		const memId = response.data.id;

		const memberList = event.target.closest(".card-body").querySelector("ul");

		const li = document.createElement("li");
		li.innerHTML = `
                    ${memUserUsername}
                    <button onclick="removeMember(event, '${memId}', '${memUserUsername}', '${orgId}')">Remove</button>
                `;

		memberList.appendChild(li);

		alert("Member added");
	} catch (error) {
		console.log("Add Member failed", error);
		alert("Something went wrong.");
	}
}

async function removeMember(event, memberId, memUsername, orgId) {
	event.stopPropagation(); //  prevents card click

	const organizationId = orgId;
	const memUserUsername = memUsername;

	try {
		const response = await axios.delete(
			`${window.location.origin}/delete_members`,
			{
				data: {
					organizationId: organizationId,
					memUserUsername: memUserUsername,
				},
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Deleted member. Please reload..");
	} catch (error) {
		console.log("Delete Member failed", error);
		alert("Something went wrong.");
	}
}

async function addOrg() {
	const title = document.getElementById("Inptitle").value;
	const description = document.getElementById("description").value;

	if (!title || !description) {
		alert("Fill all fields");
		return;
	}

	try {
		const response = await axios.post(
			`${window.location.origin}/add_organization`,
			{ title, description },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		alert("Adding new Organization. Please reload..");
	} catch (error) {
		console.log("Add Org failed", error);
		alert("Something went wrong.");
	}
}

function signout() {
	localStorage.removeItem("token");

	alert("Signing out...");
	window.location = "/signin";
}

getOrgs();
