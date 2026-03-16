import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    travelPreference: "Adventure",
    budget: "Medium",
    location: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto card p-4 shadow">
        <h3 className="mb-3">Create Account</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6"><input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <div className="col-md-6">
            <select className="form-select" value={form.travelPreference} onChange={(e) => setForm({ ...form, travelPreference: e.target.value })}>
              <option>Adventure</option><option>Beach</option><option>Cultural</option><option>Nature</option><option>Luxury</option>
            </select>
          </div>
          <div className="col-md-6">
            <select className="form-select" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <div className="col-md-6"><input className="form-control" placeholder="Preferred Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
          <div className="col-12"><button className="btn btn-info w-100">Register</button></div>
        </form>
        <p className="mb-0 mt-3 text-secondary">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
