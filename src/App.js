// export default App;
import React, { useState, useEffect } from "react";
import { FiSmartphone, FiWifi, FiInfo, FiMail } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import BulkSmsSender from "./components/BulkSmsSender";
import QuickMessage from "./components/QuickMessage";
import FloatingParticles from "./components/FloatingParticles";
import "./App.css";

function App() {
  const [gatewayIp, setGatewayIp] = useState("192.168.1.155");
  const [gatewayPort, setGatewayPort] = useState("8080");
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("bulk"); // 'bulk' lub 'quick'

  // Load saved settings
  useEffect(() => {
    const savedIp = localStorage.getItem("gatewayIp");
    const savedPort = localStorage.getItem("gatewayPort");
    if (savedIp) setGatewayIp(savedIp);
    if (savedPort) setGatewayPort(savedPort);
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem("gatewayIp", gatewayIp);
    localStorage.setItem("gatewayPort", gatewayPort);
  }, [gatewayIp, gatewayPort]);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 50));
  };

  return (
    <div className="app">
      <FloatingParticles />
      <Toaster position="top-right" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <FiSmartphone className="logo-icon" />
            <img className="logojet" src="./logo.png"></img>
          </div>
          <div className="status-badge">
            <FiWifi className="status-icon" />
            <span>
              {gatewayIp}:{gatewayPort}
            </span>
          </div>
        </header>

        {/* Info o formacie */}
        {/* <div className="info-message">
          <FiInfo className="info-icon" />
          <div>
            <strong>📱 Simple SMS Gateway</strong>
            <div style={{ fontSize: "0.9rem", marginTop: "5px" }}>
              Format:{" "}
              <code>{'{"phone": "500123456", "message": "Tekst"}'}</code>
            </div>
          </div>
        </div> */}

        {/* Tabs */}
        <div
          className="tabs"
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <button
            className={`tab ${activeTab === "bulk" ? "active" : ""}`}
            onClick={() => setActiveTab("bulk")}
            style={{
              flex: 1,
              padding: "1rem",
              background: activeTab === "bulk" ? "#222" : "#f5f5f5",
              color: activeTab === "bulk" ? "white" : "#333",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <FiMail /> Masowa wysyłka
          </button>

          <button
            className={`tab ${activeTab === "quick" ? "active" : ""}`}
            onClick={() => setActiveTab("quick")}
            style={{
              flex: 1,
              padding: "1rem",
              background: activeTab === "quick" ? "#222" : "#f5f5f5",
              color: activeTab === "quick" ? "white" : "#333",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <FiSmartphone /> Szybka wysyłka
          </button>
        </div>

        {/* Content based on tab */}
        {activeTab === "bulk" ? (
          <BulkSmsSender
            gatewayIp={gatewayIp}
            gatewayPort={gatewayPort}
            addLog={addLog}
          />
        ) : (
          <QuickMessage
            gatewayIp={gatewayIp}
            gatewayPort={gatewayPort}
            addLog={addLog}
          />
        )}

        {/* Logs */}
        <div className="card">
          <h3>
            <i
              className="fa-solid fa-chart-simple"
              style={{ color: "rgb(0, 0, 0)" }}
            ></i>{" "}
            Dziennik wysyłki
          </h3>
          <div className="logs">
            {logs.length === 0 ? (
              <div className="empty-logs">
                <p>Brak logów. Rozpocznij wysyłkę.</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry log-${log.type}`}>
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
