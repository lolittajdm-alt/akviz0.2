import { useState, useEffect } from "react";

// Системный шрифт iOS
const systemFont = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;

export default function Home() {
  // ——— Состояние формы ———
  const [form, setForm] = useState({
    sector: "",
    subdivision: "",
    position: "",
    location: "",
    time: "",
    selectedGoals: [],
    side: null,
    targetNumber: "",
    noIssue: false,
    name: null,
    quantity: 1,
    azimuth: "",
    course: "",
    distance: "",
    height: "",
    detectionMethods: [],
    result: null,
    description: "",
    additionalInfo: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showTopFields, setShowTopFields] = useState(true);
  const [locks, setLocks] = useState({
    sector: false,
    subdivision: false,
    position: false,
    location: false,
  });
  const [errors, setErrors] = useState({
  distance: false,
  height: false,
  });
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [ammoList, setAmmoList] = useState([]);
  const [ammoQuantities, setAmmoQuantities] = useState({});

  const goalsList = [ "БПЛА", "Постріли(ЗУ,кулемет)", "Виходи(ПЗРК,ЗРК)", "Вибух", "КР", "Гелікоптер", "Літак малий", "Літак великий", "Квадрокоптер", "Зонд", "Інше (деталі в описі)" ];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];
  const updateTime = () => {
    const now = new Date();
    setForm(f => ({ ...f, time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }) }));
  };

  // ——— Эффекты ———
  useEffect(updateTime, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("show_top_fields");
      if (saved !== null) setShowTopFields(saved === "true");
      const l = localStorage.getItem("report_locks");
      if (l) setLocks(JSON.parse(l));
      ["sector","subdivision","position","location"].forEach(key => {
        const v = localStorage.getItem(`report_${key}`);
        if (v !== null) setForm(f => ({ ...f, [key]: v }));
      });
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("show_top_fields", showTopFields);
    localStorage.setItem("report_locks", JSON.stringify(locks));
  }, [showTopFields, locks]);

  // ——— Хендлеры ———
  // ——— Встановлення поточного часу ———
const setTimeNow = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  setForm(f => ({ ...f, time: `${hours}:${minutes}` }));
};
  const handleChange = e => {
    const { name, value } = e.target;
    if (locks[name]) return;
    setForm(f => ({ ...f, [name]: value }));
    if (["sector","subdivision","position","location"].includes(name)) {
      localStorage.setItem(`report_${name}`, value);
    }
  };
  const toggleLock = field => setLocks(l => ({ ...l, [field]: !l[field] }));
  const toggleGoal = g => setForm(f => ({
    ...f,
    selectedGoals: f.selectedGoals.includes(g)
      ? f.selectedGoals.filter(x => x !== g)
      : [...f.selectedGoals, g]
  }));
  const selectSide = s => setForm(f => ({ ...f, side: f.side === s ? null : s }));
  const selectName = n => setForm(f => ({ ...f, name: n }));
  const changeQuantity = d => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity + d) }));
  const validateNumeric = (v, max=null) => /^\d+$/.test(v) && (max===null || +v <= max);
  // ——— Універсальний хендлер числових полів ———
const onFieldNumeric = (fieldName, maxLength = 3) => (e) => {
  const raw = e.target.value;
  const digits = raw.replace(/\D/g, "").slice(0, maxLength);
  setForm((prev) => ({ ...prev, [fieldName]: digits }));

  if (fieldName === "distance") {
    setErrors((prev) => ({ ...prev, distance: !validateDistance(digits) }));
  }
  if (fieldName === "height") {
    setErrors((prev) => ({ ...prev, height: !validateHeight(digits) }));
  }
};
  const toggleDetection = m => setForm(f => ({
    ...f,
    detectionMethods: f.detectionMethods.includes(m)
      ? f.detectionMethods.filter(x => x !== m)
      : [...f.detectionMethods, m]
  }));
  const copyReport = () => {
    const text = generateReportText().replace(/\n/g, "\r\n");
    navigator.clipboard.writeText(text);
    alert("Скопійовано!");
  };
  const openWhatsApp = () => {
    window.location.href = `whatsapp://send?text=${encodeURIComponent(generateReportText())}`;
  };

  // ——— Валидации ———
const validateCourse = (v) => /^\d{1,3}$/.test(v) && +v >= 0 && +v <= 359;
const validateAzimuth = (v) => /^\d{1,3}$/.test(v) && +v >= 0 && +v <= 359;
const validateDistance = (v) => /^\d+$/.test(v) && +v > 0;
const validateHeight = (v) => /^\d+$/.test(v) && +v > 0;

const onCourseChange = (e) => {
const value = e.target.value.replace(/\D/g, "").slice(0, 3);
setForm((f) => ({ ...f, course: value }));
setErrors((f) => ({ ...f, course: !validateCourse(value) }));
};

const onAzimuthChange = (e) => {
const value = e.target.value.replace(/\D/g, "").slice(0, 3);
setForm((f) => ({ ...f, azimuth: value }));
setErrors((f) => ({ ...f, azimuth: !validateAzimuth(value) }));
};

const onDistanceChange = (e) => {
  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
  setForm((f) => ({ ...f, distance: value }));
  setErrors((err) => ({ ...err, distance: !validateDistance(value) }));
};

const onHeightChange = (e) => {
  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
  setForm((f) => ({ ...f, height: value }));
  setErrors((err) => ({ ...err, height: !validateHeight(value) }));
};

const changeDistance = (delta) => {
  let x = +form.distance || 0;
  x += delta;
  if (x < 0) x = 0;
  const updated = String(x);
  setForm((f) => ({ ...f, distance: updated }));
  setErrors((err) => ({ ...err, distance: !validateDistance(updated) }));
};

const changeHeight = (delta) => {
  let h = +form.height || 0;
  h += delta;
  if (h < 0) h = 0;
  const updated = String(h);
  setForm((f) => ({ ...f, height: updated }));
  setErrors((err) => ({ ...err, height: !validateHeight(updated) }));
};
  
  // ——— Генерация текста ———
  const generateReportText = () => [
    form.sector || form.subdivision || form.position
      ? `П: ${[form.sector,form.subdivision,form.position].filter(Boolean).join(", ")}`
      : null,
    `Ціль: ${[
      ...form.selectedGoals,
      form.side,
      form.noIssue ? "Без видачі" : `по цілі ${form.targetNumber || ""}`
    ].filter(Boolean).join(", ")}`,
    form.height ? `Висота: ${form.height} м` : null,
    form.distance ? `Відстань: ${form.distance} м` : null,
    form.quantity ? `Кількість: ${form.quantity} од.` : null,
    form.azimuth ? `А: ${form.azimuth}°` : null,
    form.course ? `К: ${form.course}°` : null,
    form.location ? `НП: ${form.location}` : null,
    form.time ? `Ч: ${form.time}` : null,
    form.detectionMethods.length ? `Вияв: ${form.detectionMethods.join(", ")}` : null,
    form.result ? `ПП: ${form.result}` : null,
    form.description ? `Опис: ${form.description}` : null
  ].filter(Boolean).join("\n");

// ——— Темні стилі iOS ———
const iosContainer = {
  fontFamily: systemFont,
  backgroundColor: "#000", // глибокий чорний фон
  minHeight: "100vh",
  padding: "1rem",
  boxSizing: "border-box",
};

const iosCard = {
  backgroundColor: "rgba(28,28,30,0.9)", // напівпрозора темна картка
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  padding: "1rem",
  marginBottom: "1.2rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const iosLabel = {
  fontSize: "0.9rem",
  marginBottom: "0.3rem",
  color: "#fff", // білий текст
};

const iosInput = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#1C1C1E", // темний інпут
  fontSize: "1rem",
  color: "#fff", // білий текст у полі
  marginBottom: "0.6rem",
};

const iosButton = {
  flex: 1,
  padding: "0.6rem",
  borderRadius: "12px",
  border: "none",
  fontSize: "1rem",
  color: "#fff",
  background: "#0A84FF", // стандартний синій iOS
  margin: "0.3rem",
  cursor: "pointer",
};
      {/* ——— Тип цілі ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Ціль</label>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.3rem",
      }}>
        {goalsList.map(goal => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            style={{
              ...iosButton,
              padding: "0.3rem 0.6rem",
              fontSize: "0.8rem",
              borderRadius: "8px",
              background: form.selectedGoals.includes(goal) ? "#32D74B" : "#3A3A3C",
              color: form.selectedGoals.includes(goal) ? "#fff" : "#fff",
            }}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>

    {/* ——— Сторона ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Сторона</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["Ворожий", "Свій", "Нейтральний"].map(s => (
          <button
            key={s}
            onClick={() => selectSide(s)}
            style={{
              ...iosButton,
              background: form.side === s ? "#32D74B" : "#3A3A3C",
              color: form.side === s ? "#fff" : "#fff",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>

    {/* ——— Номер цілі ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Номер цілі</label>
      {form.noIssue ? (
        <button
          onClick={() =>
            setForm((f) => ({
              ...f,
              noIssue: false,
              targetNumber: "",
            }))
          }
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "12px",
            border: "none",
            fontSize: "1rem",
            backgroundColor: "#FF375F",
            color: "#fff",
          }}
        >
          Видати номер
        </button>
      ) : (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            name="targetNumber"
            value={form.targetNumber}
            onChange={onFieldNumeric("targetNumber", 9999)}
            placeholder="по цілі"
            inputMode="numeric"
            pattern="\d*"
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#2C2C2E",
              border: form.targetNumber.trim() === "" ? "1px solid #FF3B30" : "none",
              padding: "0 1rem",
              fontSize: "1rem",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={() =>
              setForm((f) => ({
                ...f,
                noIssue: true,
                targetNumber: "",
              }))
            }
            style={{
              height: "44px",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "none",
              fontSize: "1rem",
              backgroundColor: "#3A3A3C",
              color: "#fff",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Без видачі
          </button>
        </div>
      )}
      {!form.noIssue && form.targetNumber.trim() === "" && (
        <div style={{ color: "#FF3B30", fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Поле має бути заповненим!
        </div>
      )}
    </div>

    {/* ——— Назва (БПЛА) ——— */}
    {form.selectedGoals.includes("БПЛА") && (
      <div style={iosCard}>
        <label style={iosLabel}>Назва</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {namesList.map(n => (
            <button
              key={n}
              onClick={() => selectName(n)}
              style={{
                ...iosButton,
                background: form.name === n ? "#0A84FF" : "#3A3A3C",
                color: "#fff",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    )}

      
          
          {/* ——— Тип цілі ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Ціль</label>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.3rem",
      }}>
        {goalsList.map(goal => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            style={{
              ...iosButton,
              padding: "0.3rem 0.6rem",
              fontSize: "0.8rem",
              borderRadius: "8px",
              background: form.selectedGoals.includes(goal) ? "#32D74B" : "#3A3A3C",
              color: form.selectedGoals.includes(goal) ? "#fff" : "#fff",
            }}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>

    {/* ——— Сторона ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Сторона</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["Ворожий", "Свій", "Нейтральний"].map(s => (
          <button
            key={s}
            onClick={() => selectSide(s)}
            style={{
              ...iosButton,
              background: form.side === s ? "#32D74B" : "#3A3A3C",
              color: form.side === s ? "#fff" : "#fff",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>

    {/* ——— Номер цілі ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Номер цілі</label>
      {form.noIssue ? (
        <button
          onClick={() =>
            setForm((f) => ({
              ...f,
              noIssue: false,
              targetNumber: "",
            }))
          }
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "12px",
            border: "none",
            fontSize: "1rem",
            backgroundColor: "#FF375F",
            color: "#fff",
          }}
        >
          Видати номер
        </button>
      ) : (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            name="targetNumber"
            value={form.targetNumber}
            onChange={onFieldNumeric("targetNumber", 9999)}
            placeholder="по цілі"
            inputMode="numeric"
            pattern="\d*"
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#2C2C2E",
              border: form.targetNumber.trim() === "" ? "1px solid #FF3B30" : "none",
              padding: "0 1rem",
              fontSize: "1rem",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={() =>
              setForm((f) => ({
                ...f,
                noIssue: true,
                targetNumber: "",
              }))
            }
            style={{
              height: "44px",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "none",
              fontSize: "1rem",
              backgroundColor: "#3A3A3C",
              color: "#fff",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Без видачі
          </button>
        </div>
      )}
      {!form.noIssue && form.targetNumber.trim() === "" && (
        <div style={{ color: "#FF3B30", fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Поле має бути заповненим!
        </div>
      )}
    </div>

    {/* ——— Назва (БПЛА) ——— */}
    {form.selectedGoals.includes("БПЛА") && (
      <div style={iosCard}>
        <label style={iosLabel}>Назва</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {namesList.map(n => (
            <button
              key={n}
              onClick={() => selectName(n)}
              style={{
                ...iosButton,
                background: form.name === n ? "#0A84FF" : "#3A3A3C",
                color: "#fff",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    )}

          {/* ——— Тип цілі ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Ціль</label>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.3rem",
      }}>
        {goalsList.map(goal => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            style={{
              ...iosButton,
              padding: "0.3rem 0.6rem",
              fontSize: "0.8rem",
              borderRadius: "8px",
              background: form.selectedGoals.includes(goal) ? "#32D74B" : "#3A3A3C",
              color: form.selectedGoals.includes(goal) ? "#fff" : "#fff",
            }}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>

    {/* ——— Сторона ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Сторона</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["Ворожий", "Свій", "Нейтральний"].map(s => (
          <button
            key={s}
            onClick={() => selectSide(s)}
            style={{
              ...iosButton,
              background: form.side === s ? "#32D74B" : "#3A3A3C",
              color: form.side === s ? "#fff" : "#fff",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>

    {/* ——— Номер цілі ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Номер цілі</label>
      {form.noIssue ? (
        <button
          onClick={() =>
            setForm((f) => ({
              ...f,
              noIssue: false,
              targetNumber: "",
            }))
          }
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "12px",
            border: "none",
            fontSize: "1rem",
            backgroundColor: "#FF375F",
            color: "#fff",
          }}
        >
          Видати номер
        </button>
      ) : (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            name="targetNumber"
            value={form.targetNumber}
            onChange={onFieldNumeric("targetNumber", 9999)}
            placeholder="по цілі"
            inputMode="numeric"
            pattern="\d*"
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#2C2C2E",
              border: form.targetNumber.trim() === "" ? "1px solid #FF3B30" : "none",
              padding: "0 1rem",
              fontSize: "1rem",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={() =>
              setForm((f) => ({
                ...f,
                noIssue: true,
                targetNumber: "",
              }))
            }
            style={{
              height: "44px",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "none",
              fontSize: "1rem",
              backgroundColor: "#3A3A3C",
              color: "#fff",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Без видачі
          </button>
        </div>
      )}
      {!form.noIssue && form.targetNumber.trim() === "" && (
        <div style={{ color: "#FF3B30", fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Поле має бути заповненим!
        </div>
      )}
    </div>

    {/* ——— Назва (БПЛА) ——— */}
    {form.selectedGoals.includes("БПЛА") && (
      <div style={iosCard}>
        <label style={iosLabel}>Назва</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {namesList.map(n => (
            <button
              key={n}
              onClick={() => selectName(n)}
              style={{
                ...iosButton,
                background: form.name === n ? "#0A84FF" : "#3A3A3C",
                color: "#fff",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    )}

          {/* ——— Вияв ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Вияв</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {["Акустично", "Візуально"].map((method) => (
          <button
            key={method}
            onClick={() => toggleDetection(method)}
            style={{
              ...iosButton,
              padding: "0.3rem 0.8rem",
              backgroundColor: form.detectionMethods.includes(method)
                ? "#32D74B"
                : "#3A3A3C",
              color: "#fff",
              borderRadius: "10px",
              flex: "1 0 45%",
            }}
          >
            {method}
          </button>
        ))}
        <button
          onClick={() => toggleDetection("Із застосуванням приладів спостереження")}
          style={{
            ...iosButton,
            padding: "0.3rem 0.8rem",
            backgroundColor: form.detectionMethods.includes("Із застосуванням приладів спостереження")
              ? "#32D74B"
              : "#3A3A3C",
            color: "#fff",
            borderRadius: "10px",
            flex: "1 0 100%",
          }}
        >
          Із застосуванням приладів спостереження
        </button>
      </div>
    </div>

    {/* ——— Результат ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Результат</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {["Виявлено", "Обстріляно"].map((result) => (
          <button
            key={result}
            onClick={() => setForm((f) => ({ ...f, result }))}
            style={{
              ...iosButton,
              padding: "0.4rem 0.6rem",
              fontSize: "0.85rem",
              backgroundColor: form.result === result ? "#32D74B" : "#3A3A3C",
              color: "#fff",
              borderRadius: "10px",
              flex: "1 0 48%",
            }}
          >
            {result}
          </button>
        ))}
        <button
          onClick={() => setForm((f) => ({ ...f, result: "Уражено" }))}
          style={{
            ...iosButton,
            padding: "0.4rem 0.6rem",
            fontSize: "0.85rem",
            backgroundColor: form.result === "Уражено" ? "#32D74B" : "#3A3A3C",
            color: "#fff",
            borderRadius: "10px",
            flex: "1 0 100%",
          }}
        >
          Уражено
        </button>
      </div>
    </div>

    {/* ——— Опис ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Опис</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        placeholder="Додаткова інформація..."
        style={{
          width: "100%",
          borderRadius: "12px",
          padding: "0.8rem",
          backgroundColor: "#2C2C2E",
          color: "#fff",
          border: "none",
          fontSize: "1rem",
          resize: "none",
          boxSizing: "border-box",
        }}
      />
    </div>

    {/* ——— Час ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Час</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          style={{ ...iosInput, backgroundColor: "#2C2C2E", color: "#fff", flex: 1 }}
          placeholder="год:хв"
        />
        <button onClick={setTimeNow} style={{ ...iosButton, flexShrink: 0 }}>
          Зараз
        </button>
      </div>
    </div>

    {/* ——— Звіт ——— */}
    <div style={iosCard}>
      <label style={iosLabel}>Звіт</label>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#1C1C1E",
          color: "#fff",
          padding: "1rem",
          borderRadius: "12px",
          fontSize: "0.95rem",
          marginBottom: "1rem",
        }}
      >
        {generateReportText()}
      </pre>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={copyReport}
          style={{ ...iosButton, backgroundColor: "#0A84FF", flex: 1 }}
        >
          Копіювати
        </button>
        <button
          onClick={openWhatsApp}
          style={{ ...iosButton, backgroundColor: "#25D366", flex: 1 }}
        >
          WhatsApp
        </button>
      </div>
    </div>
  </div> 
