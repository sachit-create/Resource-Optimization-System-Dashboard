import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { saveAuthSession } from "../../lib/authStorage";
import { SITE_CONTENT } from "../../content/siteContent";
const API = import.meta.env.DEV ? "http://127.0.0.1:5001" : import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server Error (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to login");
      }
      saveAuthSession(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <Navbar />
      <main className="min-h-0 flex-1 flex items-center justify-center px-4 pt-20 pb-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,103,255,0.12)_0%,transparent_65%)] pointer-events-none"></div>
        <div className="w-full max-w-md z-10">
          <div className="bg-card text-card-foreground rounded-3xl shadow-2xl overflow-hidden border border-border p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-primary px-3 py-1 mb-3 text-[10px] font-black tracking-widest uppercase bg-primary/10 rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                {SITE_CONTENT.auth.loginTag}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight tracking-tight">
                {SITE_CONTENT.auth.loginTitle}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm font-medium">
                {SITE_CONTENT.auth.loginDescription}
              </p>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-5 text-xs font-bold flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="w-full h-12 px-4 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none transition-all"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40" htmlFor="password">
                    Password
                  </label>
                  <Link to="#" className="text-xs font-black text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group/password">
                  <input
                    className="w-full h-12 px-4 pr-12 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none transition-all"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Your session is kept only for this browser tab.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-foreground hover:opacity-90 text-background font-black rounded-xl shadow-xl shadow-black/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <div className="bg-primary size-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
                    </div>
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground font-bold text-sm">
                New to {SITE_CONTENT.brand.name}?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Join for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;
