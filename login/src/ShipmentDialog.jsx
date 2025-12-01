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


const ShipmentDialog = ({ open, onClose, onAdd }) => {
  const [mmsi, setMmsi] = useState("");
  const [bol, setBol] = useState("");
  const [id, setId] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = () => {
    if (!id || !mmsi || !bol || !time) {
      alert("Please fill all fields");
      return;
    }

    const newShipment = { id, mmsi, bol, time };
    onAdd(newShipment); 
    onClose(); 
    setMmsi("");
    setBol("");
    setId("");
    setTime("");
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
