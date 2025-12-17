import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log('jjjjj',username, password);
      const token = await login(username, password);
      
      localStorage.setItem("token", token);
      toast.success("Logged in successfully");
      navigate("/admin/products");
    } catch (err) {
      console.log('error', err.message);
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      toast.error(msg.includes("Unauthorized") ? "Invalid username or password" : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <div className="space-y-3 mb-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-destructive mb-3">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
