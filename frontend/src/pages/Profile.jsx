import React, { useEffect, useState } from "react";
import API from "../api/api";
import ResourceCard from "../components/ResourceCard";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);

  // Fetch logged-in user profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Fetch resources uploaded by this user
  const fetchUserResources = async () => {
    try {
      const res = await API.get("/resources");
      // Filter resources uploaded by this user
      const userResources = res.data.filter(
        (r) => r.uploader._id === user?._id
      );
      setResources(userResources);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) fetchUserResources();
  }, [user]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">{user.username}'s Profile</h1>
        <p className="text-muted">{user.email}</p>
      </div>

      <div className="mb-4">
        <h3 className="fw-bold">Uploaded Resources</h3>
        {resources.length > 0 ? (
          <div className="row">
            {resources.map((r) => (
              <div key={r._id} className="col-md-4 mb-4">
                <ResourceCard resource={r} fetchResources={fetchUserResources} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">You haven't uploaded any resources yet.</p>
        )}
      </div>
    </div>
  );
}
