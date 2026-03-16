import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Loader from "../components/Loader";

const DestinationDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [editingId, setEditingId] = useState("");

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/destinations/${id}`);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const canReview = !!user;

  const ownReview = useMemo(
    () => data?.reviews?.find((review) => review.user?._id === user?.id),
    [data, user]
  );

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!canReview) return;

    if (editingId) {
      await api.put(`/reviews/${editingId}`, form);
    } else {
      await api.post("/reviews", { destination: id, rating: Number(form.rating), comment: form.comment });
    }
    setForm({ rating: 5, comment: "" });
    setEditingId("");
    fetchDetails();
  };

  const handleDeleteReview = async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
    fetchDetails();
  };

  const startEditReview = (review) => {
    setEditingId(review._id);
    setForm({ rating: review.rating, comment: review.comment });
  };

  if (loading) return <Loader />;
  if (!data) return null;

  const { destination, reviews } = data;

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <img src={destination.image} alt={destination.name} className="w-100 rounded-4 mb-3 details-hero" />
          <h2>{destination.name}</h2>
          <p className="text-secondary">{destination.location} • {destination.category} • Rating {destination.ratingsAverage}</p>
          <p>{destination.description}</p>

          <h5 className="mt-4">Image Gallery</h5>
          <div className="row g-2">
            {destination.gallery?.map((img, index) => (
              <div key={img + index} className="col-6 col-md-4"><img src={img} className="w-100 rounded-3 gallery-thumb" /></div>
            ))}
          </div>

          <h5 className="mt-4">Travel Tips</h5>
          <ul>{destination.travelTips?.map((tip, index) => <li key={tip + index}>{tip}</li>)}</ul>

          <h5 className="mt-4">Nearby Hotels</h5>
          <ul>{destination.nearbyHotels?.map((hotel, index) => <li key={hotel + index}>{hotel}</li>)}</ul>
        </div>

        <div className="col-lg-5">
          <div className="card p-3 mb-3">
            <h5>Reviews</h5>
            <div className="review-list">
              {reviews.length ? reviews.map((review) => (
                <div key={review._id} className="border rounded p-2 mb-2">
                  <div className="d-flex justify-content-between"><strong>{review.user?.name}</strong><span>{review.rating}/5</span></div>
                  <p className="mb-1">{review.comment}</p>
                  {(user?.id === review.user?._id || user?.role === "admin") && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-info" onClick={() => startEditReview(review)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteReview(review._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )) : <p className="text-secondary">No reviews yet.</p>}
            </div>
          </div>

          {canReview && (
            <div className="card p-3">
              <h6>{ownReview || editingId ? "Edit Your Review" : "Add Review"}</h6>
              <form className="d-grid gap-2" onSubmit={handleSubmitReview}>
                <select className="form-select" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                  {[5, 4, 3, 2, 1].map((rate) => <option key={rate} value={rate}>{rate}</option>)}
                </select>
                <textarea className="form-control" rows="3" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} required />
                <button className="btn btn-info">{editingId ? "Update" : "Submit"} Review</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;
