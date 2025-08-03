import { useState, useEffect } from "react";

export default function Home() {
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
  });

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

  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [ammoList, setAmmoList] = useState([]);
  const [ammoQuantities, setAmmoQuantities] = useState({});

  const goalsList = [
    "БПЛА", "Постріли(ЗУ,кулемет)", "Виходи(ПЗРК,ЗРК)", "Вибух", "КР",
    "Гелікоптер", "Літак малий", "Літак великий", "Квадрокоптер", "Зонд",
    "Інше (деталі в описі)"
  ];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];
  const ammoCalibers = {
    "АКМ": "7.62×39мм", "АКС-74У": "5.45×39мм", "АК-74": "5.45×39мм",
    "Grot": "5.56×45мм", "CZ BREN 2": "5.56×45мм", "Спарка Максим": "7.62×54мм",
    "РПК-74": "5.45×39мм", "РПКЛ": "7.62×39мм", "ДП-27": "7.62×54мм",
    "ДШК": "12.7×108мм", "ДШКМ": "12.7×108мм", "ПКТ": "7.62×54мм",
    "ПКМ": "7.62×54мм", "КПВТ": "14.5×114мм", "MG-42": "7.62×51мм"
  };

  const updateTime = () => {
    const now = new Date();
    setForm(f => ({
      ...f,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    }));
  };
  useEffect(updateTime, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (locks[name]) return;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(f => ({ ...f, [name]: false }));
  };

  const toggleLock = field => setLocks(l => ({ ...l, [field]: !l[field] }));
  const isEmpty = field => !form[field]?.trim();

  const toggleGoal = g => {
    setForm(f => {
      const exists = f.selectedGoals.includes(g);
      const newGoals = exists
        ? f.selectedGoals.filter(x => x !== g)
        : [...f.selectedGoals, g];
      return {
        ...f,
        selectedGoals: newGoals,
        name: newGoals.includes("БПЛА") ? f.name : null
      };
    });
  };
  const resetGoals = () => setForm(f => ({ ...f, selectedGoals: [], name: null }));

  const selectSide = s => setForm(f => ({ ...f, side: f.side === s ? null : s }));

  const selectName = n => {
    if (!form.selectedGoals.includes("БПЛА")) return;
    setForm(f => ({ ...f, name: n }));
  };

  const changeQuantity = d => {
    let q = form.quantity + d;
    if (q < 1) q = 1;
    setForm(f => ({ ...f, quantity: q }));
  };

  const handleTargetNumberChange = e => {
    setForm(f => ({ ...f, targetNumber: e.target.value }));
    setErrors(f => ({ ...f, targetNumber: false }));
  };

  const toggleNoIssue = () => {
    setForm(f => ({
      ...f,
      noIssue: !f.noIssue,
      targetNumber: f.noIssue ? f.targetNumber : ""
    }));
    setErrors(f => ({ ...f, targetNumber: false }));
  };

  useEffect(() => {
    setErrors(f => ({
      ...f,
      targetNumber: !(form.noIssue || form.targetNumber.trim() !== "")
    }));
  }, [form.noIssue, form.targetNumber]);

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

  const copyToClipboard = () => {
    const txt = [
      form.sector || form.subdivision || form.position
        ? `П: ${[form.sector, form.subdivision, form.position].filter(Boolean).join(", ")}`
        : null,
      form.selectedGoals.length ? `Ціль: ${form.selectedGoals.join(", ")}` : null,
      form.side ? `Сторона: ${form.side}` : null,
      !form.noIssue && form.targetNumber
        ? `Номер цілі: ${form.targetNumber}`
        : form.noIssue
        ? `Номер цілі: Без видачі`
        : null,
      form.name ? `Назва: ${form.name}` : null,
      form.quantity ? `Кількість: ${form.quantity} од.` : null,
      form.azimuth ? `А: ${form.azimuth}°` : null,
      form.course ? `К: ${form.course}°` : null,
      form.distance ? `Відстань: ${form.distance} м` : null,
      form.height ? `Висота: ${form.height} м` : null,
      form.location ? `НП: ${form.location}` : null,
      form.time ? `Час: ${form.time}` : null,
      form.detectionMethods.length
        ? `Вияв: ${form.detectionMethods.join(", ")}`
        : null,
      form.result ? `ПП: ${form.result}` : null,
      form.description ? `Опис: ${form.description}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(txt);
    alert("Скопійовано!");
    return txt;
  };

  const openWhatsApp = () => {
    const txt = [
      form.sector || form.subdivision || form.position
        ? `П: ${[form.sector, form.subdivision, form.position].filter(Boolean).join(", ")}`
        : null,
      form.selectedGoals.length ? `Ціль: ${form.selectedGoals.join(", ")}` : null,
      form.side ? `Сторона: ${form.side}` : null,
      !form.noIssue && form.targetNumber
        ? `Номер цілі: ${form.targetNumber}`
        : form.noIssue
        ? `Номер цілі: Без видачі`
        : null,
      form.name ? `Назва: ${form.name}` : null,
      form.quantity ? `Кількість: ${form.quantity} од.` : null,
      form.azimuth ? `А: ${form.azimuth}°` : null,
      form.course ? `К: ${form.course}°` : null,
      form.distance ? `Відстань: ${form.distance} м` : null,
      form.height ? `Висота: ${form.height} м` : null,
      form.location ? `НП: ${form.location}` : null,
      form.time ? `Час: ${form.time}` : null,
      form.detectionMethods.length
        ? `Вияв: ${form.detectionMethods.join(", ")}`
        : null,
      form.result ? `ПП: ${form.result}` : null,
      form.description ? `Опис: ${form.description}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(txt);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };
    return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #2c5364,#203a43,#0f2027)",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem"
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "1rem" }}>
          Доповідь
        </h1>

        {/* Сектор / Підрозділ / Позиція */}
        {["sector", "subdivision", "position"].map(key => (
          <div key={key} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              name={key}
              placeholder={key === "sector" ? "Сектор" : key === "subdivision" ? "Підрозділ" : "Позиція"}
              value={form[key]}
              onChange={handleChange}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "1px solid #999",
                color: "#fff",
                fontSize: "1.1rem",
                padding: "0.5rem 0"
              }}
            />
          </div>
        ))}

        {/* Цілі */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Ціль</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.3rem" }}>
            {goalsList.map(g => (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
                style={{
                  padding: "0.4rem 0.6rem",
                  backgroundColor: form.selectedGoals.includes(g) ? "#4caf50" : "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Кількість */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Кількість</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.3rem" }}>
            <button
              onClick={() => changeQuantity(-1)}
              style={{
                ...buttonStyle,
                backgroundColor: "#a94442"
              }}
            >
              –1
            </button>
            <span style={{ fontSize: "1.2rem" }}>{form.quantity}</span>
            <button
              onClick={() => changeQuantity(1)}
              style={{
                ...buttonStyle,
                backgroundColor: "#4caf50"
              }}
            >
              +1
            </button>
          </div>
        </div>

        {/* Назва цілі */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Назва цілі</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.3rem" }}>
            {namesList.map(name => (
              <button
                key={name}
                onClick={() => selectName(name)}
                style={{
                  padding: "0.4rem 0.6rem",
                  backgroundColor: form.name === name ? "#4caf50" : "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        {/* Курс / Азимут / Відстань / Висота */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Курс</label>
          <input
            type="text"
            name="course"
            value={form.course}
            onChange={onCourseChange}
            placeholder="°"
            style={inputStyle()}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Азимут</label>
          <input
            type="text"
            name="azimuth"
            value={form.azimuth}
            onChange={onAzimuthChange}
            placeholder="°"
            style={inputStyle()}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Відстань (м)</label>
          <input
            type="text"
            name="distance"
            value={form.distance}
            onChange={onDistanceChange}
            style={inputStyle()}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Висота (м)</label>
          <input
            type="text"
            name="height"
            value={form.height}
            onChange={onHeightChange}
            style={inputStyle()}
          />
        </div>

        {/* Вияв */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Вияв</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.3rem" }}>
            {["Акустично", "Радіолокаційно", "Візуально", "Із застосуванням приладів спостереження"].map(m => (
              <button
                key={m}
                onClick={() =>
                  setForm(f => ({
                    ...f,
                    detectionMethods: f.detectionMethods.includes(m)
                      ? f.detectionMethods.filter(x => x !== m)
                      : [...f.detectionMethods, m]
                  }))
                }
                style={{
                  padding: "0.4rem 0.6rem",
                  backgroundColor: form.detectionMethods.includes(m) ? "#4caf50" : "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Час */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Час</label>
          <input
            type="text"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="HH:MM"
            style={inputStyle()}
          />
        </div>

        {/* Опис */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Опис</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Інше про ціль"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid #999",
              color: "#fff",
              fontSize: "1rem",
              padding: "0.5rem",
              borderRadius: "6px"
            }}
          />
        </div>

        {/* Звіт */}
        <div
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            padding: "1rem",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            marginBottom: "1rem"
          }}
        >
          {[
            form.sector || form.subdivision || form.position
              ? `П: ${[form.sector, form.subdivision, form.position].filter(Boolean).join(", ")}`
              : null,
            form.selectedGoals.length ? `Ціль: ${form.selectedGoals.join(", ")}` : null,
            form.side ? `Сторона: ${form.side}` : null,
            !form.noIssue && form.targetNumber
              ? `Номер цілі: ${form.targetNumber}`
              : form.noIssue
              ? `Номер цілі: Без видачі`
              : null,
            form.name ? `Назва: ${form.name}` : null,
            form.quantity ? `Кількість: ${form.quantity} од.` : null,
            form.azimuth ? `А: ${form.azimuth}°` : null,
            form.course ? `К: ${form.course}°` : null,
            form.distance ? `Відстань: ${form.distance} м` : null,
            form.height ? `Висота: ${form.height} м` : null,
            form.location ? `НП: ${form.location}` : null,
            form.time ? `Час: ${form.time}` : null,
            form.detectionMethods.length ? `Вияв: ${form.detectionMethods.join(", ")}` : null,
            form.result ? `ПП: ${form.result}` : null,
            form.description ? `Опис: ${form.description}` : null
          ]
            .filter(Boolean)
            .join("\n")}
        </div>

        {/* Дії */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={copyToClipboard} style={{ ...buttonStyle, flex: 1, backgroundColor: "#1e90ff" }}>
            Копіювати
          </button>
          <button onClick={openWhatsApp} style={{ ...buttonStyle, flex: 1, backgroundColor: "#25d366" }}>
            Відкрити WhatsApp
          </button>
        </div>
        {/* Модалка вибору зброї */}
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
              zIndex: 999
            }}
          >
            <div
              style={{
                backgroundColor: "#222",
                padding: "1rem",
                borderRadius: "8px",
                maxWidth: "90%",
                width: 320
              }}
            >
              <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>Вибір зброї</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {Object.keys(ammoCalibers).map(w => (
                  <button
                    key={w}
                    onClick={() => {
                      setAmmoList(l => (l.includes(w) ? l : [...l, w]));
                      setShowWeaponModal(false);
                    }}
                    style={{
                      ...buttonStyle,
                      backgroundColor: ammoList.includes(w) ? "#4caf50" : "#666"
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowWeaponModal(false)}
                style={{
                  marginTop: "0.8rem",
                  ...buttonStyle,
                  backgroundColor: "#1e90ff",
                  width: "100%"
                }}
              >
                Закрити
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
