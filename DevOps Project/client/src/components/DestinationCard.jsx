import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

const DestinationCard = ({ destination, isFavorite, onToggleFavorite }) => (
  <div className="col-md-6 col-lg-4 mb-4">
    <div className="card destination-card h-100 border-0 shadow-sm">
      <img src={destination.image} className="card-img-top card-image" alt={destination.name} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{destination.name}</h5>
          <button className="btn btn-sm btn-light" onClick={() => onToggleFavorite?.(destination._id)}>
            {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
          </button>
        </div>
        <p className="text-secondary small mb-2">{destination.location} • {destination.category}</p>
        <p className="card-text flex-grow-1">{destination.shortDescription}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1"><FaStar /> {destination.ratingsAverage?.toFixed?.(1) ?? destination.ratingsAverage}</span>
          <Link to={`/destinations/${destination._id}`} className="btn btn-info btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  </div>
);

export default DestinationCard;
