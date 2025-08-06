import React, { useState, useEffect } from "react";

// Системный шрифт iOS
const systemFont = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;

export default function Home() {
  // ——— Состояние формы ———
  const [form, setForm] = useState({
    sector: "", subdivision: "", position: "", location: "", time: "", selectedGoals: [],
    side: null, targetNumber: "", noIssue: false, name: null, quantity: 1,
    azimuth: "", course: "", distance: "", height: "", detectionMethods: [],
    result: null, description: "", additionalInfo: "",
  });
  const [showTopFields, setShowTopFields] = useState(true);
  const [locks, setLocks] = useState({ sector: false, subdivision: false, position: false, location: false });
  const [errors, setErrors] = useState({ distance: false, height: false });

  // ——— Тема (светлая/темная) ———
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) setIsDarkMode(saved === "dark");
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // ——— Списки ———
  const goalsList = [
    "БПЛА", "Постріли(ЗУ,кулемет)", "Виходи(ПЗРК,ЗРК)", "Вибух", "КР",
    "Гелікоптер", "Літак малий", "Літак великий", "Квадрокоптер",
    "Зонд", "Інше (деталі в описі)",
  ];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];

  // ——— Обновление времени ———
  useEffect(() => {
    const now = new Date();
    setForm(f => ({
      ...f,
      time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
    }));
  }, []);

  // ——— Сохранение полей и блокировок ———
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sf = localStorage.getItem("show_top_fields");
      if (sf !== null) setShowTopFields(sf === "true");
      const l = localStorage.getItem("report_locks");
      if (l) setLocks(JSON.parse(l));
      ["sector","subdivision","position","location"].forEach(key => {
        const v = localStorage.getItem(`report_${key}`);
        if (v !== null) setForm(f => ({ ...f, [key]: v }));
      });
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("show_top_fields", showTopFields);
      localStorage.setItem("report_locks", JSON.stringify(locks));
    }
  }, [showTopFields, locks]);

  // ——— Хендлеры и валидации ———
  const handleChange = e => {
    const { name, value } = e.target;
    if (locks[name]) return;
    setForm(f => ({ ...f, [name]: value }));
    if (["sector","subdivision","position","location"].includes(name))
      localStorage.setItem(`report_${name}`, value);
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
  const onFieldNumeric = (fieldName, max = 3) => e => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, max);
    setForm(f => ({ ...f, [fieldName]: digits }));
    setErrors(err => ({ ...err, [fieldName]: !/^\d+$/.test(digits) }));
  };
  const toggleDetection = m => setForm(f => ({
    ...f,
    detectionMethods: f.detectionMethods.includes(m)
      ? f.detectionMethods.filter(x => x !== m)
      : [...f.detectionMethods, m]
  }));

  // ——— Генератор отчёта, копирование и WhatsApp ———
  const generateReportText = () => "Ваш звіт тут...";
  const copyReport = () => navigator.clipboard.writeText(generateReportText());
  const openWhatsApp = () => {
    const text = encodeURIComponent(generateReportText());
    window.open(`whatsapp://send?text=${text}`, "_blank");
  };

  // ——— Стили iOS ———
  const iosContainer = {
    fontFamily: systemFont,
    minHeight: "100vh",
    padding: "1rem",
    background: isDarkMode ? "#1C1C1E" : "#FFFFFF",
    color: isDarkMode ? "#F2F2F7" : "#1C1C1E",
    transition: "background 0.3s, color 0.3s"
  };
  const iosCard = {
    background: isDarkMode ? "rgba(44,44,46,0.9)" : "rgba(255,255,255,0.8)",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: isDarkMode
      ? "0 2px 4px rgba(0,0,0,0.6)"
      : "0 2px 4px rgba(0,0,0,0.1)",
    transition: "background 0.3s, box-shadow 0.3s"
  };
  const iosButton = {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "16px",
    border: "none",
    fontFamily: systemFont,
    cursor: "pointer",
    background: isDarkMode ? "#3A3A3C" : "#EBEBF5",
    color: isDarkMode ? "#F2F2F7" : "#1C1C1E",
    boxShadow: isDarkMode
      ? "inset 0 1px 0 rgba(255,255,255,0.1)"
      : "inset 0 1px 0 rgba(0,0,0,0.05)",
    transition: "background 0.3s, color 0.3s"
  };
  const iosLabel = { fontSize: "0.9rem", marginBottom: "0.3rem" };
  const iosInput = {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: isDarkMode ? "#2C2C2E" : "#ECECEC",
    fontSize: "1rem",
    marginBottom: "0.6rem",
    transition: "background 0.3s, color 0.3s"
  };

  const switchContainer = {
    width: "2.6rem",
    height: "1.4rem",
    borderRadius: "1rem",
    background: isDarkMode ? "#48484A" : "#E5EEA",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "background 0.3s"
  };
  const switchThumb = {
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    background: "#FFFFFF",
    transform: isDarkMode ? "translateX(1.2rem)" : "translateX(0)",
    transition: "transform 0.3s"
  };

  return (
    <div style={iosContainer}>
      {/* Заголовок */}
      <div style={{ ...iosCard, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>АкВіз 2.0</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Переключатель темы */}
          <button onClick={toggleTheme} style={switchContainer}>
            <div style={switchThumb} />
          </button>
          {/* Обновить */}
          <button onClick={() => window.location.reload()} style={{ ...iosButton, background: "#8E8E93", color: "#FFFFFF" }}>
            Оновити
          </button>
        </div>
      </div>

      {/* Скрыть/показать поля */}
      <div style={{ ...iosCard, display: "flex", justifyContent: "center" }}>
        <button onClick={() => setShowTopFields(prev => !prev)} style={iosButton}>
          {showTopFields ? "Приховати поля" : "Показати поля"}
        </button>
      </div>

      {/* Первые 4 поля */}
      {showTopFields && (
        <div style={iosCard}>
          {/* Сектор */}
          <label style={iosLabel}>Сектор</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input name="sector" value={form.sector} onChange={handleChange} style={iosInput} placeholder="Наприклад ЦОП" />
            <button onClick={() => toggleLock("sector")} style={iosButton}>{locks.sector ? "🔒" : "✏️"}</

