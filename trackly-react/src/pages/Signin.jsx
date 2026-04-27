import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import "../styles/signin.css";

const API = "http://localhost:3000";

const SignIn = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signin = async () => {
    if (!username || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/signin`, {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      toast.success("User Signed in successfully");

      navigate("/"); // ✅ enable navigation
    } catch (error) {
      console.log("Signin failed", error);
      toast.error(error?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <Navbar />

      <div className="main">
        <div className="left">
          <h1>Trackly App</h1>
          <p>
            Organize your tasks, boost productivity, and collaborate seamlessly.
          </p>
        </div>

        <div className="right">
          <div className="container">
            <h1>Sign In</h1>

            <div className="input-field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signin()}
              />
            </div>

            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signin()}
              />
            </div>

            <button onClick={signin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p>
              If not yet registered,{" "}
              <Link to="/signup">Register here</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignIn;