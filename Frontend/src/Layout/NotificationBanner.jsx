import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, X, Zap } from "lucide-react";
import { getAuthToken } from "../lib/authStorage";
import { SITE_CONTENT } from "../content/siteContent";

const API = import.meta.env.DEV
  ? "http://127.0.0.1:5001"
  : import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

const NotificationBanner = () => {
  const [alert, setAlert] = useState(null);
  const [telemetryState, setTelemetryState] = useState("checking");
  const [isVisible, setIsVisible] = useState(true);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const syncSettings = () => {
      setEnabled(localStorage.getItem("notifications") !== "false");
    };
    syncSettings();
    window.addEventListener("settingsChange", syncSettings);
    return () => window.removeEventListener("settingsChange", syncSettings);
  }, []);

  useEffect(() => {
    if (!enabled) setAlert(null);

    const fetchTelemetryStatus = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const [clientResponse, predictionResponse] = await Promise.all([
          fetch(`${API}/client-system`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/predicted`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (clientResponse.status === 401) return;

        const clientData = await clientResponse.json();
        const telemetryActive = clientData.telemetry_active === true && Boolean(clientData.current);
        setTelemetryState(telemetryActive ? "active" : "inactive");
        if (!telemetryActive) {
          setAlert(null);
          return;
        }
        if (!enabled) {
          setAlert(null);
          return;
        }

        const predictionData = await predictionResponse.json();
        if (predictionData.status === "warming_up") {
          setAlert(null);
        } else if (predictionData.future_cpu > 80) {
          setAlert({ type: "critical", message: `Evaluation: projected CPU load is ${predictionData.future_cpu.toFixed(1)}%.`, icon: AlertTriangle });
        } else if (predictionData.future_cpu > 60) {
          setAlert({ type: "warning", message: `Evaluation: high resource load projected at ${predictionData.future_cpu.toFixed(1)}%.`, icon: Zap });
        } else {
          setAlert(null);
        }
      } catch {
        setTelemetryState("inactive");
        setAlert(null);
      }
    };

    fetchTelemetryStatus();
    const interval = setInterval(fetchTelemetryStatus, 5000);
    return () => clearInterval(interval);
  }, [enabled]);

  const downloadFiles = SITE_CONTENT.download.files;
  const showDownloadPrompt = telemetryState === "inactive" && isVisible;
  const showEvaluation = telemetryState === "active" && alert && isVisible;
  const AlertIcon = alert?.icon;

  return (
    <AnimatePresence>
      {showDownloadPrompt && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-5 right-5 z-[70] w-[min(420px,calc(100vw-2rem))] rounded-3xl bg-white p-6 text-background-dark shadow-2xl border border-black/10">
          <button type="button" onClick={() => setIsVisible(false)} className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-black" aria-label="Close telemetry agent prompt"><X size={18} /></button>
          <div className="flex items-start gap-4 pr-6">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700"><AlertTriangle size={22} /></div>
            <div>
              <h3 className="font-black text-lg">Telemetry agent is not active</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Start the agent and sign in so this dashboard can receive live system data.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {downloadFiles.map((file) => (
              <a key={file.os} href={`${API}/download/${file.filename}`} className="flex items-center justify-center gap-2 rounded-xl bg-background-dark px-3 py-3 text-xs font-black text-white hover:bg-black"><Download size={15} />{file.os}</a>
            ))}
          </div>
        </motion.div>
      )}
      {showEvaluation && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`relative z-30 px-10 py-3 flex items-center justify-between overflow-hidden ${alert.type === "critical" ? "bg-rose-500 text-white" : "bg-amber-500 text-black"}`}>
          <div className="flex items-center gap-4"><div className="rounded-lg bg-white/20 p-2">{AlertIcon && <AlertIcon size={18} />}</div><p className="text-[11px] font-black uppercase tracking-widest">{alert.message}</p></div>
          <button type="button" onClick={() => setIsVisible(false)} className="rounded-lg p-1.5 hover:bg-white/20" aria-label="Close evaluation alert"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
