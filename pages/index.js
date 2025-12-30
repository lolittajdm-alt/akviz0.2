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

  // ——— Списки ———
  const subdivisionsList = ["1020 зрап", "зрадн 60 омбр", "МВГ «Халк»"];
  const callsignPrefixList = ["МВГ", "ВГ"];

  const regionsList = [
    "Вінницька", "Волинська", "Дніпропетровська", "Донецька", "Житомирська",
    "Закарпатська", "Запорізька", "Івано-Франківська", "Київська", "Кіровоградська",
    "Луганська", "Львівська", "Миколаївська", "Одеська", "Полтавська",
    "Рівненська", "Сумська", "Тернопільська", "Харківська", "Херсонська",
    "Хмельницька", "Черкаська", "Чернівецька", "Чернігівська"
  ];

  const ranksList = [
    "Солдат", "Старший солдат", "Молодший сержант", "Сержант", "Старший сержант",
    "Головний сержант", "Прапорщик", "Старший прапорщик", "Молодший лейтенант",
    "Лейтенант", "Старший лейтенант", "Капітан", "Майор", "Підполковник", "Полковник"
  ];

  const goalsList = [
    "БПЛА", "Постріли", "Виходи(ПЗРК,ЗРК)", "Вибух", "КР",
    "Гелікоптер", "Літак М.", "Літак В.", "Квадрокоптер", "Зонд", "Інше (деталі в описі)"
  ];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];

  // ——— Список оружия ———
  const ammoList = [
    "АКС-74У - 5.45х39мм","АКМ - 7.62х39мм","АК-74 - 5.45х39мм",
    "Спарка Максим - 7.62x54мм","Grot - 5.56х45мм","CZ BREN 2 - 5.56х45мм",
    "РПК-74 - 5.45х39мм","РПКЛ - 7.62х39мм","ДП-27 - 7.62x54мм",
    "ДШК - 12.7х108мм","ДШКМ - 12.7х108мм","ПКТ - 7.62x54мм",
    "ПКM - 7.62x54мм","КПВТ - 14.5x114мм","MG-42 - 7.62х51мм",
    "MG3 - 7.62х51мм","CANiK M2 - 12.7х99мм","Browning M2 - 12.7х99мм",
    "НСВ - 12.7х108мм","ЗПУ-2 - 14.5x114мм","FN MAG - 7.62х51мм",
    "FN MINIMI - 5.56х45мм","ЗУ 23-2 - 23х152мм","АЗГ М-75 - 20x110мм",
    "АЗГ-57 - 57мм","Bofors L70 - 40мм","Gepard 1A2 - 35х228мм",
    "Тунгуска гармата - 30мм","ЗКР Ігла","НДЖ Ігла","ЗКР Ігла-1",
    "НДЖ Ігла-1","ЗКР Стріла-2","НДЖ Стріла-2","ЗКР Стріла-2М",
    "НДЖ Стріла-2М","ЗКР Стріла-3","НДЖ Стріла-3","ЗКР Stinger",
    "НДЖ Stinger","ЗКР Piorun","НДЖ Piorun","Тунгуска ЗКР - ЗКР 9M311",
    "ЗРК DASH - ракета AGM-114L"
  ];

  // ——— Состояния формы ———
  const [form, setForm] = useState({
    subdivision: "",
    callsignPrefix: "",
    callsignText: "",
    location: "",
    region: "",

    // ✅ НОВОЕ: Зброя в первом блоке
    weaponsSelected: [],     // выбранные в модалке
    weaponsManual: "",       // доп. вручную (через кому)

    date: "",
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
    personnel: [{ rank: "", name: "" }],
  });

  const [showTopFields, setShowTopFields] = useState(true);
  const [errors, setErrors] = useState({});

  // ——— Модалки ———
  const [showSubdivisionModal, setShowSubdivisionModal] = useState(false);
  const [showCallsignPrefixModal, setShowCallsignPrefixModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showAmmoModal, setShowAmmoModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [activePersonnelIndex, setActivePersonnelIndex] = useState(0);

  // ✅ НОВОЕ: модалка "Зброя" (в первом блоке)
  const [showWeaponsModal, setShowWeaponsModal] = useState(false);

  // ——— Время/дата ———
  const updateTime = () => {
    const now = new Date();
    setForm((f) => ({
      ...f,
      time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
    }));
  };
  const updateDate = () => {
    const now = new Date();
    const d = now.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
    setForm((f) => ({ ...f, date: d }));
  };

  useEffect(() => {
    updateTime();
    updateDate();
  }, []);

  // ——— localStorage init ———
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedShow = localStorage.getItem("show_top_fields");
    if (savedShow !== null) setShowTopFields(savedShow === "true");

    const keys = ["subdivision", "callsignPrefix", "callsignText", "location", "region"];
    keys.forEach((key) => {
      const v = localStorage.getItem(`report_${key}_v3`);
      if (v !== null) setForm((f) => ({ ...f, [key]: v }));
    });

    const savedAmmo = localStorage.getItem("akviz_ammo_v3");
    if (savedAmmo) setForm((f) => ({ ...f, ammo: JSON.parse(savedAmmo) }));

    const savedPersonnel = localStorage.getItem("akviz_personnel_v3");
    if (savedPersonnel) {
      try {
        const arr = JSON.parse(savedPersonnel);
        if (Array.isArray(arr) && arr.length) setForm((f) => ({ ...f, personnel: arr }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("show_top_fields", String(showTopFields));
  }, [showTopFields]);

  // ——— Helpers localStorage ———
  const saveAmmo = (ammoObj) => localStorage.setItem("akviz_ammo_v3", JSON.stringify(ammoObj));
  const savePersonnel = (arr) => localStorage.setItem("akviz_personnel_v3", JSON.stringify(arr));

  // ——— Хендлеры ———
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (["subdivision", "callsignPrefix", "callsignText", "location", "region"].includes(name)) {
      localStorage.setItem(`report_${name}_v3`, value);
    }
  };

  const toggleGoal = (g) =>
    setForm((f) => ({
      ...f,
      selectedGoals: f.selectedGoals.includes(g) ? f.selectedGoals.filter((x) => x !== g) : [...f.selectedGoals, g],
    }));

  const selectSide = (s) => setForm((f) => ({ ...f, side: f.side === s ? null : s }));
  const selectName = (n) => setForm((f) => ({ ...f, name: n }));
  const changeQuantity = (d) => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity + d) }));

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

  const validateDistance = (v) => /^\d+$/.test(v) && +v > 0 && +v < 100000;
  const onDistanceChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, distance: v }));
    setErrors((errs) => ({ ...errs, distance: v.trim() === "" ? true : !validateDistance(v) }));
  };
  const changeDistance = (d) => {
    let x = +form.distance || 0;
    x += d;
    if (x < 0) x = 0;
    const s = String(x);
    setForm((f) => ({ ...f, distance: s }));
    setErrors((f) => ({ ...f, distance: s.trim() === "" ? true : !validateDistance(s) }));
  };

  const validateHeight = (v) => /^\d+$/.test(v) && +v >= 0 && +v < 30000;
  const onHeightChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, height: v }));
    setErrors((errs) => ({ ...errs, height: v.trim() === "" ? true : !validateHeight(v) }));
  };
  const changeHeight = (d) => {
    let h = +form.height || 0;
    h += d;
    if (h < 0) h = 0;
    const s = String(h);
    setForm((f) => ({ ...f, height: s }));
    setErrors((f) => ({ ...f, height: s.trim() === "" ? true : !validateHeight(s) }));
  };

  const onFieldNumeric = (field, max) => (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, max ? String(max).length : undefined);
    setForm((f) => ({ ...f, [field]: v }));
  };

  // ——— Детекция ———
  const toggleDetection = (m) =>
    setForm((f) => ({
      ...f,
      detectionMethods: f.detectionMethods.includes(m)
        ? f.detectionMethods.filter((x) => x !== m)
        : [...f.detectionMethods, m],
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

  // ——— Генератор отчёта ———
  const generateReportText = () => {
    const {
      subdivision,
      callsignPrefix,
      callsignText,
      location,
      region,
      date,
      time,
      selectedGoals,
      side,
      targetNumber,
      noIssue,
      name,
      quantity,
      azimuth,
      course,
      distance,
      height,
      detectionMethods,
      result,
      description,
      ammo,
      personnel,
    } = form;

    const fullCallsign = [callsignPrefix, callsignText].filter(Boolean).join(" ");

    function extractCaliber(full) {
      const parts = full.split("-");
      if (parts.length > 1) return parts[parts.length - 1].trim();
      return full.trim();
    }
    function extractWeaponName(full) {
      const parts = full.split(" - ");
      if (parts.length > 1) return parts.slice(0, -1).join(" - ").trim();
      return full.trim();
    }

    const ammoString =
      ammo && Object.keys(ammo).length
        ? "Витрата БК: " +
          Object.entries(ammo)
            .filter(([_, qty]) => qty && Number(qty) > 0)
            .map(([full, qty]) => `${extractCaliber(full)} - ${qty} шт.`)
            .join(", ")
        : "";

    const personnelString = (personnel || [])
      .filter((p) => (p.rank || "").trim() || (p.name || "").trim())
      .map((p) => `${(p.rank || "").trim()} ${(p.name || "").trim()}`.trim())
      .filter(Boolean)
      .join(", ");

    if (result === "Обстріляно" || result === "Уражено") {
      let targetNumText = null;
      if (noIssue) targetNumText = "Без видачі";
      else if (targetNumber) targetNumText = `№${targetNumber}`;

      const usedWeapons =
        ammo && Object.keys(ammo).length ? Object.keys(ammo).map(extractWeaponName).join(", ") : null;

      const paramArr = [height ? `H-${height}` : null, distance ? `D-${distance}` : null, azimuth ? `A-${azimuth}` : null, course ? `K-${course}` : null].filter(Boolean);

      const firstLineArr = [
        date ? `Дата: ${date}` : null,
        time ? `Час: ${time}` : null,
        targetNumText ? `Ціль: ${targetNumText}` : null,
        subdivision ? `Підрозділ: ${subdivision}` : null,
        fullCallsign ? `Позивний: ${fullCallsign}` : null,
        personnelString ? `О/С: ${personnelString}` : null,
      ].filter(Boolean);

      const placeLine = [location ? `НП: ${location}` : null, region ? `Область: ${region}` : null].filter(Boolean).join(", ");

      const weaponLine = usedWeapons
        ? `з ${usedWeapons}${paramArr.length ? " (" + paramArr.join(", ") + ")" : ""}`
        : paramArr.length
        ? `Парам.: ${paramArr.join(", ")}`
        : "";

      const goalLine =
        [result, selectedGoals.length ? selectedGoals.join(", ") : null, name ? name : null, side ? `(${side})` : null]
          .filter(Boolean)
          .join(" ") + ".";

      return [
        ...firstLineArr,
        placeLine || null,
        weaponLine || null,
        goalLine,
        ammoString || null,
        description ? `Опис: ${description}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    }

    const allowedGoals = ["БПЛА", "Вибух", "КР", "Гелікоптер", "Літак Малий", "Літак Великий", "Квадрокоптер", "Зонд"];

    const goalsForReport = selectedGoals.map((goal) => {
      if (goal === "БПЛА" && name) return `БПЛА (${name})`;
      return goal;
    });

    const hasAllowedGoal = selectedGoals.some((goal) => allowedGoals.includes(goal));

    return [
      date ? `Дата: ${date}` : null,
      time ? `Час: ${time}` : null,
      subdivision ? `Підрозділ: ${subdivision}` : null,
      fullCallsign ? `Позивний: ${fullCallsign}` : null,
      personnelString ? `О/С: ${personnelString}` : null,
      `Ціль: ${[...goalsForReport, side, noIssue ? "Без видачі" : targetNumber ? `${targetNumber}` : ""].filter(Boolean).join(", ")}`,
      location ? `НП: ${location}` : null,
      region ? `Область: ${region}` : null,
      height ? `Висота: ${height} м` : null,
      distance ? `Відстань: ${distance} м` : null,
      hasAllowedGoal && quantity ? `Кількість: ${quantity} од.` : null,
      azimuth ? `А: ${azimuth}°` : null,
      course ? `К: ${course}°` : null,
      detectionMethods.length ? `Вияв: ${detectionMethods.join(", ")}` : null,
      `ПП: ${result === null ? "Виявлено" : result}`,
      description ? `Опис: ${description}` : null,
    ]
      .filter(Boolean)
      .join("\n");
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
    shadow: isDark ? "0 2px 12px rgba(0,0,0,0.38)" : "0 4px 16px rgba(0,0,0,0.10)",
    border: isDark ? "#23242a" : "#ededed",
    textareaBg: isDark ? "#23242a" : "#fff",
    textareaText: isDark ? "#f7f7fb" : "#1C1C1E",
  };

  // ——— iOS Switch ———
  const Switch = (
    <button
      onClick={() => setIsDark((d) => !d)}
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
        transition: "background .2s",
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
          transition: "left .22s cubic-bezier(.47,1.64,.41,.8), background .2s",
        }}
      >
        <span style={{ fontSize: 22, color: isDark ? "#ffe200" : "#b7b7b7" }}>{isDark ? "☀️" : "🌙"}</span>
      </span>
    </button>
  );

  // ✅ НОВОЕ: собрать все выбранные "Зброя" (модалка + вручную)
  const getWeaponsAll = () => {
    const manual = (form.weaponsManual || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const all = [...(form.weaponsSelected || []), ...manual];
    return Array.from(new Set(all));
  };

  // ——— JSX ———
  return (
    <div
      style={{
        fontFamily: systemFont,
        background: theme.bg,
        minHeight: "100vh",
        padding: "1rem",
        transition: "background 0.24s",
        boxSizing: "border-box",
      }}
    >
      {/* Шапка */}
      <div style={{ ...cardStyle(theme), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.35rem", color: theme.label, fontWeight: 600 }}>АкВіз 2.0</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{Switch}</div>
      </div>

      {/* Показать/скрыть */}
      <div style={{ ...cardStyle(theme), display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowTopFields((prev) => !prev)}
          style={{ ...buttonStyle(theme), background: theme.secondary, color: theme.label, fontWeight: 500, minWidth: 160 }}
        >
          {showTopFields ? "Приховати поля" : "Показати поля"}
        </button>
      </div>

      {/* Верхний блок */}
      {showTopFields && (
        <div style={cardStyle(theme)}>
          {/* Підрозділ */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Підрозділ</label>
            <button
              type="button"
              onClick={() => setShowSubdivisionModal(true)}
              style={{
                ...inputStyle(theme),
                marginBottom: 0,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span style={{ opacity: form.subdivision ? 1 : 0.6 }}>{form.subdivision || "Оберіть підрозділ"}</span>
              <span style={{ opacity: 0.6, fontSize: 18 }}>›</span>
            </button>
          </div>

          {/* Особовий склад */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Особовий склад</label>

            {(form.personnel || []).map((person, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: 10 }}>
                {/* Звання — короткое */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePersonnelIndex(idx);
                    setShowRankModal(true);
                  }}
                  style={{
                    ...inputStyle(theme),
                    marginBottom: 0,
                    width: 120,
                    minWidth: 120,
                    maxWidth: 120,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ opacity: person.rank ? 1 : 0.6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {person.rank || "Звання"}
                  </span>
                  <span style={{ opacity: 0.6 }}>⌄</span>
                </button>

                {/* ПІБ — длиннее */}
                <input
                  value={person.name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      const arr = [...f.personnel];
                      arr[idx] = { ...arr[idx], name: v };
                      savePersonnel(arr);
                      return { ...f, personnel: arr };
                    });
                  }}
                  placeholder="Залужний В.Ф."
                  style={{ ...inputStyle(theme), marginBottom: 0, flex: 1 }}
                />
              </div>
            ))}

            <button
              onClick={() =>
                setForm((f) => {
                  const arr = [...f.personnel, { rank: "", name: "" }];
                  savePersonnel(arr);
                  return { ...f, personnel: arr };
                })
              }
              style={{
                ...buttonStyle(theme),
                background: theme.success,
                color: "#fff",
                margin: 0,
                width: "100%",
                fontWeight: 600,
              }}
            >
              + Додати особовий склад
            </button>
          </div>

          {/* Позивний — 2 поля */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Позивний</label>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="button"
                onClick={() => setShowCallsignPrefixModal(true)}
                style={{
                  ...inputStyle(theme),
                  marginBottom: 0,
                  width: 90,
                  minWidth: 90,
                  maxWidth: 90,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <span style={{ opacity: form.callsignPrefix ? 1 : 0.6 }}>{form.callsignPrefix || "МВГ"}</span>
                <span style={{ opacity: 0.6, fontSize: 14 }}>⌄</span>
              </button>

              <input
                name="callsignText"
                value={form.callsignText}
                onChange={handleChange}
                placeholder="Халк / Лис / ..."
                style={{ ...inputStyle(theme), marginBottom: 0, flex: 1 }}
              />
            </div>
          </div>

          {/* НП — 1 строка */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle(theme)}>Населений пункт</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              style={{ ...inputStyle(theme), marginBottom: 0 }}
              placeholder="Наприклад м. Кривий Ріг"
            />
          </div>

          {/* Область — 2 строка */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Область</label>
            <button
              type="button"
              onClick={() => setShowRegionModal(true)}
              style={{
                ...inputStyle(theme),
                marginBottom: 0,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span style={{ opacity: form.region ? 1 : 0.6 }}>{form.region || "Оберіть область"}</span>
              <span style={{ opacity: 0.6, fontSize: 18 }}>›</span>
            </button>
          </div>

          {/* ✅ НОВОЕ: Зброя (модалка) + следующее поле для добавления нескольких вручную */}
          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle(theme)}>Зброя</label>

            {/* 1) выбор в модалке */}
            <button
              type="button"
              onClick={() => setShowWeaponsModal(true)}
              style={{
                ...inputStyle(theme),
                marginBottom: "0.6rem",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span style={{ opacity: getWeaponsAll().length ? 1 : 0.6 }}>
                {getWeaponsAll().length ? `Обрано: ${getWeaponsAll().length}` : "Оберіть зброю"}
              </span>
              <span style={{ opacity: 0.6, fontSize: 18 }}>›</span>
            </button>

            {/* 2) следующее поле: добавить несколько видов вручную */}
            <input
              name="weaponsManual"
              value={form.weaponsManual}
              onChange={(e) => setForm((f) => ({ ...f, weaponsManual: e.target.value }))}
              style={{ ...inputStyle(theme), marginBottom: 0 }}
              placeholder="Додайте ще (через кому)"
            />

            {/* мини-подсказка/превью выбранного */}
            {getWeaponsAll().length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {getWeaponsAll().slice(0, 12).map((w) => (
                  <span
                    key={w}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: theme.secondary,
                      color: theme.label,
                      fontSize: 13,
                      lineHeight: 1,
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={w}
                  >
                    {w}
                  </span>
                ))}
                {getWeaponsAll().length > 12 && (
                  <span style={{ padding: "6px 10px", borderRadius: 999, background: theme.secondary, color: theme.label, fontSize: 13 }}>
                    +{getWeaponsAll().length - 12}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ціль */}
      <div style={{ ...cardStyle(theme), padding: "1rem 0.7rem", display: "flex", flexDirection: "column" }}>
        <label style={{ ...labelStyle(theme), marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Ціль</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem", width: "100%" }}>
          {goalsList.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              style={{
                background: form.selectedGoals.includes(goal) ? theme.success : theme.secondary,
                color: form.selectedGoals.includes(goal) ? "#fff" : theme.label,
                fontWeight: form.selectedGoals.includes(goal) ? 600 : 500,
                border: "none",
                borderRadius: "14px",
                boxShadow: form.selectedGoals.includes(goal) ? "0 2px 8px rgba(50,215,75,0.14)" : theme.shadow,
                padding: "0.62rem 0.7rem",
                fontSize: "0.98rem",
                cursor: "pointer",
                width: "100%",
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                whiteSpace: "normal",
                lineHeight: 1.15,
                overflow: "hidden",
                wordBreak: "break-word",
                ...(goal === "Інше (деталі в описі)" ? { gridColumn: "span 2" } : {}),
              }}
              title={goal}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Сторона */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Сторона</label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {["Ворожий", "Свій", "Нейтральний"].map((s) => (
            <button
              key={s}
              onClick={() => selectSide(s)}
              style={{
                ...buttonStyle(theme),
                background: form.side === s ? theme.success : theme.secondary,
                color: form.side === s ? "#fff" : theme.label,
                fontWeight: form.side === s ? 600 : 500,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Номер цілі */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Номер цілі</label>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          {!form.noIssue && (
            <input
              type="text"
              name="targetNumber"
              value={form.targetNumber}
              onChange={onFieldNumeric("targetNumber", 9999)}
              placeholder="по цілі"
              inputMode="numeric"
              pattern="\d*"
              style={{ ...inputStyle(theme), textAlign: "center", flex: 1, marginBottom: 0, height: 44 }}
            />
          )}
          <button
            onClick={() => setForm((f) => ({ ...f, noIssue: !f.noIssue, targetNumber: "" }))}
            style={{
              ...buttonStyle(theme),
              backgroundColor: form.noIssue ? theme.danger : theme.secondary,
              color: form.noIssue ? "#fff" : theme.label,
              height: 44,
              minWidth: 128,
              marginBottom: 0,
            }}
          >
            {form.noIssue ? "Видати номер" : "Без видачі"}
          </button>
        </div>
      </div>

      {/* Назва (БПЛА) */}
      {form.selectedGoals.includes("БПЛА") && (
        <div style={{ ...cardStyle(theme), padding: "1rem 0.7rem" }}>
          <label style={{ ...labelStyle(theme), marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Назва</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem" }}>
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
                  boxShadow: form.name === n ? "0 2px 8px rgba(10,132,255,0.14)" : theme.shadow,
                  padding: "0.62rem 0.7rem",
                  cursor: "pointer",
                  minWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                title={n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кількість */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Кількість</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <input
            type="text"
            value={form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: Math.max(1, +e.target.value.replace(/\D/g, "")) }))}
            inputMode="numeric"
            pattern="\d*"
            style={{ ...inputStyle(theme), textAlign: "center", flex: 1, marginBottom: 0, height: 44 }}
          />
          <button
            onClick={() => changeQuantity(-1)}
            style={{ ...buttonStyle(theme), backgroundColor: "#FF375F", color: "#fff", height: 44, minWidth: 44, marginBottom: 0, padding: 0 }}
          >
            –
          </button>
          <button
            onClick={() => changeQuantity(1)}
            style={{ ...buttonStyle(theme), backgroundColor: "#32D74B", color: "#fff", height: 44, minWidth: 44, marginBottom: 0, padding: 0 }}
          >
            +
          </button>
        </div>
      </div>

      {/* Азимут / курс */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Азимут (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={form.azimuth}
          onChange={onAzimuthChange}
          style={{
            ...inputStyle(theme),
            border: form.azimuth.trim() === "" || !validateAzimuth(form.azimuth) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}`,
          }}
        />
        {(form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)) && (
          <div style={{ color: theme.danger, fontSize: "0.82rem", marginBottom: "0.6rem" }}>Поле має бути заповненим!</div>
        )}

        <label style={labelStyle(theme)}>Курс (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={form.course}
          onChange={onCourseChange}
          style={{
            ...inputStyle(theme),
            border: form.course.trim() === "" || !validateCourse(form.course) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}`,
          }}
        />
        {(form.course.trim() === "" || !validateCourse(form.course)) && (
          <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.35rem" }}>Поле має бути заповненим!</div>
        )}
      </div>

      {/* Відстань/Висота */}
      <div style={{ ...cardStyle(theme), padding: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle(theme)}>Відстань, м*</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.distance}
            onChange={onDistanceChange}
            style={{
              ...inputStyle(theme),
              border: form.distance.trim() === "" || !validateDistance(form.distance) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}`,
            }}
          />
          {(form.distance.trim() === "" || !validateDistance(form.distance)) && (
            <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.2rem" }}>Поле має бути заповненим!</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+1000", "+5000", "-100", "-1000", "-5000"].map((label) => (
              <button
                key={label}
                onClick={() => changeDistance(Number(label))}
                style={{ ...buttonStyle(theme), backgroundColor: label.startsWith("-") ? theme.danger : theme.success, color: "#fff", padding: "0.4rem 0.5rem" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle(theme)}>Висота, м*</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.height}
            onChange={onHeightChange}
            style={{
              ...inputStyle(theme),
              border: form.height.trim() === "" || !validateHeight(form.height) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}`,
            }}
          />
          {(form.height.trim() === "" || !validateHeight(form.height)) && (
            <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.2rem" }}>Поле має бути заповненим!</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+500", "-100", "-500"].map((label) => (
              <button
                key={label}
                onClick={() => changeHeight(Number(label))}
                style={{ ...buttonStyle(theme), backgroundColor: label.startsWith("-") ? theme.danger : theme.success, color: "#fff", padding: "0.4rem 0.5rem" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Дата/час */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Дата</label>
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.7rem" }}>
          <input type="text" value={form.date} readOnly style={{ ...inputStyle(theme), flex: 1, marginBottom: 0, height: 44, textAlign: "center" }} />
          <button onClick={updateDate} style={{ ...buttonStyle(theme), background: theme.secondary, color: theme.label, minWidth: 44, flex: "0 0 auto" }} title="Оновити дату">
            ⟳
          </button>
        </div>

        <label style={labelStyle(theme)}>Час</label>
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.7rem" }}>
          <input type="text" name="time" value={form.time} onChange={handleChange} style={{ ...inputStyle(theme), flex: 1, marginBottom: 0, height: 44, textAlign: "center" }} />
        </div>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button onClick={() => { updateTime(); updateDate(); }} style={{ ...buttonStyle(theme), background: isDark ? theme.button : theme.success, color: "#fff", height: 44 }}>
            Щойно
          </button>
          <button
            onClick={() => {
              let [h, m] = (form.time || "00:00").split(":").map(Number);
              m++; if (m > 59) { m = 0; h = (h + 1) % 24; }
              setForm((f) => ({ ...f, time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` }));
            }}
            style={{ ...buttonStyle(theme), background: isDark ? theme.button : theme.success, color: "#fff", height: 44 }}
          >
            +1хв
          </button>
          <button
            onClick={() => {
              let [h, m] = (form.time || "00:00").split(":").map(Number);
              m--; if (m < 0) { m = 59; h = h - 1; if (h < 0) h = 23; }
              setForm((f) => ({ ...f, time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` }));
            }}
            style={{ ...buttonStyle(theme), background: isDark ? theme.button : theme.danger, color: "#fff", height: 44 }}
          >
            -1хв
          </button>
        </div>
      </div>

      {/* Вияв */}
      <div style={{ ...cardStyle(theme), padding: "1rem 0.7rem" }}>
        <label style={{ ...labelStyle(theme), marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Вияв</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.65rem" }}>
          {["Акустично", "Візуально", "Із застосуванням приладів спостереження"].map((m) => (
            <button
              key={m}
              onClick={() => toggleDetection(m)}
              style={{
                ...buttonStyle(theme),
                background: form.detectionMethods.includes(m) ? theme.success : theme.secondary,
                color: form.detectionMethods.includes(m) ? "#fff" : theme.label,
                fontWeight: form.detectionMethods.includes(m) ? 600 : 500,
                ...(m === "Із застосуванням приладів спостереження" ? { gridColumn: "span 2" } : {}),
              }}
              title={m}
            >
              <span style={{ width: "100%", display: "block", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Результат */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Результат</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem" }}>
          <button
            onClick={() => setForm((f) => ({ ...f, result: null }))}
            style={{ ...buttonStyle(theme), background: form.result === null ? theme.success : theme.secondary, color: form.result === null ? "#fff" : theme.label }}
          >
            Виявлено
          </button>
          {["Обстріляно", "Уражено"].map((r) => (
            <button
              key={r}
              onClick={() => setForm((f) => ({ ...f, result: r }))}
              style={{ ...buttonStyle(theme), background: form.result === r ? theme.success : theme.secondary, color: form.result === r ? "#fff" : theme.label }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Розхід БК */}
      {["Обстріляно", "Уражено"].includes(form.result) && (
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Розхід БК</label>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {Object.keys(form.ammo || {}).length === 0 ? (
              <span style={{ color: theme.label, opacity: 0.6, fontSize: "0.98rem" }}>Оберіть тип зброї</span>
            ) : (
              Object.entries(form.ammo).map(([w, count]) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 500, color: theme.label, flex: 1 }}>{w}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={count}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setForm((f) => {
                        const ammo = { ...f.ammo, [w]: v };
                        saveAmmo(ammo);
                        return { ...f, ammo };
                      });
                    }}
                    style={{ ...inputStyle(theme), width: 150, marginBottom: 0, textAlign: "center", fontWeight: 500, fontSize: "1.06rem" }}
                    placeholder="К-сть"
                  />
                </div>
              ))
            )}
          </div>

          <button style={{ ...buttonStyle(theme), width: "100%", fontWeight: 600 }} onClick={() => setShowAmmoModal(true)}>
            Вибрати наявні типи зброї
          </button>
        </div>
      )}

      {/* Опис */}
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
            outline: "none",
          }}
        />
      </div>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem" }}>
        <button onClick={copyReport} style={buttonStyle(theme)}>Копіювати</button>
        <button onClick={openWhatsApp} style={{ ...buttonStyle(theme), background: theme.success, color: "#fff" }}>WhatsApp</button>
      </div>

      {/* Отчёт */}
      <div style={cardStyle(theme)}>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "1rem", color: theme.label, margin: 0, background: "none" }}>
          {generateReportText()}
        </pre>
      </div>

      {/* =================== МОДАЛКИ =================== */}

      {/* Підрозділ */}
      {showSubdivisionModal && (
        <ModalShell theme={theme} onClose={() => setShowSubdivisionModal(false)} title="Оберіть підрозділ">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {subdivisionsList.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setForm((f) => ({ ...f, subdivision: item }));
                  localStorage.setItem("report_subdivision_v3", item);
                  setShowSubdivisionModal(false);
                }}
                style={{
                  ...buttonStyle(theme),
                  width: "100%",
                  background: form.subdivision === item ? theme.success : theme.secondary,
                  color: form.subdivision === item ? "#fff" : theme.label,
                  fontWeight: form.subdivision === item ? 600 : 500,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </ModalShell>
      )}

      {/* Позивний prefix (МВГ/ВГ) */}
      {showCallsignPrefixModal && (
        <ModalShell theme={theme} onClose={() => setShowCallsignPrefixModal(false)} title="Оберіть тип">
          <div style={{ display: "flex", gap: 10 }}>
            {callsignPrefixList.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setForm((f) => ({ ...f, callsignPrefix: p }));
                  localStorage.setItem("report_callsignPrefix_v3", p);
                  setShowCallsignPrefixModal(false);
                }}
                style={{
                  ...buttonStyle(theme),
                  background: form.callsignPrefix === p ? theme.success : theme.secondary,
                  color: form.callsignPrefix === p ? "#fff" : theme.label,
                  fontWeight: form.callsignPrefix === p ? 600 : 500,
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setForm((f) => ({ ...f, callsignPrefix: "" }));
              localStorage.setItem("report_callsignPrefix_v3", "");
              setShowCallsignPrefixModal(false);
            }}
            style={{ ...buttonStyle(theme), background: theme.danger, color: "#fff", width: "100%", marginTop: 12 }}
          >
            Очистити
          </button>
        </ModalShell>
      )}

      {/* Область */}
      {showRegionModal && (
        <ModalShell theme={theme} onClose={() => setShowRegionModal(false)} title="Оберіть область">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {regionsList.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setForm((f) => ({ ...f, region: item }));
                  localStorage.setItem("report_region_v3", item);
                  setShowRegionModal(false);
                }}
                style={{
                  ...buttonStyle(theme),
                  background: form.region === item ? theme.success : theme.secondary,
                  color: form.region === item ? "#fff" : theme.label,
                  fontWeight: form.region === item ? 600 : 500,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </ModalShell>
      )}

      {/* ✅ НОВОЕ: Зброя (мультивыбор) */}
      {showWeaponsModal && (
        <ModalShell theme={theme} onClose={() => setShowWeaponsModal(false)} title="Оберіть зброю">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: 12 }}>
            {ammoList.map((w) => {
              const active = (form.weaponsSelected || []).includes(w);
              return (
                <button
                  key={w}
                  onClick={() => {
                    setForm((f) => {
                      const curr = f.weaponsSelected || [];
                      const next = curr.includes(w) ? curr.filter((x) => x !== w) : [...curr, w];
                      return { ...f, weaponsSelected: next };
                    });
                  }}
                  style={{
                    ...buttonStyle(theme),
                    background: active ? theme.success : theme.secondary,
                    color: active ? "#fff" : theme.label,
                    fontWeight: active ? 600 : 500,
                    fontSize: "0.95rem",
                    padding: "0.48rem 0.2rem",
                  }}
                  title={w}
                >
                  <span style={{ display: "block", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {w}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setForm((f) => ({ ...f, weaponsSelected: [] }));
              }}
              style={{ ...buttonStyle(theme), background: theme.danger, color: "#fff", flex: 1 }}
            >
              Очистити
            </button>
            <button
              onClick={() => setShowWeaponsModal(false)}
              style={{ ...buttonStyle(theme), background: theme.button, color: "#fff", flex: 1 }}
            >
              OK
            </button>
          </div>
        </ModalShell>
      )}

      {/* Оружие (старое) */}
      {showAmmoModal && (
        <ModalShell theme={theme} onClose={() => setShowAmmoModal(false)} title="Оберіть типи зброї">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: 12 }}>
            {ammoList.map((w) => (
              <button
                key={w}
                onClick={() => {
                  setForm((f) => {
                    const ammo = { ...(f.ammo || {}) };
                    if (ammo[w] !== undefined) delete ammo[w];
                    else ammo[w] = "";
                    saveAmmo(ammo);
                    return { ...f, ammo };
                  });
                }}
                style={{
                  ...buttonStyle(theme),
                  background: (form.ammo || {})[w] !== undefined ? theme.success : theme.secondary,
                  color: (form.ammo || {})[w] !== undefined ? "#fff" : theme.label,
                  fontWeight: (form.ammo || {})[w] !== undefined ? 600 : 500,
                  fontSize: "0.97rem",
                  padding: "0.48rem 0.2rem",
                }}
                title={w}
              >
                <span style={{ display: "block", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {w}
                </span>
              </button>
            ))}
          </div>
          <button style={{ ...buttonStyle(theme), width: "100%", background: theme.button, fontWeight: 600, margin: 0 }} onClick={() => setShowAmmoModal(false)}>
            OK
          </button>
        </ModalShell>
      )}

      {/* Звання */}
      {showRankModal && (
        <ModalShell theme={theme} onClose={() => setShowRankModal(false)} title="Оберіть звання">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {ranksList.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setForm((f) => {
                    const arr = [...(f.personnel || [])];
                    const current = arr[activePersonnelIndex] || { rank: "", name: "" };
                    arr[activePersonnelIndex] = { ...current, rank: r };
                    savePersonnel(arr);
                    return { ...f, personnel: arr };
                  });
                  setShowRankModal(false);
                }}
                style={{
                  ...buttonStyle(theme),
                  background: (form.personnel || [])[activePersonnelIndex]?.rank === r ? theme.success : theme.secondary,
                  color: (form.personnel || [])[activePersonnelIndex]?.rank === r ? "#fff" : theme.label,
                  fontWeight: (form.personnel || [])[activePersonnelIndex]?.rank === r ? 600 : 500,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* ===================== UI helpers ===================== */

function ModalShell({ theme, title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 20000,
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: theme.card,
          borderRadius: 18,
          boxShadow: theme.shadow,
          padding: 16,
          maxWidth: 420,
          width: "95vw",
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 12, fontSize: "1.09rem", color: theme.label, fontWeight: 600, textAlign: "center" }}>
          {title}
        </h3>

        {children}

        <button
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            background: "none",
            border: "none",
            color: theme.danger,
            fontSize: 24,
            fontWeight: 800,
            cursor: "pointer",
          }}
          onClick={onClose}
          title="Закрити"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function cardStyle(theme) {
  return {
    backgroundColor: theme.card,
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "1.2rem",
    boxShadow: theme.shadow,
    transition: "background .23s, box-shadow .18s",
  };
}

function labelStyle(theme) {
  return {
    fontSize: "1rem",
    marginBottom: "0.35rem",
    color: theme.label,
    fontWeight: 500,
    display: "block",
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
    transition: "background .2s, border .18s",
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
    margin: 0,
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: theme.shadow,
    transition: "background .2s, color .18s, box-shadow .2s",
  };
}
