import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import "../styles/board.css";
import { getBoards, deleteBoard, addBoard } from "../api/board_api.js";

const Board = () => {
    const navigate = useNavigate();
    
    //opening ORG
    const openBoard = (brdId) => {
        toast.info("Opening Board");
        navigate(`/issue/${brdId}`);
    };

	const [boards, setBoards] = useState([]);
	const [title, setTitle] = useState("");
	const { orgId } = useParams();

	const handleAddBoard = async () => {
		try {
			const response = await addBoard(orgId, title);

			if (!response || !response._id) {
				toast.error("Failed to add organization");
				return;
			}

            const newBoard = {
                _id: response._id,
                title: response.title,
                organizationId: response.organizationId
            }

            setBoards((prev) => [
                ...prev, newBoard
            ])
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteBoard = async (brdId) => {
		try {
			await deleteBoard(brdId);

			setBoards((prev) => prev.filter((board) => board._id !== brdId));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const fetchBoards = async () => {
			try {
				const data = await getBoards(orgId);
				setBoards(data || []);
			} catch (error) {
				console.log("Fetch Board failed", error);
				toast.error("Something went wrong.");
			}
		};

		fetchBoards();
	}, []);

	return (
		<>
			<Navbar />

			<div className="container">
				<h1 id="title">Projects</h1>

				{!boards || boards.length === 0 ? (
					<div className="cards" id="cards">
						<div id="brd-card-input">
							<div className="card-header-input">Add new Board</div>

							<div className="card-body-input">
								<div className="input-field">
									<label htmlFor="Inptitle">Title: </label>
									<input
										type="text"
										value={title}
										id="Inptitle"
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>

								<button onClick={handleAddBoard} id="submitbtn">
									Add Board
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="cards" id="cards">
						{boards.map((brd, index) => (
							<div
								id="brd-card"
								key={brd._id}
								onClick={() => {
									openBoard(brd._id);
								}}
							>
								<div className="card-header">Board {index + 1}</div>

								<div className="card-body">
									<h3>
										<b>Title:</b> {brd.title}
									</h3>
									<h3>
										<b>Organization_Id:</b> {brd.organizationId}
									</h3>

									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteBoard(brd._id);
										}}
										id="delBrdbtn"
									>
										Delete Board
									</button>
								</div>
							</div>
						))}

						<div id="brd-card-input">
							<div className="card-header-input">Add new Board</div>

							<div className="card-body-input">
								<div className="input-field">
									<label htmlFor="Inptitle">Title: </label>
									<input
										type="text"
										value={title}
										id="Inptitle"
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>

								<button onClick={handleAddBoard} id="submitbtn">
									Add Board
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

export default Board;
