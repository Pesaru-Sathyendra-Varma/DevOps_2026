const Loader = ({ text = "Loading..." }) => (
  <div className="d-flex flex-column justify-content-center align-items-center py-5">
    <div className="spinner-border text-info" role="status" />
    <p className="mt-3 mb-0 text-secondary">{text}</p>
  </div>
);

export default Loader;
