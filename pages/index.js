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
  const [showTopFields, setShowTopFields] = useState(true);
  const [locks, setLocks] = useState({
    sector: false,
    subdivision: false,
    position: false,
    location: false,
  });
  const [errors, setErrors] = useState({});
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
  const onFieldNumeric = (field, max) => e => {
    const v = e.target.value.replace(/\D/g, "").slice(0, max ? String(max).length : undefined);
    setForm(f => ({ ...f, [field]: v }));
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

  // ——— Стили iOS ———
  const iosContainer = {
    fontFamily: systemFont,
    backgroundColor: "#F2F2F7",
    minHeight: "100vh",
    padding: "1rem",
    boxSizing: "border-box",
  };
  const iosCard = {
    backgroundColor: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  };
  const iosLabel = { fontSize: "0.9rem", marginBottom: "0.3rem", color: "#1C1C1E" };
  const iosInput = {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ECECEC",
    fontSize: "1rem",
    color: "#1C1C1E",
    marginBottom: "0.6rem",
  };
  const iosButton = {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1rem",
    color: "#fff",
    background: "#0A84FF",
    margin: "0.3rem",
    cursor: "pointer",
  };

  return (
    <div style={iosContainer}>
      {/* Заголовок */}
      <div style={{ ...iosCard, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#1C1C1E" }}>АкВіз 2.0</h1>
        <button onClick={() => window.location.reload()} style={{ ...iosButton, background: "#8E8E93" }}>
          Оновити
        </button>
      </div>

{/* ——— Кнопка скрыть/показать поля ——— */}
<div style={{ ...iosCard, display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
  <button
    onClick={() => setShowTopFields(prev => !prev)}
    style={{ ...iosButton, background: "#8E8E93" }}
  >
    {showTopFields ? "Приховати поля" : "Показати поля"}
  </button>
</div>

{/* ——— Первые 4 поля ——— */}
{showTopFields && (
  <div style={iosCard}>
    {/* Сектор */}
    <label style={iosLabel}>Сектор</label>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        name="sector"
        value={form.sector}
        onChange={handleChange}
        style={iosInput}
        placeholder="Сектор"
      />
      <button onClick={() => toggleLock("sector")} style={iosButton}>
        {locks.sector ? "🔒" : "✏️"}
      </button>
    </div>
    {/* Підрозділ */}
    <label style={iosLabel}>Підрозділ</label>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        name="subdivision"
        value={form.subdivision}
        onChange={handleChange}
        style={iosInput}
        placeholder="Підрозділ"
      />
      <button onClick={() => toggleLock("subdivision")} style={iosButton}>
        {locks.subdivision ? "🔒" : "✏️"}
      </button>
    </div>
    {/* Позиція */}
    <label style={iosLabel}>Позиція</label>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        name="position"
        value={form.position}
        onChange={handleChange}
        style={iosInput}
        placeholder="Позиція"
      />
      <button onClick={() => toggleLock("position")} style={iosButton}>
        {locks.position ? "🔒" : "✏️"}
      </button>
    </div>
    {/* Населений пункт */}
    <label style={iosLabel}>Населений пункт</label>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        style={iosInput}
        placeholder="НП"
      />
      <button onClick={() => toggleLock("location")} style={iosButton}>
        {locks.location ? "🔒" : "✏️"}
      </button>
    </div>
  </div>
)}

      {/* Верхние поля */}
      {showTopFields && (
        <div style={iosCard}>
          <label style={iosLabel}>Сектор</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="sector"
              value={form.sector}
              onChange={handleChange}
              style={iosInput}
              placeholder="Сектор"
            />
            <button onClick={() => toggleLock("sector")} style={iosButton}>
              {locks.sector ? "🔒" : "✏️"}
            </button>
          </div>

          <label style={iosLabel}>Підрозділ</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="subdivision"
              value={form.subdivision}
              onChange={handleChange}
              style={iosInput}
              placeholder="Підрозділ"
            />
            <button onClick={() => toggleLock("subdivision")} style={iosButton}>
              {locks.subdivision ? "🔒" : "✏️"}
            </button>
          </div>

          <label style={iosLabel}>Позиція</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              style={iosInput}
              placeholder="Позиція"
            />
            <button onClick={() => toggleLock("position")} style={iosButton}>
              {locks.position ? "🔒" : "✏️"}
            </button>
          </div>

          <label style={iosLabel}>Населений пункт</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              style={iosInput}
              placeholder="НП"
            />
            <button onClick={() => toggleLock("location")} style={iosButton}>
              {locks.location ? "🔒" : "✏️"}
            </button>
          </div>
        </div>
      )}

      {/* Тип цілі */}
      <div style={iosCard}>
        <label style={iosLabel}>Ціль</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {goalsList.map(goal => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              style={{
                ...iosButton,
                background: form.selectedGoals.includes(goal) ? "#32D74B" : "#EBEBF5",
                color: form.selectedGoals.includes(goal) ? "#fff" : "#1C1C1E",
              }}
            >
              {goal}
            </button>
          ))}
          <button
            onClick={() => setForm(f => ({ ...f, noIssue: !f.noIssue }))}
            style={{
              ...iosButton,
              background: form.noIssue ? "#FF375F" : "#EBEBF5",
              color: form.noIssue ? "#fff" : "#1C1C1E",
            }}
          >
            Без видачі
          </button>
        </div>
      </div>

      {/* Сторона */}
      <div style={iosCard}>
        <label style={iosLabel}>Сторона</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["Ворожий","Свій","Нейтральний"].map(s => (
            <button
              key={s}
              onClick={() => selectSide(s)}
              style={{
                ...iosButton,
                background: form.side === s ? "#32D74B" : "#EBEBF5",
                color: form.side === s ? "#fff" : "#1C1C1E",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Номер цілі */}
      {!form.noIssue && (
        <div style={iosCard}>
          <label style={iosLabel}>Номер цілі</label>
          <input
            type="text"
            name="targetNumber"
            value={form.targetNumber}
            onChange={onFieldNumeric("targetNumber", 999)}
            style={iosInput}
            placeholder="по цілі"
          />
        </div>
      )}

      {/* Назва (БПЛА) */}
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
                  background: form.name === n ? "#0A84FF" : "#EBEBF5",
                  color: form.name === n ? "#fff" : "#1C1C1E",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Остальные поля (количество, азимут, курс, расстояние, высота) */}
      <div style={iosCard}>
        <label style={iosLabel}>Кількість</label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button onClick={() => changeQuantity(-1)} style={iosButton}>–</button>
          <input
            type="number"
            value={form.quantity}
            onChange={e => setForm(f => ({ ...f, quantity: Math.max(1, +e.target.value) }))}
            style={{ ...iosInput, textAlign: "center" }}
          />
          <button onClick={() => changeQuantity(1)} style={iosButton}>+</button>
        </div>
      </div>

      <div style={iosCard}>
        <label style={iosLabel}>Азимут</label>
        <input
          type="text"
          value={form.azimuth}
          onChange={onFieldNumeric("azimuth", 359)}
          style={iosInput}
          placeholder="0–359"
        />
        <label style={iosLabel}>Курс</label>
        <input
          type="text"
          value={form.course}
          onChange={onFieldNumeric("course", 359)}
          style={iosInput}
          placeholder="0–359"
        />
      </div>

      <div style={iosCard}>
        <label style={iosLabel}>Відстань, м</label>
        <input
          type="text"
          value={form.distance}
          onChange={onFieldNumeric("distance", null)}
          style={iosInput}
          placeholder="м"
        />
        <label style={iosLabel}>Висота, м</label>
        <input
          type="text"
          value={form.height}
          onChange={onFieldNumeric("height", null)}
          style={iosInput}
          placeholder="м"
        />
      </div>

      {/* Вияв */}
      <div style={iosCard}>
        <label style={iosLabel}>Вияв</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {["Акустично","Візуально","Радіолокаційно","Із застосуванням приладів спостереження"].map(m => (
            <button
              key={m}
              onClick={() => toggleDetection(m)}
              style={{
                ...iosButton,
                background: form.detectionMethods.includes(m) ? "#32D74B" : "#EBEBF5",
                color: form.detectionMethods.includes(m) ? "#fff" : "#1C1C1E",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Результат */}
      <div style={iosCard}>
        <label style={iosLabel}>Результат</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["Виявлено","Обстріляно","Уражено"].map(r => (
            <button
              key={r}
              onClick={() => setForm(f => ({ ...f, result: r }))}
              style={{
                ...iosButton,
                background: form.result === r ? "#0A84FF" : "#EBEBF5",
                color: form.result === r ? "#fff" : "#1C1C1E",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Інша інформація */}
      <div style={iosCard}>
        <label style={iosLabel}>Опис</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Додаткова інформація"
          rows={3}
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#ECECEC",
            fontSize: "1rem",
            color: "#1C1C1E",
            resize: "none",
          }}
        />
      </div>

      {/* Кнопки копировать и WhatsApp */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <button onClick={copyReport} style={iosButton}>Копіювати</button>
        <button onClick={openWhatsApp} style={{ ...iosButton, background: "#34C759" }}>WhatsApp</button>
      </div>

      {/* Отображение отчёта */}
      <div style={iosCard}>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", color: "#1C1C1E" }}>
          {generateReportText()}
        </pre>
      </div>
    </div>
  );
}
