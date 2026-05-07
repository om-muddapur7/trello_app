import { toast } from "react-toastify";
import axios from "axios";

const API = import.meta.env.VITE_API;

//http://localhost:5173/issue/69d49ac4acb0ab32b0c5d70c

// GET issues
export const getIssues = async(brdId) => {
	try {
		const response = await axios.get(
			`${API}/api/issues/?boardId=${brdId}`,
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

        return response.data.issues;
    }
    catch(error){
        console.log(error);
        toast.error("Something went wrong");
    }
}

// PUT update current state
export const changeState = async(issueId, boardId, newState) => {
	try {
		const response = await axios.put(
			`${API}/issues_state`,
			{ issueId, boardId, newState },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		toast.success("Changing issue state.");
	} catch (error) {
		console.log("Change issue failed", error);
		toast.error("Something went wrong.");
	}
}

export const deleteIssue = async(issueId) => {

	try {
		const response = await axios.delete(
			`${API}/delete_issue`,
			{
				data: {
					issueId: issueId,
				},
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		toast.success("Issue Completed Successfully.");
	} catch (error) {
		console.log("Delete issue failed", error);
		toast.error("Something went wrong.");
	}
}

export const addIssue = async(boardId, title, state) => {

	if (!title || !state) {
		alert("Fill all fields");
		return;
	}

	try {
		const response = await axios.post(
			`${API}/add_issue`,
			{ title, boardId, state },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);

		toast.success("Adding new Issue.");
        return response.data;
	} catch (error) {
		console.log("Add Issue failed", error);
		toast.error("Something went wrong.");
	}
}