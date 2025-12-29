import { useState, useEffect } from "react";

const systemFont = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;

export default function Home() {
  // ——— Тема с сохранением ———
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const themeLS = localStorage.getItem("theme");
      if (themeLS === "dark") setIsDark(true);
      if (themeLS === "light") setIsDark(false);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.body.style.background = isDark ? "#17181c" : "#F2F2F7";
    }
  }, [isDark]);

  // ——— Состояния формы ———
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
    ammo: {}, 
  });
  const [showTopFields, setShowTopFields] = useState(true);
  const [locks, setLocks] = useState({
    sector: false,
    subdivision: false,
    position: false,
    location: false,
  });
  const [errors, setErrors] = useState({});

  // ——— Списки ———
  const goalsList = [
    "БПЛА", "Постріли", "Виходи(ПЗРК,ЗРК)", "Вибух", "КР",
    "Гелікоптер", "Літак М.", "Літак В.", "Квадрокоптер", "Зонд", "Інше (деталі в описі)"
  ];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];

  // ——— Время ———
  const updateTime = () => {
    const now = new Date();
    setForm(f => ({
      ...f,
      time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
    }));
  };

  useEffect(updateTime, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("show_top_fields");
      if (saved !== null) setShowTopFields(saved === "true");
      const l = localStorage.getItem("report_locks");
      if (l) setLocks(JSON.parse(l));
      ["sector", "subdivision", "position", "location"].forEach(key => {
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
    if (["sector", "subdivision", "position", "location"].includes(name)) {
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

  // ——— Числовые поля ———
  const validateCourse = (v) => /^\d{1,3}$/.test(v) && +v >= 0 && +v <= 359;
  const onCourseChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setForm((f) => ({ ...f, course: value }));
  };
  const validateAzimuth = (v) => /^\d{1,3}$/.test(v) && +v >= 0 && +v <= 359;
  const onAzimuthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setForm((f) => ({ ...f, azimuth: value }));
  };

  const validateDistance = v => /^\d+$/.test(v) && +v > 0 && +v < 100000;
  const onDistanceChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, distance: v }));
    setErrors((errs) => ({ ...errs, distance: !validateDistance(v) }));
  };
  const changeDistance = (d) => {
    let x = +form.distance || 0;
    x += d;
    if (x < 0) x = 0;
    setForm(f => ({ ...f, distance: String(x) }));
    setErrors(f => ({ ...f, distance: !validateDistance(String(x)) }));
  };

  const validateHeight = v => /^\d+$/.test(v) && +v >= 0 && +v < 30000;
  const onHeightChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, height: v }));
    setErrors((errs) => ({ ...errs, height: !validateHeight(v) }));
  };
  const changeHeight = (d) => {
    let h = +form.height || 0;
    h += d;
    if (h < 0) h = 0;
    setForm(f => ({ ...f, height: String(h) }));
    setErrors(f => ({ ...f, height: !validateHeight(String(h)) }));
  };

  // ——— Валидация по полю ———
  const onFieldNumeric = (field, max) => e => {
    const v = e.target.value.replace(/\D/g, "").slice(0, max ? String(max).length : undefined);
    setForm(f => ({ ...f, [field]: v }));
  };

  // ——— Детекция ———
  const toggleDetection = m => setForm(f => ({
    ...f,
    detectionMethods: f.detectionMethods.includes(m)
      ? f.detectionMethods.filter(x => x !== m)
      : [...f.detectionMethods, m]
  }));

  // ——— Копирование и WhatsApp ———
  const copyReport = () => {
    const text = generateReportText().replace(/\n/g, "\r\n");
    navigator.clipboard.writeText(text);
    alert("Скопійовано!");
  };
  const openWhatsApp = () => {
    window.location.href = `whatsapp://send?text=${encodeURIComponent(generateReportText())}`;
  };

  // ——— Список оружия (вынеси вверх, чтобы не пересоздавался) ———
const ammoList = [
  "АКС-74У - 5.45х39мм","АКМ - 7.62х39мм","АК-74 - 5.45х39мм",
  "Спарка Максим - 7.62x54мм","Набій 14,5х114мм (ЗПУ,КПВТ) Б-32","Набій 14,5х114мм (ЗПУ,КПВТ) БЗТ",
  "РПК-74 - 5.45х39мм","РПКЛ - 7.62х39мм","ДП-27 - 7.62x54мм",
  "ДШК - 12.7х108мм","ДШКМ - 12.7х108мм","ПКТ - 7.62x54мм",
  "ПКM - 7.62x54мм","КПВТ - 14.5x114мм","MG-42 - 7.62х51мм",
  "MG3 - 7.62х51мм","CANiK M2 - 12.7х99мм","Browning M2 - 12.7х99мм",
  "НСВ - 12.7х108мм","ЗПУ-2 - 14.5x114мм","FN MAG - 7.62х51мм",
  "FN MINIMI - 5.56х45мм","ЗУ 23-2 - 23х152мм","АЗГ М-75 - 20x110мм",
  "АЗГ-57 - 57мм","Bofors L70 - 40мм","Gepard 1A2 - 35х228мм",
  "Тунгуска гармата - 30мм","ЗКР Ігла-C","НДЖ Ігла-C","ЗКР Ігла-1",
  "НДЖ Ігла-1","ЗКР Стріла-2","НДЖ Стріла-2","ЗКР Стріла-2М",
  "НДЖ Стріла-2М","ЗКР Стріла-3","НДЖ Стріла-3","ЗКР Stinger",
  "НДЖ Stinger","ЗКР Piorun","НДЖ Piorun","Тунгуска ЗКР - ЗКР 9M311",
  "ЗРК DASH - ракета AGM-114L"
];

// ——— Для модалки выбора оружия ———
const [showAmmoModal, setShowAmmoModal] = useState(false);

// ——— Для расхода боекомплекта ———
useEffect(() => {
  if (typeof window !== "undefined") {
    const savedAmmo = localStorage.getItem("akviz_ammo");
    if (savedAmmo) setForm(f => ({...f, ammo: JSON.parse(savedAmmo)}));
  }
}, []);
const saveAmmo = (ammoObj) => {
  localStorage.setItem("akviz_ammo", JSON.stringify(ammoObj));
};

const generateReportText = () => {
  const {
    sector, subdivision, position, location, time,
    selectedGoals, side, targetNumber, noIssue, name,
    quantity, azimuth, course, distance, height,
    detectionMethods, result, description, ammo
  } = form;

  // Функція: тільки калибр
  function extractCaliber(name) {
    const parts = name.split("-");
    if (parts.length > 1) return parts[parts.length - 1].trim();
    return name.trim();
  }

  // Функція: повна назва без калибра
  function extractWeaponName(name) {
    const parts = name.split(" - ");
    if (parts.length > 1) {
      return parts.slice(0, -1).join(" - ").trim();
    }
    return name.trim();
  }

  // Витрата БК (тільки калибр)
  const ammoString = (ammo && Object.keys(ammo).length)
    ? 'Витрата БК: ' +
      Object.entries(ammo)
        .filter(([_, qty]) => qty && Number(qty) > 0)
        .map(([name, qty]) => `${extractCaliber(name)} - ${qty} шт.`)
        .join(', ')
    : '';

  // ===== Для "Обстріляно" / "Уражено" =====
  if (result === "Обстріляно" || result === "Уражено") {
    // Номер цілі або "Без видачі"
    let targetNumText = null;
    if (noIssue) {
      targetNumText = "Без видачі";
    } else if (targetNumber) {
      targetNumText = `№${targetNumber}`;
    }

    // 1-й рядок
    let firstLineArr = [
      sector ? `Сектор «${sector}»` : null,
      time ? time : null,
      targetNumText ? `- ${targetNumText}` : null,
      subdivision ? `- ${subdivision}` : null,
      position ? `(${position})` : null
    ];
    let firstLine = firstLineArr.filter(Boolean).join(", ");
    firstLine = firstLine.replace(/, -/g, "-").replace(/, \(/g, " (");

    // 2-й рядок
    const locationLine = location ? `в районі ${location}` : null;

    // 3-й рядок: зброя (повне ім’я без калибра) + параметри
    const usedWeapons = (ammo && Object.keys(ammo).length)
      ? Object.keys(ammo).map(extractWeaponName).join(", ")
      : null;
    const paramArr = [
      height ? `H-${height}` : null,
      distance ? `D-${distance}` : null,
      azimuth ? `A-${azimuth}` : null,
      course ? `K-${course}` : null
    ].filter(Boolean);
    let thirdLine = null;
    if (usedWeapons) {
      thirdLine = `з ${usedWeapons}${paramArr.length ? " (" + paramArr.join(", ") + ")" : ""}`;
    }

    // 4-й рядок
    let fourthLine = [
      result,
      selectedGoals.length ? selectedGoals.join(", ") : null,
      name ? name : null
    ].filter(Boolean).join(" ") + ".";

    return [
      firstLine,
      locationLine,
      thirdLine,
      fourthLine,
      ammoString
    ].filter(Boolean).join("\n");
  }

  // ===== Для всіх інших випадків =====
  const allowedGoals = [
    "БПЛА", "Вибух", "КР", "Гелікоптер",
    "Літак Малий", "Літак Великий", "Квадрокоптер", "Зонд"
  ];

  const goalsForReport = selectedGoals.map(goal => {
    if (goal === "БПЛА" && name) {
      return `БПЛА (${name})`;
    }
    return goal;
  });

  const hasAllowedGoal = selectedGoals.some(goal =>
    allowedGoals.includes(goal)
  );

  return [
    sector || subdivision || position
      ? `П: ${[sector, subdivision, position].filter(Boolean).join(", ")}`
      : null,
    `Ціль: ${[
      ...goalsForReport,
      side,
      noIssue ? "Без видачі" : (targetNumber ? `${targetNumber}` : "")
    ].filter(Boolean).join(", ")}`,
    height ? `Висота: ${height} м` : null,
    distance ? `Відстань: ${distance} м` : null,
    hasAllowedGoal && quantity ? `Кількість: ${quantity} од.` : null,
    azimuth ? `А: ${azimuth}°` : null,
    course ? `К: ${course}°` : null,
    location ? `НП: ${location}` : null,
    time ? `Ч: ${time}` : null,
    detectionMethods.length ? `Вияв: ${detectionMethods.join(", ")}` : null,
    `ПП: ${result === null ? "Виявлено" : result}`,
    description ? `Опис: ${description}` : null
  ].filter(Boolean).join("\n");
};







  // ——— Темы ———
  const theme = {
    bg: isDark ? "#17181c" : "#F2F2F7",
    card: isDark ? "rgba(30,32,38,0.98)" : "#fff",
    label: isDark ? "#e3e3ea" : "#1C1C1E",
    inputBg: isDark ? "#23242a" : "#fff",
    inputText: isDark ? "#f7f7fb" : "#1C1C1E",
    inputBorder: isDark ? "#36374a" : "#cccccc",
    button: isDark ? "#272a34" : "#0A84FF",
    buttonText: isDark ? "#e5e6ea" : "#fff",
    secondary: isDark ? "#27272b" : "#EBEBF5",
    danger: "#FF375F",
    success: "#32D74B",
    shadow: isDark
      ? "0 2px 12px rgba(0,0,0,0.38)"
      : "0 4px 16px rgba(0,0,0,0.10)",
    border: isDark ? "#23242a" : "#ededed",
    textareaBg: isDark ? "#23242a" : "#fff",
    textareaText: isDark ? "#f7f7fb" : "#1C1C1E"
  };

  // ——— iOS Switch (большой) ———
  const Switch = (
  <button
    onClick={() => setIsDark(d => !d)}
    aria-label="Перемкнути тему"
    style={{
      position: "relative",
      width: 68,
      height: 42,
      borderRadius: 21,
      border: "none",
      outline: "none",
      background: isDark ? "#23242a" : "#e5e5ea",
      boxShadow: theme.shadow,
      cursor: "pointer",
      transition: "background .2s"
    }}
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: isDark ? "#0A84FF" : "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
        position: "absolute",
        top: "50%",
        left: isDark ? 31 : 5,
        transform: "translateY(-50%)",
        transition: "left .22s cubic-bezier(.47,1.64,.41,.8), background .2s"
      }}
    >
      <span
        style={{
          fontSize: 22,
          color: isDark ? "#ffe200" : "#b7b7b7",
          opacity: 1,
          transition: "color .2s"
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </span>
    </span>
  </button>
);



  // ——— Возврат JSX ———
  return (
    <div
      style={{
        fontFamily: systemFont,
        background: theme.bg,
        minHeight: "100vh",
        padding: "1rem",
        transition: "background 0.24s",
        boxSizing: "border-box"
      }}
    >
      {/* ——— Шапка с названием и переключателем темы ——— */}
      <div style={{
        ...cardStyle(theme),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{
          margin: 0,
          fontSize: "1.35rem",
          color: theme.label,
          fontWeight: 600
        }}>АкВіз 2.0</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {Switch}
        </div>
      </div>

      {/* ——— Кнопка скрыть/показать поля ——— */}
      <div style={{
        ...cardStyle(theme),
        display: "flex",
        justifyContent: "center",
        marginBottom: "1rem"
      }}>
        <button
          onClick={() => setShowTopFields(prev => !prev)}
          style={{
            ...buttonStyle(theme),
            background: theme.secondary,
            color: theme.label,
            fontWeight: 500,
            minWidth: 160
          }}
        >
          {showTopFields ? "Приховати поля" : "Показати поля"}
        </button>
      </div>

      {/* ——— Первые 4 поля ——— */}
      {showTopFields && (
        <div style={cardStyle(theme)}>
          {["Сектор", "Підрозділ", "Позиція", "Населений пункт"].map((fieldLabel, idx) => {
            const field = ["sector", "subdivision", "position", "location"][idx];
            const placeholderArr = [
              "Сектор Центр",
              "напр. ____ зрап, зрадн ___ омбр",
              "Наприклад МВГ Халк",
              "Наприклад м.Кривий Ріг,Дніпропетровська обл."
            ];
            return (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={labelStyle(theme)}>{fieldLabel}</label>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    style={inputStyle(theme)}
                    placeholder={placeholderArr[idx]}
                  />
                  <button
                    onClick={() => toggleLock(field)}
                    style={{
                      ...buttonStyle(theme),
                      background: locks[field] ? theme.danger : theme.secondary,
                      color: locks[field] ? "#fff" : theme.label,
                      minWidth: 44
                    }}
                  >
                    {locks[field] ? "🔒" : "✏️"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ——— Тип цілі ——— */}
      <div style={{
  ...cardStyle(theme),
  padding: "1rem 0.7rem",
  display: "flex",
  flexDirection: "column"
}}>
  <label style={{
    ...labelStyle(theme),
    marginLeft: "0.3rem",
    marginBottom: "0.8rem",
    fontSize: "1.07rem"
  }}>Ціль</label>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "0.65rem",
      width: "100%",
      alignItems: "stretch"
    }}
  >
    {goalsList.map((goal) => (
      <button
        key={goal}
        onClick={() => toggleGoal(goal)}
        style={{
          background: form.selectedGoals.includes(goal)
            ? theme.success
            : theme.secondary,
          color: form.selectedGoals.includes(goal)
            ? "#fff"
            : theme.label,
          fontWeight: form.selectedGoals.includes(goal) ? 600 : 500,
          border: "none",
          borderRadius: "14px",
          boxShadow: form.selectedGoals.includes(goal)
            ? "0 2px 8px rgba(50,215,75,0.14)"
            : theme.shadow,
          padding: "0.62rem 0.7rem",
          fontSize: "1.01rem",
          transition: "background .18s, color .18s, box-shadow .18s",
          cursor: "pointer",
          minWidth: 0,
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          // Растянуть кнопку "Інше..." на две колонки
          ...(goal === "Інше (деталі в описі)" ? { gridColumn: "span 2" } : {})
        }}
        title={goal}
      >
        {goal}
      </button>
    ))}
  </div>
</div>



      {/* ——— Сторона ——— */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Сторона</label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {["Ворожий", "Свій", "Нейтральний"].map(s => (
            <button
              key={s}
              onClick={() => selectSide(s)}
              style={{
                ...buttonStyle(theme),
                background: form.side === s ? theme.success : theme.secondary,
                color: form.side === s ? "#fff" : theme.label,
                fontWeight: form.side === s ? 600 : 500
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ——— Номер цілі ——— */}
     <div style={cardStyle(theme)}>
  <label style={labelStyle(theme)}>Номер цілі</label>
  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: 0 }}>
    {!form.noIssue && (
      <input
        type="text"
        name="targetNumber"
        value={form.targetNumber}
        onChange={onFieldNumeric("targetNumber", 9999)}
        placeholder="по цілі"
        inputMode="numeric"
        pattern="\d*"
        style={{
          ...inputStyle(theme),
          textAlign: "center",
          flex: 1,
          marginBottom: 0,
          height: 44,
          lineHeight: "44px",
          padding: "0 1.2rem",
          border: `1px solid ${theme.inputBorder}`,
          fontSize: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
          backgroundColor: theme.inputBg,
          verticalAlign: "middle",
        }}
      />
    )}
    <button
      onClick={() =>
        setForm(f => ({
          ...f,
          noIssue: !f.noIssue,
          targetNumber: "",
        }))
      }
      style={{
        ...buttonStyle(theme),
        backgroundColor: form.noIssue ? theme.danger : theme.secondary,
        color: form.noIssue ? "#fff" : theme.label,
        height: 44,
        minWidth: 128,
        marginBottom: 0,
        alignSelf: "center",
        padding: "0 1.2rem",
        fontSize: "1rem"
      }}
    >
      {form.noIssue ? "Видати номер" : "Без видачі"}
    </button>
  </div>
</div>




      {/* ——— Назва (БПЛА) ——— */}
      {form.selectedGoals.includes("БПЛА") && (
  <div style={{
    ...cardStyle(theme),
    padding: "1rem 0.7rem",
    display: "flex",
    flexDirection: "column"
  }}>
    <label style={{
      ...labelStyle(theme),
      marginLeft: "0.3rem",
      marginBottom: "0.8rem",
      fontSize: "1.07rem"
    }}>Назва</label>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "0.65rem",
        width: "100%",
        alignItems: "stretch"
      }}
    >
      {namesList.map((n) => (
        <button
          key={n}
          onClick={() => selectName(n)}
          style={{
            background: form.name === n ? theme.button : theme.secondary,
            color: form.name === n ? "#fff" : theme.label,
            fontWeight: form.name === n ? 600 : 500,
            border: "none",
            borderRadius: "14px",
            boxShadow: form.name === n
              ? "0 2px 8px rgba(10,132,255,0.14)"
              : theme.shadow,
            padding: "0.62rem 0.7rem",
            marginBottom: "0.02rem",
            fontSize: "1.01rem",
            transition: "background .18s, color .18s, box-shadow .18s",
            cursor: "pointer",
            minWidth: 0,
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          title={n}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
)}


      {/* ——— Кількість ——— */}
      <div style={cardStyle(theme)}>
  <label style={labelStyle(theme)}>Кількість</label>
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: 0
  }}>
    <input
      type="text" // ← чтобы не было стрелочек, только цифры!
      value={form.quantity}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          quantity: Math.max(1, +e.target.value.replace(/\D/g, "")),
        }))
      }
      inputMode="numeric"
      pattern="\d*"
      style={{
        ...inputStyle(theme),
        textAlign: "center",
        flex: 1,
        marginBottom: 0,
        height: 44,
        lineHeight: "44px",
        padding: "0 1.2rem",
        fontSize: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
        backgroundColor: theme.inputBg,
        verticalAlign: "middle",
      }}
    />
    <button
      onClick={() => changeQuantity(-1)}
      style={{
        ...buttonStyle(theme),
        backgroundColor: "#FF375F", // красная даже в светлой теме!
        color: "#fff",
        height: 44,
        lineHeight: "44px",
        minWidth: 44,
        marginBottom: 0,
        alignSelf: "center",
        fontSize: "1.1rem",
        padding: 0,
      }}
    >
      –
    </button>
    <button
      onClick={() => changeQuantity(1)}
      style={{
        ...buttonStyle(theme),
        backgroundColor: "#32D74B", // зелёная даже в светлой теме!
        color: "#fff",
        height: 44,
        lineHeight: "44px",
        minWidth: 44,
        marginBottom: 0,
        alignSelf: "center",
        fontSize: "1.1rem",
        padding: 0,
      }}
    >
      +
    </button>
  </div>
</div>



      {/* ——— Азимут и Курс ——— */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Азимут (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          name="azimuth"
          value={form.azimuth}
          onChange={onAzimuthChange}
          placeholder="Вкажіть азимут"
          style={{
            ...inputStyle(theme),
            border:
              form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)
                ? `1px solid ${theme.danger}`
                : `1px solid ${theme.inputBorder}`,
            marginBottom: "0.4rem"
          }}
        />
        {(form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)) && (
          <div style={{ color: theme.danger, fontSize: "0.82rem", marginBottom: "0.6rem" }}>
            Поле має бути заповненим!
          </div>
        )}

        <label style={labelStyle(theme)}>Курс (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          name="course"
          value={form.course}
          onChange={onCourseChange}
          placeholder="Вкажіть курс"
          style={{
            ...inputStyle(theme),
            border:
              form.course.trim() === "" || !validateCourse(form.course)
                ? `1px solid ${theme.danger}`
                : `1px solid ${theme.inputBorder}`,
          }}
        />
        {(form.course.trim() === "" || !validateCourse(form.course)) && (
          <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.35rem" }}>
            Поле має бути заповненим!
          </div>
        )}
      </div>

      {/* ——— Відстань и Висота ——— */}
      <div style={{
        border: "none",
        borderRadius: "16px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: theme.card,
        boxShadow: theme.shadow,
        transition: "background .23s"
      }}>
        {/* Відстань */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle(theme)}>Відстань, м*</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.distance}
            onChange={onDistanceChange}
            placeholder="Відстань до цілі"
            style={{
              ...inputStyle(theme),
              border: form.distance.trim() === "" || !validateDistance(form.distance)
                ? `1px solid ${theme.danger}`
                : `1px solid ${theme.inputBorder}`
            }}
          />
          {(form.distance.trim() === "" || !validateDistance(form.distance)) && (
            <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.2rem" }}>
              Поле має бути заповненим!
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+1000", "+5000", "-100", "-1000", "-5000"].map((label) => {
              const isNegative = label.startsWith("-");
              return (
                <button
                  key={label}
                  onClick={() => changeDistance(Number(label))}
                  style={{
                    ...buttonStyle(theme),
                    backgroundColor: isNegative ? theme.danger : theme.success,
                    color: "#fff",
                    padding: "0.4rem 0.5rem"
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Висота */}
        <div>
          <label style={labelStyle(theme)}>Висота, м*</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.height}
            onChange={onHeightChange}
            placeholder="Висота над рівнем"
            style={{
              ...inputStyle(theme),
              border: form.height.trim() === "" || !validateHeight(form.height)
                ? `1px solid ${theme.danger}`
                : `1px solid ${theme.inputBorder}`
            }}
          />
          {(form.height.trim() === "" || !validateHeight(form.height)) && (
            <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.2rem" }}>
              Поле має бути заповненим!
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+500", "-100", "-500"].map((label) => {
              const isNegative = label.startsWith("-");
              return (
                <button
                  key={label}
                  onClick={() => changeHeight(Number(label))}
                  style={{
                    ...buttonStyle(theme),
                    backgroundColor: isNegative ? theme.danger : theme.success,
                    color: "#fff",
                    padding: "0.4rem 0.5rem"
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* ——— Час ——— */}
<div style={cardStyle(theme)}>
  <label style={labelStyle(theme)}>Час</label>
  <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.7rem" }}>
    <input
      type="text"
      name="time"
      value={form.time}
      onChange={handleChange}
      style={{
        ...inputStyle(theme),
        flex: 1,
        marginBottom: 0,
        height: 44,
        lineHeight: "44px",
        textAlign: "center"
      }}
    />
  </div>
  {/* Кнопки Щойно, +1хв, -1хв */}
  <div style={{ display: "flex", gap: "0.6rem" }}>
    <button
      onClick={() => {
        const now = new Date();
        setForm(f => ({
          ...f,
          time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
        }));
      }}
      style={{
        ...buttonStyle(theme),
        background: isDark ? theme.button : theme.success,
        color: "#fff",
        fontWeight: 500,
        height: 44
      }}
    >
      Щойно
    </button>
    <button
      onClick={() => {
        // +1 минута
        let [h, m] = (form.time || "00:00").split(":").map(Number);
        m++;
        if (m > 59) { m = 0; h = (h + 1) % 24; }
        setForm(f => ({
          ...f,
          time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
        }));
      }}
      style={{
        ...buttonStyle(theme),
        background: isDark ? theme.button : theme.success,
        color: "#fff",
        fontWeight: 500,
        height: 44
      }}
    >
      +1хв
    </button>
    <button
      onClick={() => {
        // -1 минута
        let [h, m] = (form.time || "00:00").split(":").map(Number);
        m--;
        if (m < 0) { m = 59; h = h - 1; if (h < 0) h = 23; }
        setForm(f => ({
          ...f,
          time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
        }));
      }}
      style={{
        ...buttonStyle(theme),
        background: isDark ? theme.button : theme.danger,
        color: "#fff",
        fontWeight: 500,
        height: 44
      }}
    >
      -1хв
    </button>
  </div>
</div>


      {/* ——— Вияв ——— */}
      <div style={{
  ...cardStyle(theme),
  padding: "1rem 0.7rem",
  display: "flex",
  flexDirection: "column"
}}>
  <label style={{
    ...labelStyle(theme),
    marginLeft: "0.3rem",
    marginBottom: "0.8rem",
    fontSize: "1.07rem"
  }}>Вияв</label>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "0.65rem",
      width: "100%",
      alignItems: "stretch"
    }}
  >
    {["Акустично", "Візуально", "Радіолокаційно", "Із застосуванням приладів спостереження"].map((m) => (
      <button
        key={m}
        onClick={() => toggleDetection(m)}
        style={{
          background: form.detectionMethods.includes(m)
            ? theme.success
            : theme.secondary,
          color: form.detectionMethods.includes(m)
            ? "#fff"
            : theme.label,
          fontWeight: form.detectionMethods.includes(m) ? 600 : 500,
          border: "none",
          borderRadius: "14px",
          boxShadow: form.detectionMethods.includes(m)
            ? "0 2px 8px rgba(50,215,75,0.14)"
            : theme.shadow,
          padding: "0.62rem 0.7rem",
          marginBottom: "0.02rem",
          fontSize: "1.01rem",
          transition: "background .18s, color .18s, box-shadow .18s",
          cursor: "pointer",
          minWidth: 0,
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        title={m}
      >
        {m}
      </button>
    ))}
  </div>
</div>

      {/* ——— Результат ——— */}
     <div style={cardStyle(theme)}>
  <label style={labelStyle(theme)}>Результат</label>
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "0.65rem",
    width: "100%",
    alignItems: "stretch"
  }}>
    {/* Виявлено — активна если не выбран другой результат */}
    <button
      onClick={() => setForm(f => ({ ...f, result: null }))}
      style={{
        background: form.result === null ? theme.success : theme.secondary,
        color: form.result === null ? "#fff" : theme.label,
        fontWeight: form.result === null ? 600 : 500,
        border: "none",
        borderRadius: "14px",
        boxShadow: form.result === null
          ? "0 2px 8px rgba(50,215,75,0.14)"
          : theme.shadow,
        padding: "0.62rem 0.7rem",
        marginBottom: "0.02rem",
        fontSize: "1.01rem",
        transition: "background .18s, color .18s, box-shadow .18s",
        cursor: "pointer",
        minWidth: 0,
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
      title="Виявлено"
    >
      Виявлено
    </button>
    {["Обстріляно", "Уражено"].map(r => (
      <button
        key={r}
        onClick={() => setForm(f => ({ ...f, result: r }))}
        style={{
          background: form.result === r ? theme.success : theme.secondary, // <-- всегда зеленый при выборе
          color: form.result === r ? "#fff" : theme.label,
          fontWeight: form.result === r ? 600 : 500,
          border: "none",
          borderRadius: "14px",
          boxShadow: form.result === r
            ? "0 2px 8px rgba(50,215,75,0.14)"
            : theme.shadow,
          padding: "0.62rem 0.7rem",
          marginBottom: "0.02rem",
          fontSize: "1.01rem",
          transition: "background .18s, color .18s, box-shadow .18s",
          cursor: "pointer",
          minWidth: 0,
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        title={r}
      >
        {r}
      </button>
    ))}
  </div>
</div>


       {/* ——— Розхід БК ——— */}
{["Обстріляно", "Уражено"].includes(form.result) && (
  <div style={cardStyle(theme)}>
    <label style={labelStyle(theme)}>Розхід БК</label>
    {/* Список выбранного оружия с количеством */}
    <div style={{
      display: "flex", flexDirection: "column", gap: 8, marginBottom: 14
    }}>
      {Object.keys(form.ammo || {}).length === 0 ? (
        <span style={{color: theme.label, opacity: 0.6, fontSize: "0.98rem"}}>Оберіть тип зброї</span>
      ) : (
        Object.entries(form.ammo).map(([w, count]) => (
          <div key={w} style={{
            display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between"
          }}>
            <span style={{fontWeight: 500, color: theme.label, flex: 1}}>{w}</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={count}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, "");
                setForm(f => {
                  const ammo = {...f.ammo, [w]: v};
                  saveAmmo(ammo);
                  return {...f, ammo};
                });
              }}
              style={{
                ...inputStyle(theme),
                width: 120, // ← длиннее
                marginBottom: 0,
                textAlign: "center",
                fontWeight: 500,
                fontSize: "1.06rem"
              }}
              placeholder="К-сть"
            />
            <button
              style={{
                ...buttonStyle(theme),
                background: theme.danger, minWidth: 36, maxWidth: 36, padding: 0, color: "#fff"
              }}
              onClick={() => {
                setForm(f => {
                  const ammo = {...f.ammo};
                  delete ammo[w];
                  saveAmmo(ammo);
                  return {...f, ammo};
                });
              }}
              title="Видалити"
            >✕</button>
          </div>
        ))
      )}
    </div>
    <button
      style={{...buttonStyle(theme), width: "100%", fontWeight: 600, fontSize: "1.04rem"}}
      onClick={() => setShowAmmoModal(true)}
    >Вибрати наявні типи зброї</button>
  </div>
)}              

      {/* ——— Опис ——— */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Опис</label>
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
            backgroundColor: theme.textareaBg,
            fontSize: "1rem",
            color: theme.textareaText,
            resize: "none",
            outline: "none"
          }}
        />
      </div>

      {/* ——— Кнопки копировать и WhatsApp ——— */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem" }}>
        <button onClick={copyReport} style={buttonStyle(theme)}>Копіювати</button>
        <button onClick={openWhatsApp} style={{
          ...buttonStyle(theme),
          background: theme.success,
          color: "#fff"
        }}>WhatsApp</button>
      </div>

      {/* ——— Отображение отчёта ——— */}
      <div style={cardStyle(theme)}>
        <pre style={{
          whiteSpace: "pre-wrap",
          fontSize: "1rem",
          color: theme.label,
          margin: 0,
          background: "none"
        }}>
          {generateReportText()}
        </pre>
      </div>
          {/* ——— Модалка выбора оружия ——— */}
{showAmmoModal && (
  <div style={{
    position: "fixed",
    zIndex: 9999,
    left: 0, top: 0, width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.24)",
    display: "flex", alignItems: "center", justifyContent: "center"
  }}>
    <div style={{
      background: theme.card,
      borderRadius: 18,
      boxShadow: theme.shadow,
      padding: 18,
      maxWidth: 420,
      width: "95vw",
      maxHeight: "75vh",
      overflowY: "auto",
      position: "relative"
    }}>
      <h3 style={{margin: 0, marginBottom: 12, fontSize: "1.09rem", color: theme.label, fontWeight: 600, textAlign: "center"}}>Оберіть типи зброї</h3>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: 18
      }}>
        {ammoList.map(w => (
          <button
            key={w}
            onClick={() => {
              setForm(f => {
                const ammo = {...f.ammo};
                if (ammo[w]) {
                  delete ammo[w];
                } else {
                  ammo[w] = "";
                }
                saveAmmo(ammo);
                return {...f, ammo};
              });
            }}
            style={{
              ...buttonStyle(theme),
              background: form.ammo[w] !== undefined ? theme.success : theme.secondary,
              color: form.ammo[w] !== undefined ? "#fff" : theme.label,
              fontWeight: form.ammo[w] !== undefined ? 600 : 500,
              minWidth: 0,
              fontSize: "0.97rem",
              padding: "0.48rem 0.2rem"
            }}
          >{w}</button>
        ))}
      </div>
      <button
        style={{
          ...buttonStyle(theme),
          width: "100%", background: theme.button, fontWeight: 600
        }}
        onClick={() => setShowAmmoModal(false)}
      >OK</button>
      <button
        style={{
          position: "absolute",
          top: 8, right: 10,
          background: "none", border: "none",
          color: theme.danger,
          fontSize: 24, fontWeight: 800, cursor: "pointer"
        }}
        onClick={() => setShowAmmoModal(false)}
        title="Закрити"
      >×</button>
    </div>
  </div>
)}

    </div>
  );
}

// ——— Стили-функции ———
function cardStyle(theme) {
  return {
    backgroundColor: theme.card,
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "1.2rem",
    boxShadow: theme.shadow,
    transition: "background .23s, box-shadow .18s"
  };
}
function labelStyle(theme) {
  return {
    fontSize: "1rem",
    marginBottom: "0.35rem",
    color: theme.label,
    fontWeight: 500,
    display: "block"
  };
}
function inputStyle(theme) {
  return {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "12px",
    border: `1px solid ${theme.inputBorder}`,
    backgroundColor: theme.inputBg,
    fontSize: "1rem",
    color: theme.inputText,
    marginBottom: "0.6rem",
    outline: "none",
    transition: "background .2s, border .18s"
  };
}
function buttonStyle(theme) {
  return {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1rem",
    color: theme.buttonText,
    background: theme.button,
    margin: "0.2rem",
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: theme.shadow,
    transition: "background .2s, color .18s, box-shadow .2s"
  };
}
