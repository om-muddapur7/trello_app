import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import "../styles/issues.css";
import {
	getIssues,
	changeState,
	deleteIssue,
	addIssue,
} from "../api/issue_api.js";

const Issues = () => {
	const [issues, setIssues] = useState([]);
	const [title, setTitle] = useState("");
	const [state, setState] = useState("");
	const { brdId } = useParams();

	const handleChangeState = async (issueId, boardId) => {
		const newState = prompt("Enter new Issue state: [TODO, IN_PROGRESS, DONE]");
		if (!newState) return;

		try {
			await changeState(issueId, boardId, newState);

			setIssues((prev) =>
				prev.map((issue) =>
					issue._id === issueId ? { ...issue, state: newState } : issue,
				),
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteIssue = async (issueId) => {
		try {
			await deleteIssue(issueId);

			setIssues((prev) => prev.filter((issue) => issue._id !== issueId));
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddIssue = async (brdId) => {
		try {
			const formattedState = state.trim().toUpperCase();

			const response = await addIssue(brdId, title, formattedState);
			if (!response) return;

			const newIssue = {
				_id: response._id,
				title: response.title,
				state: response.state,
				boardId: response.boardId,
			};

			setIssues((prev) => [...prev, newIssue]);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const fetchIssues = async () => {
			try {
				const data = await getIssues(brdId);
				setIssues(data || []);
			} catch (error) {
				console.log(error);
				toast.error("Something went wrong");
			}
		};

		fetchIssues();
	}, []);

	return (
		<>
			<Navbar />

			<div className="container">
				<h1 id="title">Tasks</h1>

				<div className="cards" id="cards">
					<div className="TODO">
						<div className="card-header">
							<h1>TODO</h1>
						</div>

						<div className="card-body" id="TODO-body">
							{issues
								.filter((issue) => issue.state?.toUpperCase() === "TODO")
								.map((issue, i) => (
									<div className="issue-card" key={issue._id}>
										<div className="card-header">Issue {i + 1}</div>

										<div className="card-body">
											<h3>
												<b>Title:</b> {issue.title}
											</h3>
											<h3>
												<b>Board_Id:</b> {issue.boardId}
											</h3>
											<h3>
												<b>State:</b> {issue.state}
											</h3>

											<button
												onClick={() => handleChangeState(issue._id, brdId)}
												id="addissuebtn"
											>
												Update state
											</button>

											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteIssue(issue._id);
												}}
												id="delissuebtn"
											>
												Issue completed
											</button>
										</div>
									</div>
								))}
						</div>

						<div id="issue-card-input">
							<div className="card-header-input">Add new Issue</div>

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
									<label htmlFor="state">State: </label>
									<select
										value={state}
										onChange={(e) => setState(e.target.value)}
									>
										<option value="">Choose state</option>
										<option value="TODO">TODO</option>
										<option value="IN_PROGRESS">IN_PROGRESS</option>
										<option value="DONE">DONE</option>
									</select>
								</div>

								<button onClick={() => handleAddIssue(brdId)} id="submitbtn">
									Add Issue
								</button>
							</div>
						</div>
					</div>

					<div className="IN_PROGRESS">
						<div className="card-header">
							<h1>IN_PROGRESS</h1>
						</div>

						<div className="card-body" id="IN_PROGRESS-body">
							{issues
								.filter((issue) => issue.state?.toUpperCase() === "IN_PROGRESS")
								.map((issue, i) => (
									<div className="issue-card" key={issue._id}>
										<div className="card-header">Issue {i + 1}</div>

										<div className="card-body">
											<h3>
												<b>Title:</b> {issue.title}
											</h3>
											<h3>
												<b>Board_Id:</b> {issue.boardId}
											</h3>
											<h3>
												<b>State:</b> {issue.state}
											</h3>

											<button
												onClick={() => handleChangeState(issue._id, brdId)}
												id="addissuebtn"
											>
												Update state
											</button>

											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteIssue(issue._id);
												}}
												id="delissuebtn"
											>
												Issue completed
											</button>
										</div>
									</div>
								))}
						</div>
					</div>

					<div className="DONE">
						<div className="card-header">
							<h1>DONE</h1>
						</div>

						<div className="card-body" id="DONE-body">
							{issues
								.filter((issue) => issue.state?.toUpperCase() === "DONE")
								.map((issue, i) => (
									<div className="issue-card" key={issue._id}>
										<div className="card-header">Issue {i + 1}</div>

										<div className="card-body">
											<h3>
												<b>Title:</b> {issue.title}
											</h3>
											<h3>
												<b>Board_Id:</b> {issue.boardId}
											</h3>
											<h3>
												<b>State:</b> {issue.state}
											</h3>

											<button
												onClick={() => handleChangeState(issue._id, brdId)}
												id="addissuebtn"
											>
												Update state
											</button>

											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteIssue(issue._id);
												}}
												id="delissuebtn"
											>
												Issue completed
											</button>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Issues;
