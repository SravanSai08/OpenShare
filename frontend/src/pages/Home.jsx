import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import ResourceCard from "../components/ResourceCard";

export default function Home() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources");
      setResources(res.data);
      setFilteredResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchResources();
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredResources(resources);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.category?.toLowerCase().includes(lowerQuery) ||
          r.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
      setFilteredResources(filtered);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <section
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{
            minHeight: "90vh",
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            color: "white",
            padding: "2rem",
          }}
        >
          <h1 className="display-4 fw-bold mb-3">Welcome to OpenShare 🎓</h1>
          <p className="lead mb-4" style={{ maxWidth: "650px" }}>
            Empower your learning by accessing and sharing free educational
            resources — notes, guides, and projects from students like you.
          </p>
          <div className="d-flex gap-3">
            <button
              className="btn btn-light btn-lg fw-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <Link
              to="/register"
              className="btn btn-outline-light btn-lg fw-semibold"
            >
              Register
            </Link>
          </div>
        </section>

        <section className="container text-center py-5">
          <h2 className="fw-bold mb-3">What is OpenShare?</h2>
          <p
            className="text-muted mb-5"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            OpenShare is a platform that encourages collaboration and knowledge
            sharing among students and educators. Upload, explore, and learn
            from community-driven content — free and open for all.
          </p>
        </section>

        <section className="bg-light py-5 text-center">
          <div className="container">
            <h2 className="fw-bold mb-4">What Our Users Say</h2>
            <div className="row">
              <div className="col-md-4">
                <blockquote className="blockquote p-3 shadow-sm rounded">
                  <p>“OpenShare helped me find complete notes right before exams!”</p>
                  <footer className="blockquote-footer text-dark">Ananya, Student</footer>
                </blockquote>
              </div>
              <div className="col-md-4">
                <blockquote className="blockquote p-3 shadow-sm rounded">
                  <p>“I love sharing my project files here and helping others learn.”</p>
                  <footer className="blockquote-footer text-dark">Ravi, Engineer</footer>
                </blockquote>
              </div>
              <div className="col-md-4">
                <blockquote className="blockquote p-3 shadow-sm rounded">
                  <p>“It’s like GitHub, but for academic resources!”</p>
                  <footer className="blockquote-footer text-dark">Sneha, Developer</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center text-center mt-5">
      <h1 className="display-4 mb-3 text-primary fw-bold">All Resources</h1>
      <p className="lead mb-4 text-muted">
        Browse and download educational materials shared by our community.
      </p>

      {/* Search Bar */}
      <div className="mb-4 w-100" style={{ maxWidth: "500px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by title, category, or tags..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="row justify-content-center w-100">
        {filteredResources.length > 0 ? (
          filteredResources.map((r) => (
            <div key={r._id} className="col-md-4 mb-4">
              <ResourceCard resource={r} fetchResources={fetchResources} />
            </div>
          ))
        ) : (
          <p className="text-muted">No resources match your search.</p>
        )}
      </div>
    </div>
  );
}
