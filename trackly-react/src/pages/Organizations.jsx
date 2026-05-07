import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import "../styles/organization.css";
import {
	getOrganizations,
	deleteOrg,
	addMember,
	removeMember,
	addOrg,
} from "../api/organization_api.js";

const Organization = () => {
	const navigate = useNavigate();

    //opening ORG
	const openOrg = (orgId) => {
		toast.info("Opening Org");
		navigate(`/board/${orgId}`);
	};

    //Variables
	const [orgs, setOrgs] = useState([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

    //ADD members
	const handleAddMember = async (orgId) => {
		const username = prompt("Enter member username:");
		if (!username) return;

		try {
			const response = await addMember(orgId, username);

            if (!response || !response.id) {
                toast.error("Failed to add member");
                return;
            }

            const newMember = {
                id: response.id,
                username: username   
            };

			setOrgs((prev) =>
				prev.map((org) =>
					org.id === orgId
						? {
								...org,
								members: [...org.members, newMember],
							}
						: org,
				),
			);
			toast.success("member added");
		} catch (error) {
			console.log(error);
			toast.error("Error adding member");
            throw error;
		}
	};

    // REMOVE members
	const handleRemoveMember = async (memberId, username, orgId) => {
		try {
			await removeMember(memberId, username, orgId);

			setOrgs((prev) =>
				prev.map((org) =>
					org.id === orgId
						? {
								...org,
								members: org.members.filter((m) => m.id !== memberId),
							}
						: org,
				),
			);
		} catch (error) {
			console.log(error);
		}
	};

    // ADD orgs
	const handleAddOrg = async () => {
		try {
			const response = await addOrg(title, description);

			if (!response || !response.id) {
                toast.error("Failed to add organization");
                return;
            }

			const newOrg = {
                id: response.id,
                title: response.title,
				description: response.description,
				admin: response.admin,
				members: []   
            };

			setOrgs((prev) => [
				...prev, newOrg,
			]);

			setTitle("");
			setDescription("");
		} catch (error) {
			console.log(error);
		}
	};

    // DELETE orgs
	const handleDeleteOrg = async (orgId) => {
		try {
			await deleteOrg(orgId);

			setOrgs((prev) => prev.filter((org) => org.id !== orgId));
		} catch (error) {
			console.log(error);
		}
	};

    //render UI
	useEffect(() => {
		const fetchOrgs = async () => {
			try {
				const data = await getOrganizations();
				setOrgs(data || []);
			} catch (error) {
				console.log("Fetch Org's failed", error);
				toast.error("Something went wrong.");
			}
		};

		fetchOrgs();
	}, []);

	return (
		<>
			<Navbar />
			<div className="container">
				<h1 id="title">Workspace</h1>

				{!orgs || orgs.length === 0 ? (
                    <div className="cards" id="cards">
                        <div id="org-card-input">
                            <div className="card-header-input">Add new organization</div>

                            <div className="card-body-input">
                                <div className="input-field">
                                    <label htmlFor="Inptitle">Title: </label>
                                    <input
                                        type="text"
                                        id="Inptitle"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="description">Description: </label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <button onClick={handleAddOrg} id="submitbtn">
                                    Add organization
                                </button>
                            </div>
                        </div>
                    </div>
				) : (
					<div className="cards" id="cards">
						{orgs.map((org, index) => (
							<div className="org-card" key={org.id} onClick={() => openOrg(org.id)}>
								<div className="card-header">Organization {index + 1}</div>

								<div className="card-body">
									<h3>
										<b>Title:</b> {org.title}
									</h3>
									<h3>
										<b>Description:</b> {org.description}
									</h3>
									<h3>
										<b>Admin ID:</b> {org.admin}
									</h3>
									<h3>
										<b>Members: </b>
									</h3>
									<ul>
										{org.members.map((m) => (
											<li key={m.id} data-id={m.id}>
												{m.username}
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleRemoveMember(m.id, m.username, org.id);
													}}
												>
													Remove
												</button>
											</li>
										))}
									</ul>

									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAddMember(org.id);
										}}
										id="addMembtn"
									>
										Add members
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteOrg(org.id);
										}}
										id="delOrgbtn"
									>
										Delete organization
									</button>
								</div>
							</div>
						))}

						<div id="org-card-input">
							<div className="card-header-input">Add new organization</div>

							<div className="card-body-input">
								<div className="input-field">
									<label htmlFor="Inptitle">Title: </label>
									<input
										type="text"
										id="Inptitle"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>

								<div className="input-field">
									<label htmlFor="description">Description: </label>
									<input
										type="text"
										id="description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</div>

								<button onClick={handleAddOrg} id="submitbtn">
									Add organization
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<Footer />
		</>
	);
};

export default Organization;