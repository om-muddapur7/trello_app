import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { toast } from "react-toastify";

function Navbar() {
	const navigate = useNavigate();

	const signout = () => {
		localStorage.removeItem("token");
		alert("Signing out...");
		navigate("/signin");
	}

	const checkAuthAndNavigateO = (path) => {
		const token = localStorage.getItem("token");

		if (token) {
			navigate(path);
		} else {
			toast.info("Please sign in first");
			navigate("/signin");
		}
	};

	const checkAuthAndNavigate = (path) => {
		toast.info("Please select the organization/board");
		navigate("/organization");
	};

	const checkAuthAndNavigateH = (path) => {
		navigate(path);
	};

	return (
		<nav className="navbar">
			<div className="nav-left">
				<span className="logo">Trackly</span>
			</div>

			<div className="nav-center">
				<button className="nav-links" onClick={() => checkAuthAndNavigateH("/")}>
					Home
				</button>

				<button className="nav-links" onClick={() => checkAuthAndNavigateO("/organization")}>
					Organizations
				</button>

				<button className="nav-links" onClick={() => checkAuthAndNavigate("/boards")}>
					Boards
				</button>

				<button className="nav-links" onClick={() => checkAuthAndNavigate("/issues")}>
					Issues
				</button>
			</div>

			<div className="nav-right">
				<button className="nav-btn" onClick={signout}>
					Logout
				</button>
			</div>
		</nav>
	);
}

export default Navbar;
