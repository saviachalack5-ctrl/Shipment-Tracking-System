import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Chip, Typography, MenuItem, Select } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import SearchIcon from "@mui/icons-material/Search";
import ExportButtons from "./ExportButtons";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "./config";

const ArchivedShipments = ({ mode }) => {
  const { auth } = useAuth();
  const [shipmentList, setShipmentList] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const isDark = mode === "dark";

  useEffect(() => {
    const loadSettings = async () => {
      if (!auth?.user?.id) return;
      setLoadingSettings(true);
      try {
        const res = await fetch(`${API_BASE_URL}/settings/${auth.user.id}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        const data = await res.json();
        setUserSettings(data.settings || {
          AddShipment: true,
          Actions: true,
          EstimatedTime: true,
          status: true,
          News: true,
          Report: true,
          Archives: true
        });
      } catch (err) {
        setUserSettings({
          AddShipment: true, Actions: true, EstimatedTime: true, status: true, News: true, Report: true
        });
      } finally {
        setLoadingSettings(false);
      }
    };
    loadSettings();
  }, [auth]);

  useEffect(() => {
    if (!auth?.access_token) return;
    const fetchArchived = async () => {
      try {
        
        const res = await fetch(`${API_BASE_URL}/shipments/archived`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        const data = await res.json();
        setShipmentList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load archived shipments", err);
      }
    };
    fetchArchived();
  }, [auth]);

  const shipmentsWithStatus = shipmentList.map((s) => ({
    ...s,
    status: (deliveryTime => {
        if (!deliveryTime) return "Pending";
        const today = new Date();
        const deliveryDate = new Date(deliveryTime);
        today.setHours(0, 0, 0, 0);
        deliveryDate.setHours(0, 0, 0, 0);
        if (deliveryDate.toDateString() === today.toDateString()) return "Docked";
        if (deliveryDate < today) return "Overdue";
        return "In Transit";
    })(s.time),
  }));

  
  const filteredShipments = shipmentsWithStatus.filter((s) => {
    const matchesSearch = Object.values(s).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === "All Status" || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRestore = async (row) => {
    try {
      await fetch(`${API_BASE_URL}/shipments/${row.id}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });
      setShipmentList((prev) => prev.filter((s) => s.id !== row.id));
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  if (loadingSettings || !userSettings) {
    return <div style={{ padding: "20px" }}><Typography variant="h5">Loading...</Typography></div>;
  }

  
  const columns = [
    { field: "mmsi", headerName: "Ship MMSI", label: "Ship MMSI", width: 200 },
    { field: "bol", headerName: "Ship BOL", label: "Ship BOL", width: 220 },
    { field: "id", headerName: "Ship ID", label: "Ship ID", width: 180 },
    ...(userSettings.EstimatedTime ? [{ field: "time", headerName: "Estimated Time", label: "Estimated Time", width: 200 }] : []),
    ...(userSettings.status ? [{
        field: "status",
        headerName: "Status",
        label: "Status",
        width: 180,
        renderCell: (params) => {
          let color = params.value === "In Transit" ? "#2563eb" : params.value === "Overdue" ? "#d20000ff" : "#05a334ff";
          return <Chip label={params.value} sx={{ color, fontWeight: 500, background: "transparent" }} />;
        }
    }] : []),
    ...(userSettings.Actions ? [{
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem icon={<ArchiveIcon style={{ color: "#059669" }} />} label="Restore" onClick={() => handleRestore(params.row)} showInMenu />,
        ],
    }] : []),
  ];

  return (
    <div style={{ padding: "40px", width: "100%", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Archived Shipments</Typography>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: isDark ? "#1f2937" : "white",
          border: "2px solid #facc15",
          borderRadius: "30px",
          padding: "6px 14px",
          width: "380px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <SearchIcon style={{ color: "#999", marginRight: "8px" }} />
          <input
            type="text"
            placeholder="Search archived MMSI, BOL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "15px",
              flex: 1,
              color: isDark ? "#f9fafb" : "#333",
              background: "transparent",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {userSettings.status && (
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                minWidth: "150px",
                backgroundColor: isDark ? "#1f2937" : "white",
                color: isDark ? "#f9fafb" : "#000",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Docked">Docked</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          )}

          <ExportButtons 
            data={filteredShipments} 
            columns={columns.filter(c => c.field !== 'actions')} 
            fileName="Archived_Shipments" 
          />
        </div>
      </div>

      <div id="archived-table-main" 
           style={{ 
             borderRadius: "12px", 
             backgroundColor: isDark ? "#111827" : "white", 
             padding: "10px",
             boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
           }}>
        <DataGrid
          rows={filteredShipments}
          columns={columns}
          getRowId={(row) => `${row.mmsi}-${row.id}`}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
          autoHeight
          disableSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: isDark ? "#1f2937" : "#f9fafb",
              color: isDark ? "#f9fafb" : "#000",
              fontWeight: 600,
              fontSize: "15px",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
              color: isDark ? "#e5e7eb" : "#000",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e5e7eb",
            }
          }}
        />
      </div>
    </div>
  );
};

export default ArchivedShipments;