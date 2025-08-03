// pages/index.js
import { useState, useEffect } from "react";

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
  });

  // ——— Какие поля сохранять ———
  const persistKeys = ["sector", "subdivision", "position", "location"];

  // ——— Блокировки ———
  const [locks, setLocks] = useState({
    sector: false,
    subdivision: false,
    position: false,
    location: false,
  });

  // ——— Ошибки валидации ———
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

  // ——— Модалка выбора оружия ———
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [ammoList, setAmmoList] = useState([]);
  const [ammoQuantities, setAmmoQuantities] = useState({});

  // ——— Списки справочников ———
  const goalsList = [
    "БПЛА",
    "Постріли(ЗУ,кулемет)",
    "Виходи(ПЗРК,ЗРК)",
    "Вибух",
    "КР",
    "Гелікоптер",
    "Літак малий",
    "Літак великий",
    "Квадрокоптер",
    "Зонд",
    "Інше (деталі в описі)",
  ];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];
  const ammoCalibers = {
    АКМ: "7.62×39мм",
    "АКС-74У": "5.45×39мм",
    "АК-74": "5.45×39мм",
    Grot: "5.56×45мм",
    "CZ BREN 2": "5.56×45мм",
    "Спарка Максим": "7.62×54мм",
    "РПК-74": "5.45×39мм",
    РПКЛ: "7.62×39мм",
    "ДП-27": "7.62×54мм",
    ДШК: "12.7×108мм",
    ДШКМ: "12.7×108мм",
    ПКТ: "7.62×54мм",
    ПКМ: "7.62×54мм",
    КПВТ: "14.5×114мм",
    "MG-42": "7.62×51мм",
  };

  // ——— Таймер ———
  const updateTime = () => {
    const now = new Date();
    setForm(f => ({
      ...f,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`,
    }));
  };
  useEffect(updateTime, []);

  // ——— При старте читаем сохранённые поля ———
  useEffect(() => {
    const saved: Partial<typeof form> = {};
    persistKeys.forEach(key => {
      const v = localStorage.getItem(`report_${key}`);
      if (v != null) saved[key] = v;
    });
    if (Object.keys(saved).length) {
      setForm(f => ({ ...f, ...saved }));
    }
  }, []);

  // ——— Общие хендлеры ———
  const handleChange = e => {
    const { name, value } = e.target;
    if (locks[name]) return;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(f => ({ ...f, [name]: false }));

    // ——— сохраняем в localStorage для первых четырёх полей
    if (persistKeys.includes(name)) {
      localStorage.setItem(`report_${name}`, value);
    }
  };
  const toggleLock = field => setLocks(l => ({ ...l, [field]: !l[field] }));
  const isEmpty = field => !form[field]?.trim();

  // ——— Цели ———
  const toggleGoal = g =>
    setForm(f => {
      const exists = f.selectedGoals.includes(g);
      const newGoals = exists
        ? f.selectedGoals.filter(x => x !== g)
        : [...f.selectedGoals, g];
      return { ...f, selectedGoals: newGoals, name: newGoals.includes("БПЛА") ? f.name : null };
    });
  const resetGoals = () => setForm(f => ({ ...f, selectedGoals: [], name: null }));

  // ——— Сторона ———
  const selectSide = s => setForm(f => ({ ...f, side: f.side === s ? null : s }));

  // ——— Назва ———
  const selectName = n => {
    if (!form.selectedGoals.includes("БПЛА")) return;
    setForm(f => ({ ...f, name: n }));
  };

  // ——— Кількість ———
  const changeQuantity = d => {
    let q = form.quantity + d;
    if (q < 1) q = 1;
    setForm(f => ({ ...f, quantity: q }));
  };

  // ——— Номер цілі ———
  const handleTargetNumberChange = e => {
    setForm(f => ({ ...f, targetNumber: e.target.value }));
    setErrors(f => ({ ...f, targetNumber: false }));
  };
  const toggleNoIssue = () => {
    setForm(f => ({
      ...f,
      noIssue: !f.noIssue,
      targetNumber: f.noIssue ? f.targetNumber : "",
    }));
    setErrors(f => ({ ...f, targetNumber: false }));
  };
  useEffect(() => {
    setErrors(f => ({
      ...f,
      targetNumber: !(form.noIssue || form.targetNumber.trim() !== ""),
    }));
  }, [form.noIssue, form.targetNumber]);

  // ——— Валидации ———
  const validateAzimuth = v => /^\d{1,3}$/.test(v) && +v <= 359;
  const validateCourse = v => /^\d{1,3}$/.test(v) && +v <= 359;
  const validateDistance = v => /^\d+$/.test(v) && +v > 0;
  const validateHeight = v => /^\d+$/.test(v);

  const onAzimuthChange = e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 3);
    setForm(f => ({ ...f, azimuth: v }));
    setErrors(f => ({ ...f, azimuth: !validateAzimuth(v) }));
  };
  const onCourseChange = e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 3);
    setForm(f => ({ ...f, course: v }));
    setErrors(f => ({ ...f, course: !validateCourse(v) }));
  };
  const onDistanceChange = e => {
    let v = e.target.value.replace(/\D/g, "");
    setForm(f => ({ ...f, distance: v }));
    setErrors(f => ({ ...f, distance: !validateDistance(v) }));
  };
  const changeDistance = d => {
    let x = +form.distance || 0;
    x += d;
    if (x < 0) x = 0;
    setForm(f => ({ ...f, distance: String(x) }));
    setErrors(f => ({ ...f, distance: !validateDistance(String(x)) }));
  };
  const onHeightChange = e => {
    let v = e.target.value.replace(/\D/g, "");
    setForm(f => ({ ...f, height: v }));
    setErrors(f => ({ ...f, height: !validateHeight(v) }));
  };
  const changeHeight = d => {
    let h = +form.height || 0;
    h += d;
    if (h < 0) h = 0;
    setForm(f => ({ ...f, height: String(h) }));
    setErrors(f => ({ ...f, height: !validateHeight(String(h)) }));
  };

  // ——— Время ———
  const changeTimeByMinutes = d => {
    const [H, M] = form.time.split(":").map(Number);
    let total = H * 60 + M + d;
    if (total < 0) total = 0;
    if (total > 24 * 60 - 1) total = 24 * 60 - 1;
    const hh = String(Math.floor(total / 60)).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");
    setForm(f => ({ ...f, time: `${hh}:${mm}` }));
  };
  const setTimeNow = () => updateTime();

  // ——— Копировать/WhatsApp ———
  const copyToClipboard = () => {
    const txt = `
Сектор: ${form.sector}
Підрозділ: ${form.subdivision}
Позиція: ${form.position}
Населений пункт: ${form.location}
Ціль: ${form.selectedGoals.join(", ")}
Сторона: ${form.side || ""}
Номер цілі: ${form.noIssue ? "Без видачі" : form.targetNumber}
Назва: ${form.name || ""}
Кількість: ${form.quantity} од.
Азимут: ${form.azimuth ? form.azimuth + "°" : ""}
Курс: ${form.course ? form.course + "°" : ""}
Відстань: ${form.distance ? form.distance + " м" : ""}
Висота: ${form.height ? form.height + " м" : ""}
Результат: ${form.result || ""}
Опис: ${form.description}
Час: ${form.time}
    `.trim();
    navigator.clipboard.writeText(txt);
    alert("Скопійовано!");
  };
  const openWhatsApp = () => {
    const txt = encodeURIComponent(copyToClipboard());
    window.open(`https://wa.me/?text=${txt}`, "_blank");
  };

  // ——— Стили ———
  const inputStyle = locked => ({
    flexGrow: 1,
    padding: "0.5rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: locked ? "inherit" : "#444",
    color: locked ? "#ccc" : "#fff",
    fontSize: "1rem",
    cursor: locked ? "not-allowed" : "text",
  });
  const buttonStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    backgroundColor: "#666",
    color: "#fff",
  };
  const blockMargin = { marginBottom: "0.3rem" };
  const errorStyle = {
    color: "#ff6666",
    fontSize: "0.75rem",
    marginTop: "0.1rem",
    marginBottom: "0.3rem",
  };
  const labelStyle = {
    fontSize: "0.9rem",
    marginBottom: "0.2rem",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #2c5364,#203a43,#0f2027)",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* … остальная разметка без изменений … */}
        {/* Ниже пример первого блока, остальные аналогично */}
        {/* Сектор / Підрозділ / Позиція / Нас. пункт */}
        {[
          { key: "sector", label: "Сектор*" },
          { key: "subdivision", label: "Підрозділ*" },
          { key: "position", label: "Позиція*" },
          { key: "location", label: "Населений пункт*" },
        ].map(({ key, label }) => (
          <div key={key} style={blockMargin}>
            <div style={labelStyle}>{label}</div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                disabled={locks[key]}
                style={inputStyle(locks[key])}
              />
              <button
                onClick={() => toggleLock(key)}
                style={{
                  ...buttonStyle,
                  backgroundColor: locks[key] ? "#a94442" : "#4caf50",
                }}
              >
                {locks[key] ? "Заблоковано" : "Редагувати"}
              </button>
            </div>
            {isEmpty(key) && <div style={errorStyle}>Поле має бути заповненим</div>}
          </div>
        ))}

        {/* … остальные блоки формы … */}

        {/* Действия */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button onClick={copyToClipboard} style={{ ...buttonStyle, flex: 1, backgroundColor: "#1e90ff" }}>
            Копіювати
          </button>
          <button onClick={openWhatsApp} style={{ ...buttonStyle, flex: 1, backgroundColor: "#25d366" }}>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Модалка оружия */}
      {showWeaponModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* … код модалки без изменений … */}
        </div>
      )}
    </div>
  );
}
