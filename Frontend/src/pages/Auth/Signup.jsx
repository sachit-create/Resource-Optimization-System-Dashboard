import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { SITE_CONTENT } from "../../content/siteContent";
const API = import.meta.env.DEV ? "http://127.0.0.1:5001" : import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to sign up");
      }
      navigate("/login");
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
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 text-primary px-3 py-1 mb-3 text-[10px] font-black tracking-widest uppercase bg-primary/10 rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                {SITE_CONTENT.auth.signupTag}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight tracking-tight">
                {SITE_CONTENT.auth.signupTitle}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm font-medium">
                {SITE_CONTENT.auth.signupDescription}
              </p>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-foreground">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  className="w-full h-11 px-4 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none transition-all"
                  id="full-name"
                  placeholder="Enter Full name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="email">
                  Work Email
                </label>
                <input
                  className="w-full h-11 px-4 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none transition-all"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group/password">
                  <input
                    className="w-full h-11 px-4 pr-12 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none transition-all"
                    id="password"
                    placeholder="Min. 8 characters"
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
              <div className="flex items-center gap-3 py-1 ml-1">
                <input
                  className="size-4 mt-0.5 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label className="text-xs text-muted-foreground font-bold cursor-pointer leading-tight" htmlFor="terms">
                  I agree to the <Link className="text-primary hover:underline" to="#">Terms</Link> and <Link className="text-primary hover:underline" to="#">Privacy Policy</Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-foreground hover:opacity-90 text-background font-black rounded-xl shadow-xl shadow-black/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <>
                    <span>Create My Account</span>
                    <div className="bg-primary size-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
                    </div>
                  </>
                )}
              </button>
            </form>
            <div className="mt-5 text-center">
              <p className="text-muted-foreground font-bold text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Signup;
