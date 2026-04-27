import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import Organization from "./pages/Organizations";
import Board from "./pages/Boards";
import Issues from "./pages/Issues";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/organization" element={<Organization />} />
				<Route path="/board/:orgId" element={<Board />} />
				<Route path="/issue/:brdId" element={<Issues />} />
			</Routes>

			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;
