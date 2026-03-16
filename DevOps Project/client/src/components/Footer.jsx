import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => (
  <footer className="footer py-4 mt-5">
    <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
      <p className="mb-0">© {new Date().getFullYear()} Smart Tourism Recommendation Dashboard</p>
      <div className="d-flex gap-3 fs-5">
        <a href="#" className="social-link"><FaGithub /></a>
        <a href="#" className="social-link"><FaLinkedin /></a>
        <a href="#" className="social-link"><FaInstagram /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
