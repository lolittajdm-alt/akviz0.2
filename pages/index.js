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
    setForm(f => ({ ...f, time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }) }));
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
    background: isDarkMode ? "#48484A" : "#E5E5EA",
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
          <button
            onClick={() => window.location.reload()}
            style={{ ...iosButton, background: "#8E8E93", color: "#FFFFFF" }}
          >
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
            <input
              name="sector"
              value={form.sector}
              onChange={handleChange}
              style={iosInput}
              placeholder="Наприклад ЦОП"
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
              placeholder="Наприклад 3 ОТБр"
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
              placeholder="Наприклад МВГ Халк"
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
              placeholder="Наприклад Іванівка"
            />
            <button onClick={() => toggleLock("location")} style={iosButton}>
              {locks.location ? "🔒" : "✏️"}
            </button>
          </div>
        </div>
      )}

      {/* Ціль */}
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
                borderRadius: "8px",
              }}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Сторона */}
      <div style={iosCard}>
        <label style={iosLabel}>Сторона</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["Ворожий", "Свій", "Нейтральний"].map(s => (
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
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              name="targetNumber"
              value={form.targetNumber}
              onChange={handleChange}
              style={iosInput}
              placeholder="Введіть номер цілі"
            />
            <button
              onClick={() =>
                setForm(f => ({ ...f, noIssue: true, targetNumber: "" }))
              }
              style={{
                ...iosButton,
                height: "44px",
                whiteSpace: "nowrap",
              }}
            >
              Без видачі
            </button>
          </div>
          {form.targetNumber.trim() === "" && (
            <div style={{ color: "#FF3B30", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              Вкажіть номер або оберіть «Без видачі»
            </div>
          )}
        </div>
      )}

      {/* Назва */}
      <div style={iosCard}>
        <label style={iosLabel}>Назва</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {namesList.map(n => (
            <button
              key={n}
              onClick={() => selectName(n)}
              style={{
                ...iosButton,
                background: form.name === n ? "#32D74B" : "#EBEBF5",
                color: form.name === n ? "#fff" : "#1C1C1E",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Кількість */}
      <div style={iosCard}>
        <label style={iosLabel}>Кількість</label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => changeQuantity(-1)}
            style={{
              ...iosButton,
              padding: "0.5rem 0.9rem",
              background: "#FF375F",
              color: "#fff",
            }}
            disabled={form.quantity <= 1}
          >
            –
          </button>
          <span style={{ fontSize: "1.2rem", width: "2rem", textAlign: "center" }}>
            {form.quantity}
          </span>
          <button
            onClick={() => changeQuantity(1)}
            style={{
              ...iosButton,
              padding: "0.5rem 0.9rem",
              background: "#32D74B",
              color: "#fff",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Азимут */}
      <div style={iosCard}>
        <label style={iosLabel}>Азимут, °</label>
        <input
          type="text"
          inputMode="numeric"
          value={form.azimuth}
          onChange={onFieldNumeric("azimuth")}
          style={{
            ...iosInput,
            border: form.azimuth.trim() === "" ? "1px solid #FF3B30" : "1px solid transparent",
          }}
          placeholder="0–359"
        />
        {form.azimuth.trim() === "" && (
          <div style={{ color: "#FF3B30", fontSize: "0.75rem" }}>Поле має бути заповненим!</div>
        )}
      </div>

      {/* Курс */}
      <div style={iosCard}>
        <label style={iosLabel}>Курс, °</label>
        <input
          type="text"
          inputMode="numeric"
          value={form.course}
          onChange={onFieldNumeric("course")}
          style={iosInput}
          placeholder="0–359"
        />
      </div>

      {/* Відстань */}
      <div style={iosCard}>
        <label style={iosLabel}>Відстань, м*</label>
        <input
          type="text"
          inputMode="numeric"
          value={form.distance}
          onChange={e => changeDistance(+e.target.value)}
          style={{
            ...iosInput,
            border: form.distance.trim() === "" || errors.distance ? "1px solid #FF3B30" : "1px solid transparent",
          }}
          placeholder="Відстань до цілі"
        />
        {errors.distance && (
          <div style={{ color: "#FF3B30", fontSize: "0.75rem" }}>Поле має бути заповненим!</div>
        )}
      </div>

      {/* Висота */}
      <div style={iosCard}>
        <label style={iosLabel}>Висота, м*</label>
        <input
          type="text"
          inputMode="numeric"
          value={form.height}
          onChange={e => changeHeight(+e.target.value)}
          style={{
            ...iosInput,
            border: form.height.trim() === "" || errors.height ? "1px solid #FF3B30" : "1px solid transparent",
          }}
          placeholder="Висота"
        />
        {errors.height && (
          <div style={{ color: "#FF3B30", fontSize: "0.75rem" }}>Поле має бути заповненим!</div>
        )}
      </div>

      {/* Вияв */}
      <div style={iosCard}>
        <label style={iosLabel}>Вияв</label>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          {["Акустично", "Візуально"].map(m => (
            <button
              key={m}
              onClick={() => toggleDetection(m)}
              style={{
                ...iosButton,
                flex: 1,
                background: form.detectionMethods.includes(m) ? "#32D74B" : "#EBEBF5",
                color: form.detectionMethods.includes(m) ? "#fff" : "#1C1C1E",
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={() => toggleDetection("Із застосуванням приладів спостереження")}
          style={{
            ...iosButton,
            background: form.detectionMethods.includes("Із застосуванням приладів спостереження")
              ? "#32D74B"
              : "#EBEBF5",
            color: form.detectionMethods.includes("Із застосуванням приладів спостереження")
              ? "#fff"
              : "#1C1C1E",
          }}
        >
          Із застосуванням приладів спостереження
        </button>
      </div>

      {/* Результат */}
      <div style={iosCard}>
        <label style={iosLabel}>Результат</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["Уражено", "Не уражено", "Достовірно невизначено"].map(r => (
            <button
              key={r}
              onClick={() => setForm(f => ({ ...f, result: r }))}
              style={{
                ...iosButton,
                background: form.result === r ? "#32D74B" : "#EBEBF5",
                color: form.result === r ? "#fff" : "#1C1C1E",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Опис */}
      <div style={iosCard}>
        <label style={iosLabel}>Опис</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Додаткова інформація"
          style={{ ...iosInput, height: "80px" }}
        />
      </div>

      {/* Кнопки Копіювати/WhatsApp */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <button onClick={copyReport} style={iosButton}>
          Копіювати
        </button>
        <button onClick={openWhatsApp} style={{ ...iosButton, background: "#34C759", color: "#fff" }}>
          WhatsApp
        </button>
      </div>

      {/* Отчет */}
      <div style={iosCard}>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
          {generateReportText()}
        </pre>
      </div>
    </div>
  );
}
