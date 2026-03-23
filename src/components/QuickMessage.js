import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

function QuickMessage({ gatewayIp, gatewayPort, addLog }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendQuickSms = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    if (!cleanNumber || cleanNumber.length < 9) {
      toast.error("Wprowadź poprawny numer telefonu");
      return;
    }

    if (!message.trim()) {
      toast.error("Wprowadź treść wiadomości");
      return;
    }

    setIsSending(true);
    addLog(`📤 Szybka wysyłka do ${cleanNumber}...`, "info");

    try {
      // POPRAWA: używamy gatewayPort z props, nie gateport
      const response = await fetch(
        `http://${gatewayIp}:${gatewayPort}/send-sms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: cleanNumber,
            message: message,
          }),
        }
      );

      if (response.ok) {
        toast.success("SMS wysłany!");
        addLog("✅ Wiadomość wysłana", "success");
        setMessage("");
        setPhoneNumber("");
      } else {
        throw new Error("Błąd wysyłki");
      }
    } catch (error) {
      toast.error("Błąd wysyłki");
      addLog(`❌ Błąd: ${error.message}`, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card">
      <h3>⚡ Szybka wysyłka</h3>

      <div className="form-group">
        <label>Numer telefonu</label>
        <input
          type="tel"
          className="input"
          placeholder="500123456"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isSending}
        />
      </div>

      <div className="form-group">
        <label>Wiadomość</label>
        <textarea
          className="textarea"
          placeholder="Treść SMS..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
          rows={4}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={sendQuickSms}
        disabled={isSending}
        style={{ width: "100%" }}
      >
        {isSending ? (
          "Wysyłanie..."
        ) : (
          <>
            <FiSend /> Wyślij SMS
          </>
        )}
      </button>
    </div>
  );
}

export default QuickMessage;
