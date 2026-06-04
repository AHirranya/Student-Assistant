import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const res = await API.get("/auth/me");
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <p className="sub-text">Your account details.</p>

      {profile && (
        <div className="section-card">
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;