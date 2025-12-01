import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Button, MenuItem, Select, Chip,  Typography } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExportButtons from "./ExportButtons";
import { shipments } from "./ShipmentData";
import ShipmentDialog from "./ShipmentDialog";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "./config";

const Shipments = ({ toggleTheme, mode }) => {
  const { auth } = useAuth();

  const [shipmentList, setShipmentList] = useState([]);
  const [archivedShipments, setArchivedShipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  

  const isDark = mode === "dark";

  const handleOpenDialog = () => setOpenAddDialog(true);
  const handleCloseDialog = () => setOpenAddDialog(false);


  useEffect(() => {
    const loadSettings = async () => {
      setLoadingSettings(true);
      try {
        const saved = localStorage.getItem(`user_components_${auth.user.id}`);
        if (saved) {
          setUserSettings(JSON.parse(saved));
        } else {
          const res = await fetch(`${API_BASE_URL}/settings/${auth.user.id}`, {
            headers: { Authorization: `Bearer ${auth.access_token}` },
          });
          const data = await res.json();
          setUserSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
        setUserSettings({
          AddShipment: true,
          Actions: true,
          EstimatedTime: true,
          status: true,
        });
      } finally {
        setLoadingSettings(false);
      }
    };
    loadSettings();
  }, [auth]);

useEffect(() => {
 
  const storedShipments = JSON.parse(localStorage.getItem("shipments") || "[]");
  const merged = [...shipments];

  storedShipments.forEach((s) => {
    if (!merged.some((m) => m.id === s.id)) {
      merged.push(s);
    }
  });

  setShipmentList(merged);
  localStorage.setItem("shipments", JSON.stringify(merged));
}, []);


const handleArchive = (row) => {
  setShipmentList((prev) => prev.filter((s) => s.id !== row.id));


  const archived = JSON.parse(localStorage.getItem("archivedShipments") || "[]");
  const updatedArchived = [...archived, row];
  localStorage.setItem("archivedShipments", JSON.stringify(updatedArchived));
};



  const getStatus = (deliveryTime) => {
    if (!deliveryTime) return "Pending";
    const today = new Date();
    const deliveryDate = new Date(deliveryTime);
    today.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);
    if (deliveryDate.toDateString() === today.toDateString()) return "Docked";
    if (deliveryDate < today) return "Overdue";
    if (deliveryDate > today) return "In Transit";
    return "Pending";
  };

  const shipmentsWithStatus = shipmentList.map((s) => ({
    ...s,
    status: getStatus(s.time),
  }));

  const q = searchQuery.toLowerCase();
 const filteredShipments = shipmentsWithStatus.filter((s) => {
  const matchesSearch =
    String(s.id || "").toLowerCase().includes(q) ||
    String(s.time || "").toLowerCase().includes(q) ||
    String(s.mmsi || "").toLowerCase().includes(q) ||
    String(s.bol || "").toLowerCase().includes(q);

  const matchesStatus =
    statusFilter === "All Status" || s.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  if (loadingSettings || !userSettings) {
    return (
      <div
        style={{
          paddingTop: "20px",
          paddingLeft: "20px",
          maxWidth: "1300px",
          marginInline: "auto",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
            Shipments Overview
        </Typography>
        <p style={{ color: "#888" }}>Loading shipments...</p>
      </div>
    );
  }

  const columns = [
    { field: "mmsi", headerName: "Ship MMSI", width: 200 },
    { field: "bol", headerName: "Ship BOL", width: 220 },
    { field: "id", headerName: "Ship ID", width: 180 },
    ...(userSettings.EstimatedTime
      ? [
          {
            field: "time",
            headerName: "Estimated Time",
            width: 200,
          },
        ]
      : []),
    ...(userSettings.status
      ? [
          {
            field: "status",
            headerName: "Status",
            width: 180,
            renderCell: (params) => {
              const status = params.value;
              let color = "";
              switch (status) {
                case "In Transit":
                  color = "#2563eb";
                  break;
                case "Overdue":
                  color = "#d20000ff";
                  break;
                case "Docked":
                  color = "#05a334ff";
                  break;
                case "Pending":
                  color = "#6b7280";
                  break;
                default:
                  color = "#6b7280";
              }
              return (
                <Chip
                  label={status}
                  sx={{
                    color,
                    fontWeight: 500,
                    background: "transparent",
                  }}
                />
              );
            },
          },
        ]
      : []),
    ...(userSettings.Actions
      ? [
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 80,
            getActions: (params) => [
              <GridActionsCellItem
                icon={<ArchiveIcon style={{ color: "#d97706" }} />}
                label="Archive"
                onClick={() => handleArchive(params.row)}
                showInMenu
              />,
            ],
          },
        ]
      : []),
  ];

  const shipmentColumns = [
    { label: "Ship MMSI", field: "mmsi" },
    { label: "Ship BOL", field: "bol" },
    { label: "Ship ID", field: "id" },
    ...(userSettings.EstimatedTime
      ? [{ label: "Estimated Time", field: "time" }]
      : []),
    ...(userSettings.status ? [{ label: "Status", field: "status" }] : []),
  ];

  return (
    <div
      style={{
        paddingTop: "40px",
        paddingLeft: "40px",
        maxWidth: "1300px",
        marginInline: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Shipments Overview
      </Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: isDark ? "#1f2937" : "white",
            border: "2px solid #facc15",
            borderRadius: "30px",
            padding: "6px 14px",
            width: "380px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <SearchIcon style={{ color: "#999", marginRight: "8px" }} />
          <input
            type="text"
            placeholder="Search by MMSI, BOL, or Ship ID..."
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
          {userSettings.status && userSettings.EstimatedTime &&(
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              fontWeight: 500,
              fontSize: "14px",
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
            columns={shipmentColumns}
            fileName="Shipments"
            exportTargetId="shipment-table"
          />
        </div>

        {userSettings.AddShipment && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#facc15",
              color: "#000",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              padding: "10px 18px",
              "&:hover": { backgroundColor: "#fbbf24" },
            }}
            onClick={handleOpenDialog}
          >
            Add New Shipment
          </Button>
        )}
      </div>

        <div
          id="shipment-table"
          style={{
            borderRadius: "12px",
            backgroundColor: isDark ? "#111827" : "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "10px",
          }}
        >
        <DataGrid
          rows={filteredShipments}
          columns={columns}
          getRowId={(row) => `${row.mmsi}-${row.id}`}
          pageSize={10}
          autoHeight
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
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
          }}
        />
      </div>

      <ShipmentDialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        onAdd={(newShipment) => {
          if (!newShipment) return;
          setShipmentList((prev) => {
            const updated = [...prev, newShipment];
            localStorage.setItem("shipments", JSON.stringify(updated));
            return updated;
          });
          handleCloseDialog();
        }}
      />

    </div>
  );
};

export default Shipments;
