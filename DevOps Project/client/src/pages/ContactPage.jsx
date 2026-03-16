import { useState } from "react";
import api from "../services/api";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/contacts", form);
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("Could not send message.");
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
        <h3>Contact Us</h3>
        <p className="text-secondary">Tell us what kind of travel support you need.</p>
        {status && <div className="alert alert-info py-2">{status}</div>}
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="form-control" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <textarea className="form-control" placeholder="Message" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <button className="btn btn-info">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
