import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    birthday: "",
    occupation: "",
    location: "",
    auth_level:"basic",
    status:"",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // update form on input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5050/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        });


      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // success → redirect to login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} className="p-4 mx-auto" style={{ maxWidth: "400px" }}>
      <h2 className="mb-3">Registration</h2>

    <div className="mb-3">
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your first name"
          required
        />
    </div>
    <div className="mb-3">
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your last name"
          required
        />
    </div>    
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
    <div className="mb-3">
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          className="form-control"
          placeholder="0000-00-00"
          required
        />
    </div>
    <div className="mb-3">
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your occupation"
          required
        />
    </div>
    <div className="mb-3">
        <input
          type="text"
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your location"
          required
        />
    </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <button type="submit" className="btn btn-primary w-100">Register</button>
      <a href="/login" className="d-block text-center mt-3">Already have an account? Login here.</a>
    </form>
  );
}