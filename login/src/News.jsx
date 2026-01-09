import React, { useState, useEffect } from "react";
import {Typography } from "@mui/material";

const RSS_FEEDS = [
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.atom",
  "https://www.nhc.noaa.gov/rss.xml",
];

const News = ({ toggleTheme, mode }) => {
  const isDark = mode === "dark";
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRSS = async (url) => {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    );
    return response.json();
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let allArticles = [];

        for (let feed of RSS_FEEDS) {
          const data = await fetchRSS(feed);
          if (data.items && data.items.length > 0) {
            const mapped = data.items.map((item) => ({
              title: item.title,
              link: item.link,
              description: item.description,
              pubDate: item.pubDate,
              source: data.feed.title,
            }));
            allArticles = allArticles.concat(mapped);
          }
        }

        if (allArticles.length === 0) {
          throw new Error("No disaster articles available right now.");
        }

        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        setNews(allArticles);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "80vh", 
        width: "100%",
        marginTop: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3}}>
              News
      </Typography>

      {loading && (
        <p style={{ color: isDark ? "#eee" : "#333", textAlign: "center" }}>
          Loading news...
        </p>
      )}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>
      )}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, auto))",
            gap: "20px",
            width: "100%",
            justifyContent: "start", 
          }}
        >
          {news.map((item, index) => (
            <div
              key={index}
              style={{
                color: isDark ? "#eee" : "#333",
                backgroundColor: isDark ? "#1e1e1e" : "#fff",
                borderRadius: "10px",
                boxShadow: isDark
                  ? "0 4px 10px rgba(0,0,0,0.6)"
                  : "0 4px 10px rgba(0,0,0,0.1)",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s",
                minHeight: "280px",
              }}
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: "700",
                  textDecoration: "none",
                  color: isDark ? "#80bfff" : "#00008B",
                  marginBottom: "10px",
                }}
              >
                {item.title}
              </a>
              {item.source && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: isDark ? "white" : "#555",
                    marginBottom: "10px",
                  }}
                >
                  {item.source} |{" "}
                  {item.pubDate && new Date(item.pubDate).toLocaleString()}
                </span>
              )}
              {item.description && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: isDark ? "white" : "#333",
                    flexGrow: 1,
                  }}
                >
                  {item.description.replace(/<[^>]+>/g, "").slice(0, 150)}...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
