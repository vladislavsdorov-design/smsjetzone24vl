// import React, { useState, useEffect } from "react";
// import {
//   FiSend,
//   FiSmartphone,
//   FiWifi,
//   FiAlertCircle,
//   FiCheckCircle,
//   FiInfo,
//   FiRefreshCw,
// } from "react-icons/fi";
// import toast, { Toaster } from "react-hot-toast";
// import "./App.css";

// function App() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [message, setMessage] = useState("");
//   const [gatewayIp, setGatewayIp] = useState("192.168.1.12");
//   const [gatewayPort, setGatewayPort] = useState("8080");
//   const [isSending, setIsSending] = useState(false);
//   const [isTesting, setIsTesting] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const [showAdvanced, setShowAdvanced] = useState(false);

//   // Загружаем сохраненные настройки при запуске
//   useEffect(() => {
//     const savedIp = localStorage.getItem("gatewayIp");
//     const savedPort = localStorage.getItem("gatewayPort");
//     if (savedIp) setGatewayIp(savedIp);
//     if (savedPort) setGatewayPort(savedPort);
//   }, []);

//   // Сохраняем настройки при изменении
//   useEffect(() => {
//     localStorage.setItem("gatewayIp", gatewayIp);
//     localStorage.setItem("gatewayPort", gatewayPort);
//   }, [gatewayIp, gatewayPort]);

//   const addLog = (message, type = "info") => {
//     const timestamp = new Date().toLocaleTimeString();
//     setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 50));
//   };

//   const validatePhoneNumber = (number) => {
//     // Оставляем только цифры
//     const cleaned = number.replace(/\D/g, "");
//     return cleaned.length >= 10;
//   };

//   // Функция проверки соединения
//   const testConnection = async () => {
//     setIsTesting(true);
//     addLog("🔍 Проверка соединения...", "info");

//     try {
//       // Используем /health так как оно точно работает
//       const response = await fetch("/health", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.ok) {
//         const text = await response.text();
//         toast.success("✅ Соединение с телефоном работает!");
//         addLog("✅ Успех! Телефон отвечает на /health", "success");
//         addLog(`📱 Ответ: ${text.substring(0, 100)}`, "info");
//       } else {
//         toast.error("❌ Телефон не отвечает");
//         addLog("❌ Ошибка при проверке соединения", "error");
//       }
//     } catch (error) {
//       toast.error("❌ Нет соединения");
//       addLog("❌ Не удалось подключиться к телефону", "error");
//       addLog("💡 Проверьте:", "info");
//       addLog("   1. Телефон в той же Wi-Fi сети", "info");
//       addLog("   2. В приложении нажата кнопка СТАРТ", "info");
//       addLog(
//         "   3. IP адрес в настройках: " + gatewayIp + ":" + gatewayPort,
//         "info"
//       );
//     }
//     setIsTesting(false);
//   };

//   // Функция отправки SMS - ТОЧНО ПО ИНСТРУКЦИИ ИЗ ПРИЛОЖЕНИЯ
//   const sendSms = async () => {
//     // Очищаем номер от всего кроме цифр
//     const cleanNumber = phoneNumber.replace(/\D/g, "");

//     if (!validatePhoneNumber(cleanNumber)) {
//       toast.error("Введите корректный номер телефона (минимум 10 цифр)");
//       addLog("❌ Ошибка: некорректный номер", "error");
//       return;
//     }

//     if (!message.trim()) {
//       toast.error("Введите текст сообщения");
//       addLog("❌ Ошибка: пустое сообщение", "error");
//       return;
//     }

//     setIsSending(true);
//     addLog(`📤 Отправка SMS на номер ${cleanNumber}...`, "info");

//     // ТОЧНО КАК В ПРИЛОЖЕНИИ:
//     // POST: {"phone": "1234567890", "message": "Hello"}
//     const payload = {
//       phone: cleanNumber, // Только цифры, без +
//       message: message,
//     };

//     try {
//       const response = await fetch("/send-sms", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json", // ОБЯЗАТЕЛЬНО!
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.text();
//         toast.success("✅ SMS успешно отправлено!");
//         addLog(`✅ SMS отправлено!`, "success");
//         addLog(`📱 Ответ телефона: ${result || "OK"}`, "success");
//         setMessage(""); // Очищаем поле сообщения
//       } else {
//         const errorText = await response.text();
//         toast.error(`Ошибка ${response.status}`);
//         addLog(`❌ Ошибка: ${response.status}`, "error");
//         addLog(`📝 Детали: ${errorText}`, "error");

//         if (response.status === 400) {
//           addLog(
//             "💡 Подсказка: Номер должен быть только из цифр (без +, пробелов)",
//             "info"
//           );
//         }
//       }
//     } catch (error) {
//       toast.error("Ошибка соединения");
//       addLog(`❌ Ошибка: ${error.message}`, "error");
//       addLog("💡 Проверьте:", "info");
//       addLog("   1. Телефон в той же сети", "info");
//       addLog("   2. Сервер запущен (кнопка СТАРТ)", "info");
//       addLog("   3. IP адрес правильный", "info");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="app">
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: "#333",
//             color: "#fff",
//           },
//         }}
//       />

//       <div className="container">
//         {/* Шапка */}
//         <header className="header">
//           <div className="logo">
//             <FiSmartphone className="logo-icon" />
//             <h1>SMS Gateway</h1>
//           </div>
//           <div className="status-badge">
//             <FiWifi className="status-icon" />
//             <span>
//               {gatewayIp}:{gatewayPort}
//             </span>
//           </div>
//         </header>

//         {/* Информационное сообщение - ТОЧНО КАК В ПРИЛОЖЕНИИ */}
//         <div className="info-message">
//           <FiInfo className="info-icon" />
//           <div className="info-text">
//             <strong>📱 Simple SMS Gateway</strong>
//             <div
//               style={{
//                 marginTop: "8px",
//                 background: "#f0f0f0",
//                 padding: "10px",
//                 borderRadius: "5px",
//               }}
//             >
//               <code>POST /send-sms</code>
//               <pre style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
//                 {`{
//   "phone": "79001234567",
//   "message": "Hello"
// }`}
//               </pre>
//             </div>
//           </div>
//         </div>

//         {/* Основная форма */}
//         <div className="card">
//           <h2>📱 Отправка SMS</h2>

//           <div className="form-group">
//             <label>Номер телефона</label>
//             <input
//               type="tel"
//               className="input"
//               placeholder="79001234567"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               disabled={isSending}
//             />
//             <small className="hint">
//               Только цифры, без + и пробелов (например: 79001234567)
//             </small>
//           </div>

//           <div className="form-group">
//             <label>Текст сообщения</label>
//             <textarea
//               className="textarea"
//               placeholder="Введите текст SMS..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               disabled={isSending}
//               maxLength={500}
//             />
//             <div className="counter">
//               <span className={message.length > 160 ? "warning" : ""}>
//                 {message.length} / 500 символов
//               </span>
//               {message.length > 160 && (
//                 <span className="split-warning">
//                   ⚠️ будет разбито на {Math.ceil(message.length / 153)} SMS
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="button-group">
//             <button
//               className="btn btn-primary"
//               onClick={sendSms}
//               disabled={isSending || isTesting}
//             >
//               {isSending ? (
//                 <>⏳ Отправка...</>
//               ) : (
//                 <>
//                   <FiSend className="btn-icon" />
//                   Отправить SMS
//                 </>
//               )}
//             </button>

//             <button
//               className="btn btn-secondary"
//               onClick={testConnection}
//               disabled={isSending || isTesting}
//             >
//               {isTesting ? (
//                 <>⏳ Проверка...</>
//               ) : (
//                 <>
//                   <FiRefreshCw className="btn-icon" />
//                   Проверить
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Расширенные настройки */}
//         <div className="card">
//           <div
//             className="advanced-toggle"
//             onClick={() => setShowAdvanced(!showAdvanced)}
//           >
//             <span>⚙️ Расширенные настройки</span>
//             <span>{showAdvanced ? "▼" : "▶"}</span>
//           </div>

//           {showAdvanced && (
//             <div className="advanced-settings">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>IP адрес телефона</label>
//                   <input
//                     type="text"
//                     className="input"
//                     value={gatewayIp}
//                     onChange={(e) => setGatewayIp(e.target.value)}
//                     placeholder="192.168.1.12"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Порт</label>
//                   <input
//                     type="text"
//                     className="input"
//                     value={gatewayPort}
//                     onChange={(e) => setGatewayPort(e.target.value)}
//                     placeholder="8080"
//                   />
//                 </div>
//               </div>
//               <p className="note">
//                 💡 Эти настройки должны совпадать с тем, что показывает
//                 приложение на телефоне. IP может измениться при перезагрузке
//                 телефона или роутера.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Логи отправки */}
//         <div className="card">
//           <h3>📋 Журнал отправки</h3>
//           <div className="logs">
//             {logs.length === 0 ? (
//               <div className="empty-logs">
//                 <FiInfo size={24} />
//                 <p>Пока нет записей. Отправьте SMS чтобы увидеть логи.</p>
//               </div>
//             ) : (
//               logs.map((log, index) => (
//                 <div key={index} className={`log-entry log-${log.type}`}>
//                   <span className="log-time">{log.timestamp}</span>
//                   <span className="log-message">{log.message}</span>
//                   {log.type === "success" && (
//                     <FiCheckCircle className="log-icon success" />
//                   )}
//                   {log.type === "error" && (
//                     <FiAlertCircle className="log-icon error" />
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Инструкция */}
//         <div className="card">
//           <h3>📱 Инструкция (из приложения)</h3>
//           <div className="instructions">
//             <p>
//               <strong>1.</strong> Убедитесь, что телефон и компьютер в одной
//               Wi-Fi сети
//             </p>
//             <p>
//               <strong>2.</strong> В приложении на телефоне должна быть кнопка{" "}
//               <strong>СТАРТ</strong> (статус: Running)
//             </p>
//             <p>
//               <strong>3.</strong> Держите приложение открытым или свернутым (не
//               закрывайте)
//             </p>
//             <p>
//               <strong>4.</strong> Используйте формат номера только цифрами
//               (например: 79001234567)
//             </p>
//             <p>
//               <strong>5.</strong> Нажмите "Отправить SMS"
//             </p>
//           </div>
//           <div
//             className="note"
//             style={{ marginTop: "15px", background: "#e8f5e9" }}
//           >
//             <strong>✅ Правильный формат из приложения:</strong>
//             <pre style={{ margin: "5px 0 0 0" }}>
//               {`POST /send-sms
// Content-Type: application/json

// {
//   "phone": "79001234567",
//   "message": "Текст сообщения"
// }`}
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import { FiSmartphone, FiWifi, FiInfo, FiMail } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import BulkSmsSender from "./components/BulkSmsSender";
import QuickMessage from "./components/QuickMessage";
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
      <Toaster position="top-right" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <FiSmartphone className="logo-icon" />
            <h1>JetZone24 SMS Gateway</h1>
          </div>
          <div className="status-badge">
            <FiWifi className="status-icon" />
            <span>
              {gatewayIp}:{gatewayPort}
            </span>
          </div>
        </header>

        {/* Info o formacie */}
        <div className="info-message">
          <FiInfo className="info-icon" />
          <div>
            <strong>📱 Simple SMS Gateway</strong>
            <div style={{ fontSize: "0.9rem", marginTop: "5px" }}>
              Format:{" "}
              <code>{'{"phone": "500123456", "message": "Tekst"}'}</code>
            </div>
          </div>
        </div>

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
          <h3>📋 Dziennik wysyłki</h3>
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
