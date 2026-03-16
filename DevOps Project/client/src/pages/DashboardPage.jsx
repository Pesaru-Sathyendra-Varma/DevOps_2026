import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DestinationCard from "../components/DestinationCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [recommended, setRecommended] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const tab = new URLSearchParams(location.search).get("tab") || "recommended";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recommendationRes, favoritesRes, destinationsRes, reviewsRes] = await Promise.all([
        api.get("/destinations/recommendations"),
        api.get("/favorites"),
        api.get("/destinations", { params: { page: 1, limit: 200 } }),
        api.get("/reviews/mine")
      ]);
      setRecommended(recommendationRes.data);
      setFavorites(favoritesRes.data);
      setAllDestinations(destinationsRes.data.items);
      setMyReviews(reviewsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item._id)), [favorites]);

  const toggleFavorite = async (destinationId) => {
    await api.post("/favorites/toggle", { destinationId });
    const { data } = await api.get("/favorites");
    setFavorites(data);
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-3"><DashboardSidebar /></div>
        <div className="col-lg-9">
          <div className="card p-4 mb-4">
            <h4 className="mb-1">Hello, {user?.name}</h4>
            <p className="text-secondary mb-0">Preference: {user?.travelPreference} • Budget: {user?.budget} • Location: {user?.location}</p>
          </div>

          {tab === "analytics" && (
            <AnalyticsCharts destinations={allDestinations} favoritesCount={favorites.length} reviewsCount={myReviews.length} />
          )}

          {tab === "favorites" && (
            <div className="row">
              {favorites.length ? favorites.map((item) => (
                <DestinationCard key={item._id} destination={item} isFavorite={favoriteIds.has(item._id)} onToggleFavorite={toggleFavorite} />
              )) : <p>No favorites yet.</p>}
            </div>
          )}

          {tab === "recommended" && (
            <div className="row">
              {recommended.map((item) => (
                <DestinationCard key={item._id} destination={item} isFavorite={favoriteIds.has(item._id)} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
