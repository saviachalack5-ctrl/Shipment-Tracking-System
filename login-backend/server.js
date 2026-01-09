import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();


app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase environment variables are not set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);


const authenticateRequest = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) return res.status(401).json({ message: "Missing authentication token" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) return res.status(401).json({ message: "Invalid or expired token" });

  req.user = data.user;
  next();
};


const requireAdmin = (req, res, next) => {
  const role = req.user?.user_metadata?.role;
  if (role !== "admin") return res.status(403).json({ message: "Admin privileges required" });
  next();
};


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.session || !data?.user)
    return res.status(401).json({ message: error?.message || "Invalid email or password" });

  const role = data.user.user_metadata?.role || "user";
  const name = data.user.user_metadata?.name || "";

  return res.json({
    message: "Login successful",
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at,
    user: {
      id: data.user.id,
      email: data.user.email,
      role,
      name,
    },
  });
});


app.get("/users", authenticateRequest, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return res.status(500).json({ message: error.message || "Unable to fetch users" });

  const users = (data?.users || []).map((user) => ({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || "",
    role: user.user_metadata?.role || "user",
    last_sign_in_at: user.last_sign_in_at,
  }));

  res.json({ users });
});

app.delete("/users/:id", authenticateRequest, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return res.status(400).json({ message: error.message || "Unable to delete user" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error deleting user" });
  }
});

app.post("/users", authenticateRequest, requireAdmin, async (req, res) => {
  const { email, password, role = "user", name = "" } = req.body || {};

  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, name },
    });

    if (error) return res.status(400).json({ message: error.message || "Unable to create user" });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || role,
        name: data.user.user_metadata?.name || name,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


app.get("/users/public", async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return res.status(500).json({ message: error.message || "Unable to fetch users" });

  const users = (data?.users || [])
    .filter((u) => u.user_metadata?.role !== "admin")
    .map((user) => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "",
      role: user.user_metadata?.role || "user",
    }));

  res.json({ users });
});


app.get("/settings/:userId", authenticateRequest, async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== userId && req.user.user_metadata.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("settings")
    .eq("user_id", userId)
    .single();

  const settings = data?.settings || {
    AddShipment: true,
    News: true,
    Report: true,
    Actions: true,
    EstimatedTime: true,
    status: true,
  };

  res.json({ settings });
});

app.post("/settings/:userId", authenticateRequest, async (req, res) => {
  const { userId } = req.params;
  const { settings } = req.body;

  if (!settings || typeof settings !== "object") {
    return res.status(400).json({ message: "Invalid settings" });
  }

  if (req.user.id !== userId && req.user.user_metadata.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, settings })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ message: "Settings updated", settings: data.settings });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
