import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const initialDestination = {
  name: "",
  category: "Adventure",
  location: "",
  budgetRange: "Medium",
  shortDescription: "",
  description: "",
  image: "",
  gallery: "",
  travelTips: "",
  nearbyHotels: "",
  isFeatured: false
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState(initialDestination);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, destinationRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/destinations", { params: { page: 1, limit: 200 } })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDestinations(destinationRes.data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    fetchData();
  };

  const resetForm = () => {
    setForm(initialDestination);
    setEditId("");
  };

  const submitDestination = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      gallery: form.gallery ? form.gallery.split(",").map((s) => s.trim()) : [],
      travelTips: form.travelTips ? form.travelTips.split(",").map((s) => s.trim()) : [],
      nearbyHotels: form.nearbyHotels ? form.nearbyHotels.split(",").map((s) => s.trim()) : []
    };

    if (editId) {
      await api.put(`/destinations/${editId}`, payload);
    } else {
      await api.post("/destinations", payload);
    }

    resetForm();
    fetchData();
  };

  const removeDestination = async (id) => {
    await api.delete(`/destinations/${id}`);
    fetchData();
  };

  const editDestination = (item) => {
    setEditId(item._id);
    setForm({
      ...item,
      gallery: item.gallery?.join(", ") || "",
      travelTips: item.travelTips?.join(", ") || "",
      nearbyHotels: item.nearbyHotels?.join(", ") || ""
    });
  };

  if (loading) return <Loader text="Loading admin dashboard..." />;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3"><h6>Total Users</h6><h3>{stats?.totalUsers}</h3></div></div>
        <div className="col-md-3"><div className="card p-3"><h6>Total Destinations</h6><h3>{stats?.totalDestinations}</h3></div></div>
        <div className="col-md-3"><div className="card p-3"><h6>Total Reviews</h6><h3>{stats?.totalReviews}</h3></div></div>
        <div className="col-md-3"><div className="card p-3"><h6>Most Recommended</h6><h3>{stats?.topRecommended?.[0]?.name || "-"}</h3></div></div>
      </div>

      <div className="card p-3 mb-4">
        <h5>Analytics</h5>
        <Bar data={{ labels: ["Users", "Destinations", "Reviews"], datasets: [{ label: "Platform Stats", data: [stats?.totalUsers, stats?.totalDestinations, stats?.totalReviews], backgroundColor: ["#0dcaf0", "#20c997", "#ffc107"] }] }} />
      </div>

      <div className="card p-3 mb-4">
        <h5>{editId ? "Update Destination" : "Add Destination"}</h5>
        <form className="row g-2" onSubmit={submitDestination}>
          <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required /></div>
          <div className="col-md-4"><select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Adventure</option><option>Beach</option><option>Cultural</option><option>Nature</option><option>Luxury</option></select></div>
          <div className="col-md-4"><select className="form-select" value={form.budgetRange} onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></div>
          <div className="col-md-4 d-flex align-items-center"><div className="form-check"><input className="form-check-input" type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /><label className="form-check-label">Featured</label></div></div>
          <div className="col-12"><input className="form-control" placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required /></div>
          <div className="col-12"><textarea className="form-control" placeholder="Description" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="col-12"><input className="form-control" placeholder="Gallery URLs (comma-separated)" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} /></div>
          <div className="col-12"><input className="form-control" placeholder="Travel Tips (comma-separated)" value={form.travelTips} onChange={(e) => setForm({ ...form, travelTips: e.target.value })} /></div>
          <div className="col-12"><input className="form-control" placeholder="Nearby Hotels (comma-separated)" value={form.nearbyHotels} onChange={(e) => setForm({ ...form, nearbyHotels: e.target.value })} /></div>
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-info">{editId ? "Update" : "Add"} Destination</button>
            {editId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card p-3 h-100">
            <h5>Manage Destinations</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Name</th><th>Category</th><th>Location</th><th>Actions</th></tr></thead>
                <tbody>
                  {destinations.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td><td>{item.category}</td><td>{item.location}</td>
                      <td className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-info" onClick={() => editDestination(item)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeDestination(item._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card p-3 h-100">
            <h5>Manage Users</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Name</th><th>Email</th><th /></tr></thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td><td>{item.email}</td>
                      <td>{item.role !== "admin" && <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(item._id)}>Delete</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
