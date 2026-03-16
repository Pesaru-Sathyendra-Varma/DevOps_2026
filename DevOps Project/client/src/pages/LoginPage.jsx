import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto card p-4 shadow">
        <h3 className="mb-3">Welcome Back</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <input className="form-control" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="form-control" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn btn-info">Login</button>
        </form>
        <p className="mb-0 mt-3 text-secondary">No account? <Link to="/register">Register now</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
