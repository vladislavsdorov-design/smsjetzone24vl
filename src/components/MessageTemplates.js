import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

function MessageTemplates({ onSelectTemplate }) {
  const [copiedId, setCopiedId] = useState(null);

  // Szablony wiadomości
  const templates = [
    {
      id: 1,
      name: "📅 Przypomnienie o locie (JUTRO)",
      template: `[JETZONE24 - Przypomnienie o locie]

Szanowni Państwo,
zgodnie z przydziałem przypominamy o sesji symulatorowej:

📅 Data: {DATA}
🕑 Godzina rozpoczęcia sesji: {GODZINA}
📍 Briefing Room - JetZone24
Uczelnia Łazarskiego, ul. Świeradowska 43, Warszawa

⚠️ Lokalizacja - WAŻNE:
Pod wskazanym adresem znajdują się dwa obiekty.
Aby dotrzeć bezbłędnie, prosimy wpisać w nawigację: Uczelnia Łazarskiego.
Wejście A (pierwsze od lewej strony budynku), następnie wzdłuż restauracji i kawiarni - drzwi z logo JetZone24.

🛬 Prosimy o przybycie ok 10min przed planowaną godziną sesji.
W przypadku opóźnienia lub braku obecności - prosimy o niezwłoczny kontakt z naszym zespołem!

- JetZone24 | Profesjonalne Centrum symulatorów lotów`,
    },
    {
      id: 2,
      name: "📞 Lot poza godzinami (DZISIAJ)",
      template: `<Powiadomienie JetZone24>
Dzień dobry,
uprzejmie informujemy, że Państwa dzisiejszy lot w JetZone24 odbędzie się poza godzinami pracy recepcji. W tym czasie kontakt będzie możliwy bezpośrednio z instruktorem pod numerem: 790 330 043.
Jeżeli drzwi będą zamknięte, prosimy o chwilę cierpliwości – instruktor wyjdzie po Państwa po zakończeniu poprzedniej sesji.
Dziękujemy za wyrozumiałość i życzymy udanego lotu!
Zespół JetZone24

Pozdrawiam serdecznie`,
    },
    {
      id: 3,
      name: "✈️ Potwierdzenie rezerwacji",
      template: `[JETZONE24 - Potwierdzenie rezerwacji]

Dzień dobry {IMIE},
dziękujemy za rezerwację lotu w JetZone24!

📅 Data: {DATA}
🕑 Godzina: {GODZINA}
📍 Lokalizacja: Uczelnia Łazarskiego, ul. Świeradowska 43

W razie pytań prosimy o kontakt: 790 330 043

Do zobaczenia!
Zespół JetZone24`,
    },
  ];

  const processTemplate = (template, data) => {
    return template
      .replace("{DATA}", data.date || "")
      .replace("{GODZINA}", data.time || "")
      .replace("{IMIE}", data.name || "Kliencie");
  };

  const handleSelect = (template) => {
    onSelectTemplate(template);
    toast.success(`Wybrano szablon: ${template.name}`);
  };

  const copyToClipboard = (template) => {
    navigator.clipboard.writeText(template.template);
    setCopiedId(template.id);
    toast.success("Skopiowano do schowka!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card">
      <h3>📝 Szablony wiadomości</h3>

      <div
        className="templates-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-item"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "0.5rem",
              padding: "1rem",
              background: "#fff",
              transition: "all 0.2s",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <strong>{template.name}</strong>
              <button
                onClick={() => copyToClipboard(template)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copiedId === template.id ? "#4caf50" : "#666",
                }}
              >
                {copiedId === template.id ? <FiCheck /> : <FiCopy />}
              </button>
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                color: "#666",
                margin: "0.5rem 0",
                maxHeight: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {template.template.substring(0, 100)}...
            </p>

            <button
              className="btn-select"
              onClick={() => handleSelect(template)}
              style={{
                width: "100%",
                padding: "0.5rem",
                background: "#222",
                color: "white",
                border: "none",
                borderRadius: "0.3rem",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Wybierz szablon
            </button>
          </div>
        ))}
      </div>

      <div
        className="template-hint"
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "#e3f2fd",
          borderRadius: "0.5rem",
          fontSize: "0.9rem",
        }}
      >
        <strong>ℹ️ Zmienne w szablonach:</strong>
        <code style={{ marginLeft: "0.5rem" }}>{"{DATA}"}</code> - data lotu,
        <code style={{ marginLeft: "0.3rem" }}>{"{GODZINA}"}</code> - godzina
        lotu,
        <code style={{ marginLeft: "0.3rem" }}>{"{IMIE}"}</code> - imię klienta
      </div>
    </div>
  );
}

export default MessageTemplates;
