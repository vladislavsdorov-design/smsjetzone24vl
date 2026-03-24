// import React, { useState } from "react";
// import {
//   FiClock,
//   FiCalendar,
//   FiSend,
//   FiTrash2,
//   FiCheckCircle,
//   FiXCircle,
// } from "react-icons/fi";
// import toast from "react-hot-toast";

// function ScheduleManager({
//   onSchedule,
//   scheduledMessages,
//   onSendNow,
//   isSending,
//   phonesCount,
// }) {
//   const [scheduleTime, setScheduleTime] = useState("09:00");
//   const [showScheduled, setShowScheduled] = useState(false);

//   const handleSchedule = () => {
//     if (phonesCount === 0) {
//       toast.error("Dodaj numery do wysyłki");
//       return;
//     }
//     onSchedule(scheduleTime);
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "scheduled":
//         return <FiClock style={{ color: "#f57c00" }} />;
//       case "sending":
//         return <div className="spinner-small" />;
//       case "sent":
//         return <FiCheckCircle style={{ color: "#4caf50" }} />;
//       case "failed":
//         return <FiXCircle style={{ color: "#f44336" }} />;
//       default:
//         return null;
//     }
//   };

//   const formatDateTime = (date, time) => {
//     return `${date} ${time}`;
//   };

//   return (
//     <div className="card">
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "1rem",
//         }}
//       >
//         <h3 style={{ margin: 0 }}>⏰ Planowanie wysyłki</h3>
//         <button
//           onClick={() => setShowScheduled(!showScheduled)}
//           style={{
//             background: "none",
//             border: "1px solid #ddd",
//             padding: "0.3rem 1rem",
//             borderRadius: "1rem",
//             cursor: "pointer",
//             fontSize: "0.9rem",
//           }}
//         >
//           {showScheduled ? "▼ Ukryj zaplanowane" : "▶ Pokaż zaplanowane"}
//         </button>
//       </div>

//       {/* Panel planowania */}
//       <div
//         className="schedule-panel"
//         style={{
//           display: "flex",
//           gap: "1rem",
//           alignItems: "flex-end",
//           flexWrap: "wrap",
//           background: "#f5f5f5",
//           padding: "1rem",
//           borderRadius: "0.5rem",
//         }}
//       >
//         <div
//           className="form-group"
//           style={{ flex: 1, minWidth: "150px", marginBottom: 0 }}
//         >
//           <label>Godzina wysyłki</label>
//           <input
//             type="time"
//             className="input"
//             value={scheduleTime}
//             onChange={(e) => setScheduleTime(e.target.value)}
//             style={{ background: "white" }}
//           />
//         </div>

//         <button
//           className="btn btn-secondary"
//           onClick={handleSchedule}
//           disabled={isSending || phonesCount === 0}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "0.5rem",
//             background: "#666",
//             color: "white",
//           }}
//         >
//           <FiCalendar /> Zaplanuj
//         </button>

//         <button
//           className="btn btn-primary"
//           onClick={onSendNow}
//           disabled={isSending || phonesCount === 0}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "0.5rem",
//           }}
//         >
//           <FiSend /> Wyślij teraz
//         </button>
//       </div>

//       {/* Lista zaplanowanych wysyłek */}
//       {showScheduled && (
//         <div className="scheduled-list" style={{ marginTop: "1rem" }}>
//           <h4>Zaplanowane wysyłki</h4>
//           {scheduledMessages.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "2rem",
//                 color: "#999",
//                 background: "#fafafa",
//                 borderRadius: "0.5rem",
//               }}
//             >
//               <p>📅 Brak zaplanowanych wysyłek</p>
//             </div>
//           ) : (
//             scheduledMessages.map((item) => (
//               <div
//                 key={item.id}
//                 className="scheduled-item"
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "1rem",
//                   padding: "0.75rem",
//                   background: "#fff",
//                   border: "1px solid #eee",
//                   borderRadius: "0.5rem",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {getStatusIcon(item.status)}

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: "bold" }}>
//                     {formatDateTime(item.date, item.time)}
//                   </div>
//                   <div style={{ fontSize: "0.9rem", color: "#666" }}>
//                     {item.phones.length} numerów •{" "}
//                     {item.template?.name || "Własna wiadomość"}
//                   </div>
//                 </div>

//                 {item.status === "scheduled" && (
//                   <button
//                     onClick={() => {
//                       // Tu można dodać funkcję anulowania
//                       toast.success("Wysyłka anulowana");
//                     }}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       color: "#f44336",
//                       cursor: "pointer",
//                       padding: "0.5rem",
//                     }}
//                   >
//                     <FiTrash2 />
//                   </button>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       <div
//         className="schedule-info"
//         style={{
//           marginTop: "1rem",
//           padding: "0.5rem",
//           background: "#e3f2fd",
//           borderRadius: "0.3rem",
//           fontSize: "0.9rem",
//         }}
//       >
//         <strong>ℹ️ Info:</strong> Zaplanowane wysyłki będą realizowane
//         automatycznie o wybranej godzinie. Aplikacja musi być włączona.
//       </div>
//     </div>
//   );
// }

// export default ScheduleManager;
import React, { useState } from "react";
import {
  FiClock,
  FiCalendar,
  FiSend,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiCalendar as FiCalendarIcon,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";

function ScheduleManager({
  onSchedule,
  scheduledMessages,
  onSendNow,
  isSending,
  phonesCount,
}) {
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [showScheduled, setShowScheduled] = useState(false);

  const handleSchedule = () => {
    if (phonesCount === 0) {
      toast.error("Dodaj numery do wysyłki");
      return;
    }
    onSchedule(scheduleTime);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <FiClock style={{ color: "#f57c00" }} />;
      case "sending":
        return <div className="spinner-small" />;
      case "sent":
        return <FiCheckCircle style={{ color: "#4caf50" }} />;
      case "failed":
        return <FiXCircle style={{ color: "#f44336" }} />;
      default:
        return null;
    }
  };

  const formatDateTime = (date, time) => {
    return `${date} ${time}`;
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ margin: 0 }}>
          <FiClock style={{ marginRight: "0.5rem" }} /> Planowanie wysyłki
        </h3>
        <button
          onClick={() => setShowScheduled(!showScheduled)}
          style={{
            background: "none",
            border: "1px solid #ddd",
            padding: "0.3rem 1rem",
            borderRadius: "1rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          {showScheduled ? (
            <>
              <FiChevronDown /> Ukryj zaplanowane
            </>
          ) : (
            <>
              <FiChevronRight /> Pokaż zaplanowane
            </>
          )}
        </button>
      </div>

      {/* Panel planowania */}
      <div
        className="schedule-panel"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
          flexWrap: "wrap",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        <div
          className="form-group"
          style={{ flex: 1, minWidth: "150px", marginBottom: 0 }}
        >
          <label>Godzina wysyłki</label>
          <input
            type="time"
            className="input"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            style={{ background: "white" }}
          />
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleSchedule}
          disabled={isSending || phonesCount === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#666",
            color: "white",
          }}
        >
          <FiCalendar /> Zaplanuj
        </button>

        <button
          className="btn btn-primary"
          onClick={onSendNow}
          disabled={isSending || phonesCount === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FiSend /> Wyślij teraz
        </button>
      </div>

      {/* Lista zaplanowanych wysyłek */}
      {showScheduled && (
        <div className="scheduled-list" style={{ marginTop: "1rem" }}>
          <h4>Zaplanowane wysyłki</h4>
          {scheduledMessages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#999",
                background: "#fafafa",
                borderRadius: "0.5rem",
              }}
            >
              <FiCalendarIcon
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                  color: "#ccc",
                }}
              />
              <p>Brak zaplanowanych wysyłek</p>
            </div>
          ) : (
            scheduledMessages.map((item) => (
              <div
                key={item.id}
                className="scheduled-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.75rem",
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {getStatusIcon(item.status)}

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>
                    {formatDateTime(item.date, item.time)}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>
                    {item.phones.length} numerów •{" "}
                    {item.template?.name || "Własna wiadomość"}
                  </div>
                </div>

                {item.status === "scheduled" && (
                  <button
                    onClick={() => {
                      // Tu można dodać funkcję anulowania
                      toast.success("Wysyłka anulowana");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f44336",
                      cursor: "pointer",
                      padding: "0.5rem",
                    }}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="schedule-info">
        <FiInfo style={{ color: "#2196f3" }} />
        <strong>Info:</strong> Zaplanowane wysyłki będą realizowane
        automatycznie o wybranej godzinie. Aplikacja musi być włączona.
      </div>
    </div>
  );
}

export default ScheduleManager;
