import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_USER_ID = "b800b8a7-0239-4c6e-a2db-b9dc46afd9e8";

async function makeAdmin() {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(ADMIN_USER_ID, {
      user_metadata: { role: "admin" },
    });

    if (error) console.error("Error updating user:", error);
    else console.log("User updated successfully:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

makeAdmin();
