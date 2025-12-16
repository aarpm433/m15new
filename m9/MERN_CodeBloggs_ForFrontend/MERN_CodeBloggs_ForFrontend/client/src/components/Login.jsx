import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["session_token", "user"]);

  // Check for existing session_token on load
useEffect(() => {
  let timeout = setTimeout(() => setLoading(false), 5000); // fallback
  const token = cookies.session_token;
  const user = cookies.user;

  if (token && user) {
    fetch(`http://localhost:5050/validate_token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok" && data.data.valid) {
          navigate("/home");
        } else {
          removeCookie("session_token", { path: "/" });
          removeCookie("user", { path: "/" });
          setShowForm(true);
        }
      })
      .catch(() => {
        removeCookie("session_token", { path: "/" });
        removeCookie("user", { path: "/" });
        setShowForm(true);
      })
      .finally(() => setLoading(false));
  } else {
    removeCookie("session_token", { path: "/" });
    removeCookie("user", { path: "/" });
    setShowForm(true);
    setLoading(false);
  }

  return () => clearTimeout(timeout);
}, [cookies.session_token, cookies.user, navigate, removeCookie]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login
      const loginRes = await fetch("http://localhost:5050/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.error || "Login failed");
        return;
      }

      // Create session
      const sessionRes = await fetch(`http://localhost:5050/session/${loginData.id}`, {
        method: "POST",
      });

      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        setError(sessionData.message || "Session creation failed");
        return;
      }

      // Save cookies
      setCookie("session_token", sessionData.data.token, { path: "/", sameSite: "lax" });
      setCookie("user", JSON.stringify(loginData), { path: "/", sameSite: "lax" });

      navigate("/home"); // redirect to dashboard/home
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  if (loading) return null; // or a spinner

  return showForm ? (
    <form onSubmit={handleSubmit} className="p-4 mx-auto" style={{ maxWidth: "400px" }}>
      <h2 className="mb-3">Login</h2>

      <div className="mb-3">
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your password"
          required
        />
      </div>

      <a href="/register">Don't have an account? Register here.</a>
      {error && <Alert variant="danger">{error}</Alert>}

      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  ) : null;
}