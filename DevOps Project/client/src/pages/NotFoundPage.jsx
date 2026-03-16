import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="container py-5 text-center">
    <h1 className="display-5">404</h1>
    <p className="text-secondary">Page not found.</p>
    <Link className="btn btn-info" to="/">Go Home</Link>
  </div>
);

export default NotFoundPage;
