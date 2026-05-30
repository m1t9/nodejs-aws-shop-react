import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Navigate, useNavigate } from "react-router-dom";
import PaperLayout from "~/components/PaperLayout/PaperLayout";
import { isLoggedIn, setAuthToken } from "~/utils/auth";

export default function PageLogin() {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  if (isLoggedIn()) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!login.trim() || !password.trim()) {
      setError("Login and password are required");
      return;
    }

    const token = btoa(`${login}:${password}`);
    setAuthToken(token);
    navigate("/admin/products", { replace: true });
  };

  return (
    <PaperLayout>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Login"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
            if (error) setError("");
          }}
          error={Boolean(error)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          error={Boolean(error)}
          helperText={error}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </PaperLayout>
  );
}
