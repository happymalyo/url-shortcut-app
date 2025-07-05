import React, { useState } from "react";
import { createShortUrl } from "./services/api";
import "./App.css";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await createShortUrl(originalUrl);
      console.log(result);
      setShortUrl(`${apiUrl}/${result.shortCode}`);
    } catch (err) {
      setError("Failed to create short URL. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">URL Shortener</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="originalUrl">Original URL</label>
            <input
              type="url"
              id="originalUrl"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            Shorten URL
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {shortUrl && (
          <div className="result">
            <h2>Your short URL:</h2>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
