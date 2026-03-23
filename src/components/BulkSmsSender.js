import React, { useState } from "react";
import { FiSend, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import PhoneListManager from "./PhoneListManager";
import MessageTemplates from "./MessageTemplates";
import ScheduleManager from "./ScheduleManager";

function BulkSmsSender({ gatewayIp, gatewayPort, addLog }) {
  const [phones, setPhones] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [sendDate, setSendDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [useProxy, setUseProxy] = useState(true); // Domyślnie używamy proxy

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomMessage(template.template);
  };

  const generateMessageForPhone = (phone) => {
    if (!selectedTemplate) return customMessage;

    return selectedTemplate.template
      .replace("{DATA}", sendDate)
      .replace("{GODZINA}", phone.time || "19:59")
      .replace("{IMIE}", phone.name || "Kliencie");
  };

  const sendBulkSms = async () => {
    if (phones.length === 0) {
      toast.error("Dodaj przynajmniej jeden numer telefonu");
      return;
    }

    if (!customMessage && !selectedTemplate) {
      toast.error("Wybierz szablon lub wpisz własną wiadomość");
      return;
    }

    setIsSending(true);
    setProgress({ current: 0, total: phones.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < phones.length; i++) {
      const phone = phones[i];
      const message = generateMessageForPhone(phone);

      setProgress({ current: i + 1, total: phones.length });
      addLog(`📤 Wysyłka do ${phone.name} (${phone.phone})...`, "info");

      try {
        // Wybór URL w zależności od ustawienia proxy
        let url;
        if (useProxy) {
          // Przez proxy Reacta (nie ma CORS)
          url = "/send-sms";
        } else {
          // Bezpośrednio na telefon (wymaga CORS)
          url = `http://${gatewayIp}:${gatewayPort}/send-sms`;
        }

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone.phone,
            message: message,
          }),
        });

        if (response.ok) {
          successCount++;
          addLog(`✅ Wysłano do ${phone.name}`, "success");
        } else {
          failCount++;
          const errorText = await response.text();
          addLog(`❌ Błąd dla ${phone.name}: ${response.status}`, "error");
        }

        // Małe opóźnienie między wysyłkami
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        failCount++;
        addLog(`❌ Błąd: ${error.message}`, "error");

        // Jeśli błąd CORS, sugerujemy włączenie proxy
        if (
          error.message.includes("CORS") ||
          error.message.includes("Failed to fetch")
        ) {
          addLog('💡 Włącz opcję "Użyj proxy" w ustawieniach', "info");
        }
      }
    }

    toast.success(
      `Wysyłka zakończona! ✅ ${successCount} sukcesów, ❌ ${failCount} błędów`
    );
    addLog(
      `📊 Podsumowanie: ${successCount}/${phones.length} wysłanych`,
      "info"
    );
    setIsSending(false);
  };

  const scheduleBulkSms = (scheduleTime) => {
    if (phones.length === 0) {
      toast.error("Dodaj przynajmniej jeden numer");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      date: sendDate,
      time: scheduleTime,
      phones: [...phones],
      template: selectedTemplate,
      message: customMessage,
      status: "scheduled",
    };

    setScheduledMessages([...scheduledMessages, newSchedule]);
    toast.success(`Zaplanowano wysyłkę na ${scheduleTime}`);
    addLog(
      `📅 Zaplanowano wysyłkę na ${sendDate} o ${scheduleTime}`,
      "success"
    );
  };

  return (
    <div className="bulk-sms-container">
      <h2>📨 Masowa wysyłka SMS</h2>

      {/* Opcja CORS/Proxy */}
      <div className="card" style={{ background: "#fff3e0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
            />
            <strong>Użyj proxy (rozwiązuje problem CORS)</strong>
          </label>
          <small style={{ color: "#666" }}>
            {useProxy
              ? "✅ Proxy włączone - wysyłka przez localhost:3000"
              : "⚠️ Proxy wyłączone - wymaga rozszerzenia CORS w Chrome"}
          </small>
        </div>
      </div>

      {/* Data wysyłki */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiCalendar />
            <strong>Data lotu:</strong>
          </div>
          <input
            type="date"
            value={sendDate}
            onChange={(e) => setSendDate(e.target.value)}
            className="input"
            style={{ width: "200px" }}
          />
          <small className="hint">(automatycznie ustawiona na jutro)</small>
        </div>
      </div>

      {/* Zarządzanie numerami */}
      <PhoneListManager phones={phones} onPhonesChange={setPhones} />

      {/* Szablony wiadomości */}
      <MessageTemplates onSelectTemplate={handleTemplateSelect} />

      {/* Własna wiadomość */}
      <div className="card">
        <h3>✏️ Własna wiadomość</h3>
        <textarea
          className="textarea"
          placeholder="Wpisz własną wiadomość lub edytuj wybrany szablon..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={10}
          style={{ fontFamily: "monospace", fontSize: "14px" }}
        />
        <div className="counter">
          <span>{customMessage.length} / 500 znaków</span>
          {customMessage.length > 160 && (
            <span className="split-warning">
              ⚠️ {Math.ceil(customMessage.length / 153)} SMS
            </span>
          )}
        </div>
      </div>

      {/* Planowanie wysyłki */}
      <ScheduleManager
        onSchedule={scheduleBulkSms}
        scheduledMessages={scheduledMessages}
        onSendNow={sendBulkSms}
        isSending={isSending}
        phonesCount={phones.length}
      />

      {/* Przycisk wysyłki */}
      <div className="card" style={{ background: "#f8f9fa" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <FiUsers /> <strong>{phones.length} numerów do wysyłki</strong>
          </div>

          <button
            className="btn btn-primary"
            onClick={sendBulkSms}
            disabled={isSending || phones.length === 0}
            style={{ minWidth: "200px" }}
          >
            {isSending ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <span>
                  Wysyłanie {progress.current}/{progress.total}
                </span>
                <div
                  className="spinner"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #f3f3f3",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            ) : (
              <>
                <FiSend /> Wyślij teraz
              </>
            )}
          </button>
        </div>

        {isSending && (
          <div
            className="progress-bar"
            style={{
              marginTop: "1rem",
              height: "4px",
              background: "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
                height: "100%",
                background: "#222",
                transition: "width 0.3s",
              }}
            />
          </div>
        )}
      </div>

      {/* Instrukcja CORS */}
      {!useProxy && (
        <div className="card" style={{ background: "#ffebee" }}>
          <h4 style={{ color: "#f44336", margin: "0 0 0.5rem 0" }}>
            ⚠️ Problem z CORS
          </h4>
          <p>Masz wyłączone proxy. Aby wysyłki działały:</p>
          <ol style={{ margin: "0.5rem 0 0 1.5rem" }}>
            <li>
              Zainstaluj rozszerzenie <strong>Moesif CORS</strong> w Chrome
            </li>
            <li>Włącz rozszerzenie (kliknij ikonkę, powinna być zielona)</li>
            <li>Odśwież stronę</li>
            <li>Lub włącz opcję "Użyj proxy" powyżej</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default BulkSmsSender;
