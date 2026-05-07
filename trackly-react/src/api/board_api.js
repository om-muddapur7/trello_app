import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API;

// trial : board/69d3da7bc2db3265ae05a843

//  GET boards
export const getBoards = async (orgId) => {
  const res = await axios.get(`${API}/api/boards?organizationId=${orgId}`, {
    headers: {
      token: localStorage.getItem("token"),
    },
  });

  return res.data.boards;
};

//  ADD board
export const addBoard = async(organizationId, title) => {
	if (!title) {
		toast.info("Fill all fields");
		return;
	}

	try {
		const response = await axios.post(
			`${API}/add_board`,
			{ title, organizationId },
			{
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);
		toast.success("Adding new Board.");
        return response.data;
	} catch (error) {
		console.log("Add Board failed", error);
		toast.error("Something went wrong.");
	}
}

// DELETE board
export const deleteBoard = async(brdId) => {
	try {
		const response = await axios.delete(
			`${API}/delete_board`,
			{
				data: {
					boardId: brdId,
				},
				headers: {
					token: localStorage.getItem("token"),
				},
			},
		);
 
		toast.success("Board deleted.");
	} catch (error) {
		console.log("Delete Board failed", error);
		toast.error("Something went wrong.");
	}
}