import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading articles...</p>
    </div>
  );
}

export default LoadingSpinner;
