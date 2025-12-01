import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_USER_ID = "dd5308bd-2099-45f0-939a-3b8a1c52b964";

async function makeAdmin() {
  try {
    const { data, error } = await supabase.admin.updateUserById(ADMIN_USER_ID, {
      user_metadata: { role: "admin" },
    });

    if (error) console.error("Error updating user:", error);
    else console.log("User updated successfully:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

makeAdmin();
