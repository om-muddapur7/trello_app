import { Link } from "react-router-dom";
import { useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import "../styles/home.css";

function Home() {
  const containerRef = useRef(null);

	return (
		<>
			<Navbar />

			<div className="title-card">
				<h1 id="head-title">Trackly</h1>
				<p id="head-para">
					Manage your work efficiently with a simple and powerful workflow
					system. Create organizations, organize boards, and track issues
					seamlessly — all in one place.
				</p>

				<div className="hero-actions">
					<button className="primary-btn">
						<Link to="/signup">Get Started</Link>
					</button>

					<button
						className="secondary-btn"
						onClick={() => containerRef.current?.scrollIntoView({ behavior: "smooth" })}
					>
						Explore
					</button>
				</div>
				<div className="floating-icons">
					<span>⚡</span>
					<span>💻</span>
					<span>📌</span>
				</div>
			</div>

			<div className="container" ref={containerRef}>
				<div className="card">
					<h2>Organizations</h2>
					<div className="card-content">
						<img src="/1img.png" alt="Organizations" />
						<div className="card-text">
							<p>
								Organizations help you group work based on teams, projects, or
								goals...
							</p>
							<p>
								Each organization allows you to manage members and control
								access.
							</p>
							<p>Think of an organization as your top-level workspace.</p>
						</div>
					</div>
				</div>

				<div className="card">
					<h2>Boards</h2>
					<div className="card-content">
						<img src="/2img.jpg" alt="Boards" />
						<div className="card-text">
							<p>
								Boards exist inside organizations and help you break work into
								manageable sections.
							</p>
							<p>Use boards to visually organize tasks and track progress.</p>
							<p>
								Example: "Website Development", "Placement Prep", or "Hackathon
								Project".
							</p>
						</div>
					</div>
				</div>

				<div className="card">
					<h2>Issues</h2>
					<div className="card-content">
						<img src="/3img.png" alt="Issues" />
						<div className="card-text">
							<p>
								Issues are the smallest unit of work — tasks you need to
								complete.
							</p>
							<p>
								Track progress using states like:{" "}
								<b>TODO → IN PROGRESS → DONE</b>
							</p>
							<p>
								This helps you maintain clarity and ensure nothing gets missed.
							</p>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}

export default Home;
