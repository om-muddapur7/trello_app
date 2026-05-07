import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import "../styles/signup.css";

const API = import.meta.env.VITE_API;

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!username || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/signup`, {
        username,
        password,
      });
      toast.success("User Signed in successfully");

      navigate("/signin"); 
    } catch (error) {
      console.log("Signup failed", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="main">
        <div className="left">
          <h1>Trackly App</h1>
          <p>
            Organize your tasks, boost productivity, and collaborate seamlessly.
          </p>
        </div>

        <div className="right">
          <div className="container">
            <h1>Register</h1>

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

            <button onClick={signup} disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p>
              If already registered,{" "}
              <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;