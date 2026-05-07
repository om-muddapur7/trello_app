import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";
import Organization from "./pages/Organizations";
import Board from "./pages/Boards";
import Issues from "./pages/Issues";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />

				{/* Protected routes */}
				<Route
					path="/organization"
					element={
						<ProtectedRoutes>
							<Organization />
						</ProtectedRoutes>
					}
				/>

				<Route
					path="/board/:orgId"
					element={
						<ProtectedRoutes>
							<Board />
						</ProtectedRoutes>
					}
				/>

				<Route
					path="/issue/:brdId"
					element={
						<ProtectedRoutes>
							<Issues />
						</ProtectedRoutes>
					}
				/>
			</Routes>

			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;