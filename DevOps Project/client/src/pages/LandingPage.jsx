import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import DestinationCard from "../components/DestinationCard";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

const LandingPage = () => {
  const [featured, setFeatured] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [featuredRes, destinationRes] = await Promise.all([
        api.get("/destinations/featured"),
        api.get("/destinations", { params: { search, category, page, limit: 6 } })
      ]);
      setFeatured(featuredRes.data);
      setDestinations(destinationRes.data.items);
      setPages(destinationRes.data.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, category]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchData();
  };

  return (
    <>
      <section className="hero-section text-white">
        <div className="container py-5">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h1 className="display-4 fw-bold">Discover Your Next Dream Destination</h1>
            <p className="lead col-lg-7">AI-inspired travel recommendations personalized by preferences, reviews, and ratings.</p>
            <form className="row g-2 mt-3" onSubmit={handleSearch}>
              <div className="col-md-5"><input className="form-control" placeholder="Search by destination or location" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
              <div className="col-md-3">
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Beach">Beach</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Nature">Nature</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div className="col-md-2"><button className="btn btn-info w-100" type="submit">Search</button></div>
              <div className="col-md-2"><Link className="btn btn-outline-light w-100" to="/register">Get Started</Link></div>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Featured Destinations</h2>
        <div className="row">
          {featured.map((item) => <DestinationCard key={item._id} destination={item} />)}
        </div>
      </section>

      <section className="container pb-5">
        <h2 className="mb-4">Explore Destinations</h2>
        {loading ? <Loader /> : (
          <>
            <div className="row">
              {destinations.map((item) => <DestinationCard key={item._id} destination={item} />)}
            </div>
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </section>
    </>
  );
};

export default LandingPage;
