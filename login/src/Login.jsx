import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { API_BASE_URL } from "./config";

const Login = ({ error, setError, onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to login");
      }

      onLogin?.(data);
      navigate("/shipments");
    } catch (err) {
      setError(err.message || "Incorrect email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
      </div>
      <div className="login-right">
        <div className="login-container">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Sign in to your account</p>

          

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="material-symbols-rounded">mail</i>
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="material-symbols-rounded">lock</i>
            </div>
            
            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
