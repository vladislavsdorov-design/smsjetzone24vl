import React, { useState } from "react";
import { FiPlus, FiTrash2, FiClock, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

function PhoneListManager({ phones, onPhonesChange }) {
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("19:59");

  const addPhone = () => {
    const cleanNumber = newPhone.replace(/\D/g, "");

    if (!cleanNumber || cleanNumber.length < 9) {
      toast.error("Wprowadź poprawny numer telefonu");
      return;
    }

    const newEntry = {
      id: Date.now(),
      phone: cleanNumber,
      name: newName || "Klient",
      time: newTime,
      date: new Date().toISOString().split("T")[0], // Dzisiejsza data
    };

    onPhonesChange([...phones, newEntry]);
    setNewPhone("");
    setNewName("");
    toast.success("Dodano numer do listy");
  };

  const removePhone = (id) => {
    onPhonesChange(phones.filter((p) => p.id !== id));
    toast.success("Usunięto numer");
  };

  const updatePhoneTime = (id, newTime) => {
    onPhonesChange(
      phones.map((p) => (p.id === id ? { ...p, time: newTime } : p))
    );
  };

  return (
    <div className="card">
      <h3>📋 Lista numerów do wysyłki</h3>

      {/* Formularz dodawania */}
      <div className="phone-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Numer telefonu</label>
            <input
              type="tel"
              className="input"
              placeholder="500123456"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Imię/Nazwa</label>
            <input
              type="text"
              className="input"
              placeholder="Jan Kowalski"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Godzina lotu</label>
            <input
              type="time"
              className="input"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>

          <button
            className="btn-add"
            onClick={addPhone}
            style={{
              alignSelf: "flex-end",
              background: "#222",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            <FiPlus /> Dodaj
          </button>
        </div>
      </div>

      {/* Lista numerów */}
      <div className="phones-list">
        {phones.length === 0 ? (
          <div
            className="empty-list"
            style={{ textAlign: "center", padding: "2rem", color: "#999" }}
          >
            <p>📱 Brak numerów. Dodaj pierwszy numer!</p>
          </div>
        ) : (
          phones.map((phone) => (
            <div
              key={phone.id}
              className="phone-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                borderBottom: "1px solid #eee",
                background: "#fafafa",
                marginBottom: "0.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <FiUser style={{ color: "#666" }} />
              <div style={{ flex: 1 }}>
                <strong>{phone.name}</strong>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  📞 {phone.phone}
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FiClock style={{ color: "#666" }} />
                <input
                  type="time"
                  value={phone.time}
                  onChange={(e) => updatePhoneTime(phone.id, e.target.value)}
                  style={{
                    padding: "0.3rem",
                    border: "1px solid #ddd",
                    borderRadius: "0.3rem",
                    width: "100px",
                  }}
                />
              </div>

              <button
                onClick={() => removePhone(phone.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f44336",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>

      <div
        className="stats"
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "#f5f5f5",
          borderRadius: "0.5rem",
          fontSize: "0.9rem",
        }}
      >
        <strong>📊 Statystyki:</strong> {phones.length} numerów na liście
      </div>
    </div>
  );
}

export default PhoneListManager;
