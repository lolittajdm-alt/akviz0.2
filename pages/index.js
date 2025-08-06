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
    side: null, // 'Ворожий' | 'Свій' | 'Нейтральний'
    targetNumber: "",
    noIssue: false,
    name: null, // 'Shahed-136', 'Гербера', 'Невстановлений'
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
  const [errors, setErrors] = useState({
    sector: false,
    subdivision: false,
    position: false,
    targetNumber: false,
    azimuth: false,
    course: false,
    distance: false,
    height: false,
  });

  // ——— Обработчики ———
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleGoal = (goal) => {
    setForm((prev) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter((g) => g !== goal)
        : [...prev.selectedGoals, goal],
    }));
  };

  const toggleSide = (s) => {
    setForm((prev) => ({ ...prev, side: prev.side === s ? null : s }));
  };

  const toggleName = (n) => {
    setForm((prev) => ({ ...prev, name: prev.name === n ? null : n }));
  };

  const toggleDetection = (m) => {
    setForm((prev) => ({
      ...prev,
      detectionMethods: prev.detectionMethods.includes(m)
        ? prev.detectionMethods.filter((x) => x !== m)
        : [...prev.detectionMethods, m],
    }));
  };

  const toggleResult = (r) => {
    setForm((prev) => ({ ...prev, result: prev.result === r ? null : r }));
  };

  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setForm((prev) => ({ ...prev, time: timeString }));
  };

  useEffect(() => {
    // Валидация
    const newErrors = {
      sector: !form.sector,
      subdivision: !form.subdivision,
      position: !form.position,
      targetNumber: !form.targetNumber,
      azimuth: !form.azimuth,
      course: !form.course,
      distance: !form.distance,
      height: !form.height,
    };
    setErrors(newErrors);
  }, [form]);

  const generateReportText = () => {
    const items = [
      form.sector && `Сектор: ${form.sector}`,
      form.subdivision && `Підрозділ: ${form.subdivision}`,
      form.position && `Позиція: ${form.position}`,
      form.location && `Нас. пункт: ${form.location}`,
      form.time && `Час: ${form.time}`,
      form.selectedGoals.length &&
        `Цілі: ${form.selectedGoals.join(", ")}`,
      form.side && `Сторона: ${form.side}`,
      form.targetNumber && `№ цілі: ${form.targetNumber}`,
      form.noIssue && `Без видачі`,
      form.name && `Назва: ${form.name}`,
      form.quantity && `Кількість: ${form.quantity}`,
      form.azimuth && `Азимут: ${form.azimuth}`,
      form.course && `Курс: ${form.course}`,
      form.distance && `Відстань: ${form.distance}`,
      form.height && `Висота: ${form.height}`,
      form.detectionMethods.length &&
        `Вияв: ${form.detectionMethods.join(", ")}`,
      form.result && `Результат: ${form.result}`,
      form.description && `Опис: ${form.description}`,
      form.additionalInfo && `Додаткова інфа: ${form.additionalInfo}`,
    ]
      .filter(Boolean)
      .join("\n");
    return items;
  };

  return (
    <div style={iosContainer}>
      {showTopFields && (
        <div style={iosCard}>
          {/* Сектор */}
          <div>
            <label style={iosLabel}>Сектор</label>
            <input
              style={iosInput}
              name="sector"
              value={form.sector}
              onChange={handleChange}
            />
          </div>
          {/* Підрозділ */}
          <div>
            <label style={iosLabel}>Підрозділ</label>
            <input
              style={iosInput}
              name="subdivision"
              value={form.subdivision}
              onChange={handleChange}
            />
          </div>
          {/* Позиція */}
          <div>
            <label style={iosLabel}>Позиція</label>
            <input
              style={iosInput}
              name="position"
              value={form.position}
              onChange={handleChange}
            />
          </div>
          {/* Населений пункт */}
          <div>
            <label style={iosLabel}>Нас. пункт</label>
            <input
              style={iosInput}
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <button style={iosButton} onClick={() => setShowTopFields(false)}>
            Приховати поля
          </button>
        </div>
      )}
      {!showTopFields && (
        <button style={iosButton} onClick={() => setShowTopFields(true)}>
          Показати поля
        </button>
      )}

      <div style={iosCard}>
        {/* Цілі */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Ціль</label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {[
              "КР (Крилата Ракета)",
              "ЛМ (Літак Малий)",
              "Б (БПЛА)",
              "Г (Гелікоптер)",
              "К (Квадрокоптер)",
              "ЛВ (Літак Великий)",
              "Постріли",
              "З (Зонд)",
              "Вибухи",
              "Виходи",
            ].map((goal) => (
              <button
                key={goal}
                style={{
                  ...iosButton,
                  background: form.selectedGoals.includes(goal)
                    ? "#32D74B"
                    : "#3A3A3C",
                  color: form.selectedGoals.includes(goal)
                    ? "#FFFFFF"
                    : "#FFFFFF",
                }}
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Сторона */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Сторона</label>
          <div style={{ display: "flex" }}>
            {["Ворожий", "Свій", "Нейтральний"].map((s) => (
              <button
                key={s}
                style={{
                  ...iosButton,
                  background: form.side === s ? "#32D74B" : "#3A3A3C",
                  color: form.side === s ? "#FFFFFF" : "#FFFFFF",
                }}
                onClick={() => toggleSide(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Номер цілі */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>№ цілі</label>
          <input
            style={iosInput}
            name="targetNumber"
            type="number"
            value={form.targetNumber}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        {/* Без видачі */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>
            <input
              type="checkbox"
              name="noIssue"
              checked={form.noIssue}
              onChange={handleChange}
            />{" "}
            Без видачі
          </label>
        </div>

        {/* Назва */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Назва</label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["Shahed-136", "Гербера", "Невстановлений"].map((n) => (
              <button
                key={n}
                style={{
                  ...iosButton,
                  background: form.name === n ? "#0A84FF" : "#3A3A3C",
                  color: form.name === n ? "#FFFFFF" : "#FFFFFF",
                }}
                onClick={() => toggleName(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Кількість */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Кількість</label>
          <input
            style={iosInput}
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        {/* Азимут */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Азимут</label>
          <input
            style={iosInput}
            name="azimuth"
            value={form.azimuth}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        {/* Курс */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Курс</label>
          <input
            style={iosInput}
            name="course"
            value={form.course}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        {/* Відстань */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Відстань</label>
          <input
            style={iosInput}
            name="distance"
            value={form.distance}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        {/* Висота */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Висота</label>
          <input
            style={iosInput}
            name="height"
            value={form.height}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        {/* Вияв */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Вияв</label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["Акустично", "Радіолокаційно", "Візуально", "З приладами"].map(
              (m) => (
                <button
                  key={m}
                  style={{
                    ...iosButton,
                    background: form.detectionMethods.includes(m)
                      ? "#32D74B"
                      : "#3A3A3C",
                    color: form.detectionMethods.includes(m)
                      ? "#FFFFFF"
                      : "#FFFFFF",
                  }}
                  onClick={() => toggleDetection(m)}
                >
                  {m}
                </button>
              )
            )}
          </div>
        </div>

        {/* Результат */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Результат</label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {["Виявлено", "Обстріляно", "Уражено"].map((r) => (
              <button
                key={r}
                style={{
                  ...iosButton,
                  background: form.result === r ? "#0A84FF" : "#3A3A3C",
                  color: form.result === r ? "#FFFFFF" : "#FFFFFF",
                }}
                onClick={() => toggleResult(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Опис */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Опис</label>
          <textarea
            style={{ ...iosInput, height: "4rem" }}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Додаткова інфа */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={iosLabel}>Додаткова інфа</label>
          <input
            style={iosInput}
            name="additionalInfo"
            value={form.additionalInfo}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Блок звіту */}
      <div style={iosCard}>
        <label style={iosLabel}>Звіт</label>
        <pre style={{ ...iosInput, whiteSpace: "pre-wrap" }}>
          {generateReportText()}
        </pre>
        <div style={{ display: "flex" }}>
          <button
            style={iosButton}
            onClick={() => {
              navigator.clipboard.writeText(generateReportText());
            }}
          >
            Копіювати
          </button>
          <button
            style={iosButton}
            onClick={() => {
              window.open(
                `whatsapp://send?text=${encodeURIComponent(
                  generateReportText()
                )}`
              );
            }}
          >
            Відкрити WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// ——— Стили iOS ———
const iosContainer = {
  fontFamily: systemFont,
  backgroundColor: "#1C1C1E",
  minHeight: "100vh",
  padding: "1rem",
  boxSizing: "border-box",
};
const iosCard = {
  backgroundColor: "rgba(28,28,30,0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "1rem",
  marginBottom: "1rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};
const iosLabel = { fontSize: "0.9rem", marginBottom: "0.3rem", color: "#FFFFFF" };
const iosInput = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#2C2C2E",
  fontSize: "1rem",
  color: "#FFFFFF",
  marginBottom: "0.6rem",
};
const iosButton = {
  flex: 1,
  padding: "0.6rem",
  borderRadius: "12px",
  border: "none",
  fontSize: "1rem",
  color: "#FFFFFF",
  background: "#0A84FF",
  margin: "0.3rem",
  cursor: "pointer",
};

