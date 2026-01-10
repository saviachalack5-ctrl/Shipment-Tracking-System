import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 
import { API_BASE_URL } from "./config";


const ShipmentDialog = ({ open, onClose, onAdd, auth }) => {
  const [mmsi, setMmsi] = useState("");
  const [bol, setBol] = useState("");
  const [id, setId] = useState("");
  const [time, setTime] = useState("");

const handleAdd = async () => {
  // Validate
  if (!id || !mmsi || !bol || !time) {
    alert("All fields are required");
    return;
  }

  // Convert id to number (bigint)
  const newShipment = {
    id: Number(id),
    mmsi,
    bol,
    time, // must be YYYY-MM-DD
  };

  try {
    const res = await fetch(`${API_BASE_URL}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
      body: JSON.stringify(newShipment),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server returned error:", text);
      alert(`Failed to add shipment: ${text}`);
      return;
    }

    const data = await res.json();
    onAdd(data); // pass to parent
    setId(""); setMmsi(""); setBol(""); setTime("");
  } catch (err) {
    console.error("Failed to add shipment", err);
    alert("Failed to add shipment. Check console for details.");
  }
};



  return (
    <Dialog open={open} onClose={onClose}>
      <div className="add-shipment-dialog">
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New Shipment
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minWidth: 400 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ship MMSI
              </Typography>
              <TextField
                placeholder="Ship MMSI"
                value={mmsi}
                onChange={(e) => setMmsi(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: '55px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Bill of Lading (BOL)
              </Typography>
              <TextField
                placeholder="BOL"
                value={bol}
                onChange={(e) => setBol(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: '55px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ship ID
              </Typography>
              <TextField
                placeholder="Ship ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: '55px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Estimated Time
              </Typography>
              <TextField
                type="date"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: '55px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                  },
                }}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: "10px",
                backgroundColor: "#facc15",
                color: "#000",
                fontWeight: 600,
                padding: "12px",
                paddingBottom: "14px",
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#fbbf24" },
              }}
              onClick={handleAdd}
            >
              Add Shipment
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ShipmentDialog;
