import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import ExportButtons from "./ExportButtons";
import { useAuth } from "./AuthContext";
import {Typography } from "@mui/material";


const ArchivedShipments = ({ mode, userSettings }) => {
  const [shipmentList, setShipmentList] = useState([]);
  const { auth } = useAuth();
const [loadingSettings, setLoadingSettings] = useState(true);

useEffect(() => {
  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const saved = localStorage.getItem(`user_components_${auth.user.id}`);
      if (saved) setUserSettings(JSON.parse(saved));
      else {
        const res = await fetch(`${API_BASE_URL}/settings/${auth.user.id}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        const data = await res.json();
        setUserSettings(data.settings);
      }
    } catch {
      setUserSettings({ AddShipment: true, Actions: true, EstimatedTime: true, status: true });
    } finally {
      setLoadingSettings(false);
    }
  };
  loadSettings();
}, [auth]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("archivedShipments") || "[]");
    setShipmentList(stored);
  }, []);

  const isDark = mode === "dark";

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

  const handleArchive = (row) => {
  setShipmentList((prev) => {
    const updated = prev.filter((s) => s.id !== row.id);
    localStorage.setItem("shipments", JSON.stringify(updated)); 
    return updated;
  });


  const archived = JSON.parse(localStorage.getItem("archivedShipments") || "[]");
  const updatedArchived = [...archived, row];
  localStorage.setItem("archivedShipments", JSON.stringify(updatedArchived));
};


const handleRestore = (row) => {
  // 1️⃣ Remove from archivedShipments
  const updatedArchived = JSON.parse(localStorage.getItem("archivedShipments") || "[]")
    .filter(s => `${s.mmsi}-${s.id}` !== `${row.mmsi}-${row.id}`);
  localStorage.setItem("archivedShipments", JSON.stringify(updatedArchived));


  const currentShipments = JSON.parse(localStorage.getItem("shipments") || "[]");
  const updatedShipments = [...currentShipments, row];
  localStorage.setItem("shipments", JSON.stringify(updatedShipments));

  setShipmentList(updatedArchived); 
};

  const columns = [
    { field: "mmsi", headerName: "Ship MMSI", width: 200 },
    { field: "bol", headerName: "Ship BOL", width: 220 },
    { field: "id", headerName: "Ship ID", width: 180 },
    { field: "time", headerName: "Estimated Time", width: 200 },
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
        return <Chip label={status} sx={{ color, fontWeight: 500, background: "transparent" }} />;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ArchiveIcon style={{ color: "#059669" }} />}
          label="Restore"
          onClick={() => handleRestore(params.row)}
          showInMenu
        />,
      ],
    },
  ];

  const shipmentColumns = [
    { label: "Ship MMSI", field: "mmsi" },
    { label: "Ship BOL", field: "bol" },
    { label: "Ship ID", field: "id" },
    { label: "Estimated Time", field: "time" },
    { label: "Status", field: "status" },
  ];

  return (
    <div style={{ paddingTop: "20px", paddingLeft: "20px", marginInline: "auto", height: "80vh", width: "100%", }}>
      <Typography variant="h4" sx={{ mb: .5}}>
        Archived Shipments
      </Typography>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <ExportButtons
          data={shipmentList}
          columns={shipmentColumns}
          fileName="ArchivedShipments"
          exportTargetId="archived-shipment-table"
        />
      </div>
      <div
        id="archived-shipment-table"
        style={{ height: 500, borderRadius: "12px", overflow: "hidden", backgroundColor: isDark ? "#111827" : "white", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      >
        <DataGrid
          rows={shipmentsWithStatus}
          columns={columns}
          getRowId={(row) => `${row.mmsi}-${row.id}`}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            "& .MuiDataGrid-columnHeaders": { backgroundColor: isDark ? "#1f2937" : "#f9fafb", color: isDark ? "#f9fafb" : "#000", fontWeight: 600, fontSize: "15px" },
            "& .MuiDataGrid-cell": { fontSize: "14px", color: isDark ? "#e5e7eb" : "#000" },
          }}
        />
      </div>
    </div>
  );
};

export default ArchivedShipments;
