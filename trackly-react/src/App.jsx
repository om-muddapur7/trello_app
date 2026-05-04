import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";
import Organization from "./pages/Organizations";
import Board from "./pages/Boards";
import Issues from "./pages/Issues";
import ProtectedRoute from "./components/ProtectedRoute";

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
						<ProtectedRoute>
							<Organization />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/board/:orgId"
					element={
						<ProtectedRoute>
							<Board />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/issue/:brdId"
					element={
						<ProtectedRoute>
							<Issues />
						</ProtectedRoute>
					}
				/>
			</Routes>

			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;