import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddUsers = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.(formData);
      onClose?.();
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (error) {
      alert(error.message || "Unable to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <div className="add-user-dialog">
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New User
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
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
               InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
                  },
                  },
                }}

                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
                  },
                  },
                }}

                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              variant="outlined"
              onChange={handleChange}
              fullWidth
             InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
                  },
                  },
                }}

                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <TextField
              name="role"
              label="Role"
              value={formData.role}
              variant="outlined"
              onChange={handleChange}
              fullWidth
            InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
                  },
                  },
                }}

                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#facc15",
                height: "50px",
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#fbbf24" },
              }}
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default AddUsers;
