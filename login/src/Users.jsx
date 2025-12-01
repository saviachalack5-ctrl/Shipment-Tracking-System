import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {Typography } from "@mui/material";
import AddUsers from "./AddUsers";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "./config";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const { auth } = useAuth();

  const defaultComponents = {
    AddShipment: true,
    News: true,
    Report: true,
    Actions: true,
    EstimatedTime: true,
    status: true,
  };

  const [userSettings, setUserSettings] = useState(defaultComponents);

  useEffect(() => {
    if (!auth?.access_token) return;

    const loadUsers = async () => {
      setIsLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch users");
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [auth?.access_token]);

  useEffect(() => {
    if (!selectedUser) return;

    const loadSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/${selectedUser.id}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        const data = await res.json();
        setUserSettings(data.settings ? { ...defaultComponents, ...data.settings } : defaultComponents);
      } catch (err) {
        console.error("Failed to load settings:", err);
        setUserSettings(defaultComponents);
      }
    };

    loadSettings();
  }, [selectedUser]);


  const handleToggle = async (key, value) => {
    const newSettings = { ...userSettings, [key]: value };
    setUserSettings(newSettings);

    try {
      await fetch(`${API_BASE_URL}/settings/${selectedUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify({ settings: newSettings }),
      });
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleOpenDialog = () => setOpenAddDialog(true);
  const handleCloseDialog = () => setOpenAddDialog(false);


  const handleAddUser = async (formData) => {
    if (!auth?.access_token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to create user");


      setUsers((prev) => [data.user, ...prev.filter((user) => user.id !== data.user.id)]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
          Users Overview
      </Typography>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "20px" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#facc15",
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            "&:hover": { backgroundColor: "#fbbf24" },
          }}
        >
          Add New User
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          border: "2px solid #facc15",
          borderRadius: "30px",
          padding: "6px 14px",
          width: "380px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <SearchIcon style={{ color: "#999", marginRight: "8px" }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "15px",
            flex: 1,
            color: "#333",
            background: "transparent",
          }}
        />
      </div>

      <div style={{ marginBottom: "30px" }}>
        {isLoading ? (
          <p style={{ color: "#888" }}>Loading users...</p>
        ) : fetchError ? (
          <p style={{ color: "#d14343" }}>{fetchError}</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                backgroundColor: "white",
                padding: "12px 18px",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginBottom: "10px",
                borderLeft: "5px solid #facc15",
                cursor: "pointer",
              }}
            >
              <p style={{ margin: "0", fontWeight: "600" }}>{user.name}</p>
              <p style={{ margin: "2px 0", color: "#555" }}>{user.email}</p>
              <p style={{ margin: "0", color: "#888" }}>{user.role}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#888" }}>No users found.</p>
        )}
      </div>

      <AddUsers open={openAddDialog} onClose={handleCloseDialog} onSubmit={handleAddUser} />

        
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              borderLeft: "6px solid #facc15",
              width: "380px",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0", fontWeight: "600" }}>
              {selectedUser.name}
            </h3>

            {Object.entries(userSettings).map(([key, value]) => (
              <label
                key={key}
                style={{
                  display: "block",
                  marginBottom: "12px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleToggle(key, e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}

            <Button
              onClick={() => setSelectedUser(null)}
              sx={{
                marginTop: "10px",
                backgroundColor: "#facc15",
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#fbbf24" },
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
