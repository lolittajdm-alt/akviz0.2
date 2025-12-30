import { useEffect, useState } from "react";

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
    ammo: {},
    personnel: [{ rank: "", name: "" }],
  });

  const [showTopFields, setShowTopFields] = useState(true);
  const [locks, setLocks] = useState({
    subdivision: false,
    location: false,
    region: false,
  });

  // ——— Модалки ———
  const [showSubdivisionModal, setShowSubdivisionModal] = useState(false);
  const [showCallsignPrefixModal, setShowCallsignPrefixModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showAmmoModal, setShowAmmoModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [activePersonnelIndex, setActivePersonnelIndex] = useState(0);

  // ——— localStorage init ———
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedShow = localStorage.getItem("show_top_fields");
    if (savedShow !== null) setShowTopFields(savedShow === "true");

    const l = localStorage.getItem("report_locks_v4");
    if (l) setLocks(JSON.parse(l));

    const keys = ["subdivision", "callsignPrefix", "callsignText", "location", "region"];
    keys.forEach((key) => {
      const v = localStorage.getItem(`report_${key}_v4`);
      if (v !== null) setForm((f) => ({ ...f, [key]: v }));
    });

    const savedAmmo = localStorage.getItem("akviz_ammo_v4");
    if (savedAmmo) setForm((f) => ({ ...f, ammo: JSON.parse(savedAmmo) }));

    const savedPersonnel = localStorage.getItem("akviz_personnel_v4");
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
    localStorage.setItem("report_locks_v4", JSON.stringify(locks));
  }, [showTopFields, locks]);

  // ——— Дата/время ———
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

  const saveAmmo = (ammoObj) => localStorage.setItem("akviz_ammo_v4", JSON.stringify(ammoObj));
  const savePersonnel = (arr) => localStorage.setItem("akviz_personnel_v4", JSON.stringify(arr));

  // ——— Хендлеры ———
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (locks[name]) return;
    setForm((f) => ({ ...f, [name]: value }));
    if (["subdivision", "callsignPrefix", "callsignText", "location", "region"].includes(name)) {
      localStorage.setItem(`report_${name}_v4`, value);
    }
  };
  const toggleLock = (field) => setLocks((l) => ({ ...l, [field]: !l[field] }));

  const toggleGoal = (g) =>
    setForm((f) => ({
      ...f,
      selectedGoals: f.selectedGoals.includes(g)
        ? f.selectedGoals.filter((x) => x !== g)
        : [...f.selectedGoals, g],
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
  };
  const changeDistance = (d) => {
    let x = +form.distance || 0;
    x += d;
    if (x < 0) x = 0;
    setForm((f) => ({ ...f, distance: String(x) }));
  };

  const validateHeight = (v) => /^\d+$/.test(v) && +v >= 0 && +v < 30000;
  const onHeightChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, height: v }));
  };
  const changeHeight = (d) => {
    let h = +form.height || 0;
    h += d;
    if (h < 0) h = 0;
    setForm((f) => ({ ...f, height: String(h) }));
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

    const allowedGoals = [
      "БПЛА", "Вибух", "КР", "Гелікоптер",
      "Літак Малий", "Літак Великий", "Квадрокоптер", "Зонд"
    ];
    const goalsForReport = selectedGoals.map((goal) => (goal === "БПЛА" && name ? `БПЛА (${name})` : goal));
    const hasAllowedGoal = selectedGoals.some((goal) => allowedGoals.includes(goal));

    return [
      date ? `Дата: ${date}` : null,
      time ? `Час: ${time}` : null,
      subdivision ? `Підрозділ: ${subdivision}` : null,
      fullCallsign ? `Позивний: ${fullCallsign}` : null,
      personnelString ? `О/С: ${personnelString}` : null,
      `Ціль: ${[...goalsForReport, side, noIssue ? "Без видачі" : targetNumber ? `${targetNumber}` : ""]
        .filter(Boolean)
        .join(", ")}`,
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
      ammoString || null,
    ]
      .filter(Boolean)
      .join("\n");
  };

  // ——— Тема ———
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
    textareaBg: isDark ? "#23242a" : "#fff",
    textareaText: isDark ? "#f7f7fb" : "#1C1C1E"
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
        <span style={{ fontSize: 22, color: isDark ? "#ffe200" : "#b7b7b7" }}>
          {isDark ? "☀️" : "🌙"}
        </span>
      </span>
    </button>
  );

  // ——— Стили (чтобы аккуратно как раньше) ———
  const styles = makeStyles(theme);

  return (
    <div style={{ fontFamily: systemFont, background: theme.bg, minHeight: "100vh", padding: "1rem", boxSizing: "border-box" }}>
      {/* Шапка */}
      <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.35rem", color: theme.label, fontWeight: 600 }}>АкВіз 2.0</h1>
        {Switch}
      </div>

      {/* Показать/скрыть */}
      <div style={{ ...styles.card, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setShowTopFields((p) => !p)}
          style={{ ...styles.btn, background: theme.secondary, color: theme.label, minWidth: 160 }}
        >
          {showTopFields ? "Приховати поля" : "Показати поля"}
        </button>
      </div>

      {/* Верхний блок */}
      {showTopFields && (
        <div style={styles.card}>
          {/* Підрозділ (как раньше: поле + кнопка справа) */}
          <div style={styles.blockRow}>
            <label style={styles.label}>Підрозділ</label>
            <div style={styles.row}>
              <button
                type="button"
                onClick={() => setShowSubdivisionModal(true)}
                disabled={locks.subdivision}
                style={{ ...styles.inputLikeBtn, opacity: locks.subdivision ? 0.6 : 1 }}
              >
                <span style={{ ...styles.inputText, opacity: form.subdivision ? 1 : 0.55 }}>
                  {form.subdivision || "Оберіть підрозділ"}
                </span>
                <span style={styles.chev}>›</span>
              </button>

              <button
                onClick={() => toggleLock("subdivision")}
                style={{
                  ...styles.iconBtn,
                  background: locks.subdivision ? theme.danger : theme.secondary,
                  color: locks.subdivision ? "#fff" : theme.label
                }}
                title="Блок/Редагувати"
              >
                {locks.subdivision ? "🔒" : "✏️"}
              </button>
            </div>
          </div>

          {/* Особовий склад (без кнопок напротив полей, только один +) */}
          <div style={styles.blockRow}>
            <label style={styles.label}>Особовий склад</label>

            {(form.personnel || []).map((person, idx) => (
              <div key={idx} style={{ ...styles.row, marginBottom: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setActivePersonnelIndex(idx);
                    setShowRankModal(true);
                  }}
                  style={{ ...styles.inputLikeBtn, flex: "0 0 128px", maxWidth: 128 }}
                >
                  <span style={{ ...styles.inputText, opacity: person.rank ? 1 : 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {person.rank || "Звання"}
                  </span>
                  <span style={{ ...styles.chev, fontSize: 16 }}>⌄</span>
                </button>

                <input
                  value={person.name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      const arr = [...(f.personnel || [])];
                      arr[idx] = { ...arr[idx], name: v };
                      savePersonnel(arr);
                      return { ...f, personnel: arr };
                    });
                  }}
                  placeholder="Залужний В.Ф."
                  style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                />
              </div>
            ))}

            <button
              onClick={() =>
                setForm((f) => {
                  const arr = [...(f.personnel || []), { rank: "", name: "" }];
                  savePersonnel(arr);
                  return { ...f, personnel: arr };
                })
              }
              style={{ ...styles.btn, background: theme.success, color: "#fff", width: "100%", marginTop: 2, fontWeight: 600 }}
            >
              + Додати особовий склад
            </button>
          </div>

          {/* Позивний (две графы, БЕЗ кнопок справа) */}
          <div style={styles.blockRow}>
            <label style={styles.label}>Позивний</label>
            <div style={styles.row}>
              <button
                type="button"
                onClick={() => setShowCallsignPrefixModal(true)}
                style={{ ...styles.inputLikeBtn, flex: "0 0 96px", maxWidth: 96 }}
              >
                <span style={{ ...styles.inputText, opacity: form.callsignPrefix ? 1 : 0.55 }}>
                  {form.callsignPrefix || "МВГ"}
                </span>
                <span style={{ ...styles.chev, fontSize: 16 }}>⌄</span>
              </button>

              <input
                name="callsignText"
                value={form.callsignText}
                onChange={handleChange}
                placeholder="Введіть позивний"
                style={{ ...styles.input, marginBottom: 0, flex: 1 }}
              />
            </div>
          </div>

          {/* НП — 1 строка (как было: поле + кнопка справа) */}
          <div style={styles.blockRow}>
            <label style={styles.label}>Населений пункт</label>
            <div style={styles.row}>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Наприклад м. Кривий Ріг"
                style={{ ...styles.input, marginBottom: 0 }}
              />
              <button
                onClick={() => toggleLock("location")}
                style={{
                  ...styles.iconBtn,
                  background: locks.location ? theme.danger : theme.secondary,
                  color: locks.location ? "#fff" : theme.label
                }}
                title="Блок/Редагувати"
              >
                {locks.location ? "🔒" : "✏️"}
              </button>
            </div>
          </div>

          {/* Область — 2 строка (как было: поле-кнопка + кнопка справа) */}
          <div style={{ ...styles.blockRow, marginBottom: 0 }}>
            <label style={styles.label}>Область</label>
            <div style={styles.row}>
              <button
                type="button"
                onClick={() => setShowRegionModal(true)}
                disabled={locks.region}
                style={{ ...styles.inputLikeBtn, opacity: locks.region ? 0.6 : 1 }}
              >
                <span style={{ ...styles.inputText, opacity: form.region ? 1 : 0.55 }}>
                  {form.region || "Оберіть область"}
                </span>
                <span style={styles.chev}>›</span>
              </button>

              <button
                onClick={() => toggleLock("region")}
                style={{
                  ...styles.iconBtn,
                  background: locks.region ? theme.danger : theme.secondary,
                  color: locks.region ? "#fff" : theme.label
                }}
                title="Блок/Редагувати"
              >
                {locks.region ? "🔒" : "✏️"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ціль */}
      <div style={{ ...styles.card, padding: "1rem 0.7rem" }}>
        <label style={{ ...styles.label, marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Ціль</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem" }}>
          {goalsList.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              style={{
                ...styles.btn,
                background: form.selectedGoals.includes(goal) ? theme.success : theme.secondary,
                color: form.selectedGoals.includes(goal) ? "#fff" : theme.label,
                fontWeight: form.selectedGoals.includes(goal) ? 600 : 500,
                margin: 0,
                ...(goal === "Інше (деталі в описі)" ? { gridColumn: "span 2" } : {})
              }}
              title={goal}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Сторона */}
      <div style={styles.card}>
        <label style={styles.label}>Сторона</label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {["Ворожий", "Свій", "Нейтральний"].map((s) => (
            <button
              key={s}
              onClick={() => selectSide(s)}
              style={{
                ...styles.btn,
                background: form.side === s ? theme.success : theme.secondary,
                color: form.side === s ? "#fff" : theme.label,
                fontWeight: form.side === s ? 600 : 500,
                margin: 0
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Номер цілі */}
      <div style={styles.card}>
        <label style={styles.label}>Номер цілі</label>
        <div style={styles.row}>
          {!form.noIssue && (
            <input
              type="text"
              name="targetNumber"
              value={form.targetNumber}
              onChange={onFieldNumeric("targetNumber", 9999)}
              placeholder="по цілі"
              inputMode="numeric"
              pattern="\d*"
              style={{ ...styles.input, marginBottom: 0, textAlign: "center", flex: 1 }}
            />
          )}
          <button
            onClick={() => setForm((f) => ({ ...f, noIssue: !f.noIssue, targetNumber: "" }))}
            style={{
              ...styles.btn,
              background: form.noIssue ? theme.danger : theme.secondary,
              color: form.noIssue ? "#fff" : theme.label,
              margin: 0,
              flex: "0 0 150px"
            }}
          >
            {form.noIssue ? "Видати номер" : "Без видачі"}
          </button>
        </div>
      </div>

      {/* Назва (БПЛА) */}
      {form.selectedGoals.includes("БПЛА") && (
        <div style={{ ...styles.card, padding: "1rem 0.7rem" }}>
          <label style={{ ...styles.label, marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Назва</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem" }}>
            {namesList.map((n) => (
              <button
                key={n}
                onClick={() => selectName(n)}
                style={{
                  ...styles.btn,
                  background: form.name === n ? theme.button : theme.secondary,
                  color: form.name === n ? "#fff" : theme.label,
                  fontWeight: form.name === n ? 600 : 500,
                  margin: 0
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кількість */}
      <div style={styles.card}>
        <label style={styles.label}>Кількість</label>
        <div style={styles.row}>
          <input
            type="text"
            value={form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: Math.max(1, +e.target.value.replace(/\D/g, "")) }))}
            inputMode="numeric"
            pattern="\d*"
            style={{ ...styles.input, marginBottom: 0, textAlign: "center", flex: 1 }}
          />
          <button style={{ ...styles.iconBtn, background: theme.danger, color: "#fff" }} onClick={() => changeQuantity(-1)}>–</button>
          <button style={{ ...styles.iconBtn, background: theme.success, color: "#fff" }} onClick={() => changeQuantity(1)}>+</button>
        </div>
      </div>

      {/* Азимут / Курс */}
      <div style={styles.card}>
        <label style={styles.label}>Азимут (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={form.azimuth}
          onChange={onAzimuthChange}
          placeholder="Вкажіть азимут"
          style={{
            ...styles.input,
            border: form.azimuth.trim() === "" || !validateAzimuth(form.azimuth) ? `1px solid ${theme.danger}` : styles.input.border
          }}
        />
        {(form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)) && (
          <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "-0.25rem", marginBottom: "0.55rem" }}>
            Поле має бути заповненим!
          </div>
        )}

        <label style={styles.label}>Курс (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={form.course}
          onChange={onCourseChange}
          placeholder="Вкажіть курс"
          style={{
            ...styles.input,
            border: form.course.trim() === "" || !validateCourse(form.course) ? `1px solid ${theme.danger}` : styles.input.border
          }}
        />
        {(form.course.trim() === "" || !validateCourse(form.course)) && (
          <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "-0.25rem" }}>
            Поле має бути заповненим!
          </div>
        )}
      </div>

      {/* Відстань / Висота */}
      <div style={styles.card}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={styles.label}>Відстань, м*</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.distance}
            onChange={onDistanceChange}
            placeholder="Відстань до цілі"
            style={{
              ...styles.input,
              border: form.distance.trim() === "" || !validateDistance(form.distance) ? `1px solid ${theme.danger}` : styles.input.border
            }}
          />
          {(form.distance.trim() === "" || !validateDistance(form.distance)) && (
            <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "-0.25rem" }}>Поле має бути заповненим!</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+1000", "+5000", "-100", "-1000", "-5000"].map((label) => (
              <button
                key={label}
                onClick={() => changeDistance(Number(label))}
                style={{ ...styles.btn, margin: 0, background: label.startsWith("-") ? theme.danger : theme.success, color: "#fff", padding: "0.45rem 0.5rem" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Висота, м*</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.height}
            onChange={onHeightChange}
            placeholder="Висота над рівнем"
            style={{
              ...styles.input,
              border: form.height.trim() === "" || !validateHeight(form.height) ? `1px solid ${theme.danger}` : styles.input.border
            }}
          />
          {(form.height.trim() === "" || !validateHeight(form.height)) && (
            <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "-0.25rem" }}>Поле має бути заповненим!</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+500", "-100", "-500"].map((label) => (
              <button
                key={label}
                onClick={() => changeHeight(Number(label))}
                style={{ ...styles.btn, margin: 0, background: label.startsWith("-") ? theme.danger : theme.success, color: "#fff", padding: "0.45rem 0.5rem" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Дата/Час */}
      <div style={styles.card}>
        <label style={styles.label}>Дата</label>
        <div style={{ ...styles.row, marginBottom: 10 }}>
          <input value={form.date} readOnly style={{ ...styles.input, marginBottom: 0, textAlign: "center", flex: 1 }} />
          <button style={{ ...styles.iconBtn, background: theme.secondary, color: theme.label }} onClick={updateDate} title="Оновити дату">⟳</button>
        </div>

        <label style={styles.label}>Час</label>
        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          style={{ ...styles.input, textAlign: "center" }}
        />

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button style={{ ...styles.btn, margin: 0, background: theme.success, color: "#fff" }} onClick={() => { updateTime(); updateDate(); }}>
            Щойно
          </button>
          <button
            style={{ ...styles.btn, margin: 0, background: theme.success, color: "#fff" }}
            onClick={() => {
              let [h, m] = (form.time || "00:00").split(":").map(Number);
              m++;
              if (m > 59) { m = 0; h = (h + 1) % 24; }
              setForm((f) => ({ ...f, time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` }));
            }}
          >
            +1хв
          </button>
          <button
            style={{ ...styles.btn, margin: 0, background: theme.danger, color: "#fff" }}
            onClick={() => {
              let [h, m] = (form.time || "00:00").split(":").map(Number);
              m--;
              if (m < 0) { m = 59; h = h - 1; if (h < 0) h = 23; }
              setForm((f) => ({ ...f, time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` }));
            }}
          >
            -1хв
          </button>
        </div>
      </div>

      {/* Вияв */}
      <div style={{ ...styles.card, padding: "1rem 0.7rem" }}>
        <label style={{ ...styles.label, marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Вияв</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.65rem" }}>
          {["Акустично", "Візуально", "Радіолокаційно", "Із застосуванням приладів спостереження"].map((m) => (
            <button
              key={m}
              onClick={() => toggleDetection(m)}
              style={{
                ...styles.btn,
                background: form.detectionMethods.includes(m) ? theme.success : theme.secondary,
                color: form.detectionMethods.includes(m) ? "#fff" : theme.label,
                fontWeight: form.detectionMethods.includes(m) ? 600 : 500,
                margin: 0
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Результат */}
      <div style={styles.card}>
        <label style={styles.label}>Результат</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem" }}>
          <button
            onClick={() => setForm((f) => ({ ...f, result: null }))}
            style={{ ...styles.btn, margin: 0, background: form.result === null ? theme.success : theme.secondary, color: form.result === null ? "#fff" : theme.label }}
          >
            Виявлено
          </button>
          {["Обстріляно", "Уражено"].map((r) => (
            <button
              key={r}
              onClick={() => setForm((f) => ({ ...f, result: r }))}
              style={{ ...styles.btn, margin: 0, background: form.result === r ? theme.success : theme.secondary, color: form.result === r ? "#fff" : theme.label }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Розхід БК */}
      {["Обстріляно", "Уражено"].includes(form.result) && (
        <div style={styles.card}>
          <label style={styles.label}>Розхід БК</label>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {Object.keys(form.ammo || {}).length === 0 ? (
              <span style={{ color: theme.label, opacity: 0.6, fontSize: "0.98rem" }}>Оберіть тип зброї</span>
            ) : (
              Object.entries(form.ammo).map(([w, count]) => (
                <div key={w} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <span style={{ color: theme.label, fontWeight: 500, flex: 1 }}>{w}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={count}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setForm((f) => {
                        const ammo = { ...(f.ammo || {}), [w]: v };
                        saveAmmo(ammo);
                        return { ...f, ammo };
                      });
                    }}
                    placeholder="К-сть"
                    style={{ ...styles.input, marginBottom: 0, width: 150, textAlign: "center" }}
                  />
                </div>
              ))
            )}
          </div>

          <button style={{ ...styles.btn, width: "100%", fontWeight: 600 }} onClick={() => setShowAmmoModal(true)}>
            Вибрати наявні типи зброї
          </button>
        </div>
      )}

      {/* Опис */}
      <div style={styles.card}>
        <label style={styles.label}>Опис</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Додаткова інформація"
          rows={3}
          style={{
            width: "100%",
            padding: "0.7rem",
            borderRadius: 12,
            border: `1px solid ${theme.inputBorder}`,
            backgroundColor: theme.textareaBg,
            fontSize: "1rem",
            color: theme.textareaText,
            resize: "none",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem" }}>
        <button onClick={copyReport} style={{ ...styles.btn, margin: 0 }}>Копіювати</button>
        <button onClick={openWhatsApp} style={{ ...styles.btn, margin: 0, background: theme.success, color: "#fff" }}>
          WhatsApp
        </button>
      </div>

      {/* Отчет */}
      <div style={styles.card}>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "1rem", color: theme.label, margin: 0 }}>
          {generateReportText()}
        </pre>
      </div>

      {/* =================== МОДАЛКИ =================== */}

      {showSubdivisionModal && (
        <ModalShell theme={theme} onClose={() => setShowSubdivisionModal(false)} title="Оберіть підрозділ">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {subdivisionsList.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setForm((f) => ({ ...f, subdivision: item }));
                  localStorage.setItem("report_subdivision_v4", item);
                  setShowSubdivisionModal(false);
                }}
                style={{
                  ...styles.btn,
                  width: "100%",
                  margin: 0,
                  background: form.subdivision === item ? theme.success : theme.secondary,
                  color: form.subdivision === item ? "#fff" : theme.label,
                  fontWeight: form.subdivision === item ? 600 : 500
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={() => {
                setForm((f) => ({ ...f, subdivision: "" }));
                localStorage.setItem("report_subdivision_v4", "");
                setShowSubdivisionModal(false);
              }}
              style={{ ...styles.btn, margin: 0, background: theme.danger, color: "#fff" }}
            >
              Очистити
            </button>
            <button onClick={() => setShowSubdivisionModal(false)} style={{ ...styles.btn, margin: 0 }}>
              Закрити
            </button>
          </div>
        </ModalShell>
      )}

      {showCallsignPrefixModal && (
        <ModalShell theme={theme} onClose={() => setShowCallsignPrefixModal(false)} title="Оберіть тип">
          <div style={{ display: "flex", gap: 10 }}>
            {callsignPrefixList.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setForm((f) => ({ ...f, callsignPrefix: p }));
                  localStorage.setItem("report_callsignPrefix_v4", p);
                  setShowCallsignPrefixModal(false);
                }}
                style={{
                  ...styles.btn,
                  margin: 0,
                  background: form.callsignPrefix === p ? theme.success : theme.secondary,
                  color: form.callsignPrefix === p ? "#fff" : theme.label,
                  fontWeight: form.callsignPrefix === p ? 600 : 500
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setForm((f) => ({ ...f, callsignPrefix: "" }));
              localStorage.setItem("report_callsignPrefix_v4", "");
              setShowCallsignPrefixModal(false);
            }}
            style={{ ...styles.btn, margin: "12px 0 0", background: theme.danger, color: "#fff", width: "100%" }}
          >
            Очистити
          </button>
        </ModalShell>
      )}

      {showRegionModal && (
        <ModalShell theme={theme} onClose={() => setShowRegionModal(false)} title="Оберіть область">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {regionsList.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setForm((f) => ({ ...f, region: item }));
                  localStorage.setItem("report_region_v4", item);
                  setShowRegionModal(false);
                }}
                style={{
                  ...styles.btn,
                  margin: 0,
                  background: form.region === item ? theme.success : theme.secondary,
                  color: form.region === item ? "#fff" : theme.label,
                  fontWeight: form.region === item ? 600 : 500
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={() => {
                setForm((f) => ({ ...f, region: "" }));
                localStorage.setItem("report_region_v4", "");
                setShowRegionModal(false);
              }}
              style={{ ...styles.btn, margin: 0, background: theme.danger, color: "#fff" }}
            >
              Очистити
            </button>
            <button onClick={() => setShowRegionModal(false)} style={{ ...styles.btn, margin: 0 }}>
              Закрити
            </button>
          </div>
        </ModalShell>
      )}

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
                  ...styles.btn,
                  margin: 0,
                  background: ((form.personnel || [])[activePersonnelIndex]?.rank === r) ? theme.success : theme.secondary,
                  color: ((form.personnel || [])[activePersonnelIndex]?.rank === r) ? "#fff" : theme.label,
                  fontWeight: ((form.personnel || [])[activePersonnelIndex]?.rank === r) ? 600 : 500
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setForm((f) => {
                const arr = [...(f.personnel || [])];
                const current = arr[activePersonnelIndex] || { rank: "", name: "" };
                arr[activePersonnelIndex] = { ...current, rank: "" };
                savePersonnel(arr);
                return { ...f, personnel: arr };
              });
              setShowRankModal(false);
            }}
            style={{ ...styles.btn, margin: "12px 0 0", background: theme.danger, color: "#fff", width: "100%" }}
          >
            Очистити
          </button>
        </ModalShell>
      )}

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
                  ...styles.btn,
                  margin: 0,
                  background: (form.ammo || {})[w] !== undefined ? theme.success : theme.secondary,
                  color: (form.ammo || {})[w] !== undefined ? "#fff" : theme.label,
                  fontWeight: (form.ammo || {})[w] !== undefined ? 600 : 500,
                  fontSize: "0.97rem",
                  padding: "0.55rem 0.4rem"
                }}
              >
                {w}
              </button>
            ))}
          </div>

          <button style={{ ...styles.btn, margin: 0, width: "100%", fontWeight: 600 }} onClick={() => setShowAmmoModal(false)}>
            OK
          </button>
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
        padding: 12
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
          maxWidth: 440,
          width: "95vw",
          maxHeight: "82vh",
          overflowY: "auto",
          position: "relative"
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
            cursor: "pointer"
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

function makeStyles(theme) {
  return {
    card: {
      backgroundColor: theme.card,
      backdropFilter: "blur(10px)",
      borderRadius: 16,
      padding: "1rem",
      marginBottom: "1.2rem",
      boxShadow: theme.shadow,
      transition: "background .23s, box-shadow .18s",
      boxSizing: "border-box"
    },
    label: {
      fontSize: "1rem",
      marginBottom: "0.35rem",
      color: theme.label,
      fontWeight: 500,
      display: "block"
    },
    row: {
      display: "flex",
      gap: "0.6rem",
      alignItems: "center"
    },
    blockRow: {
      marginBottom: 16
    },
    input: {
      width: "100%",
      height: 44,
      padding: "0 0.9rem",
      borderRadius: 12,
      border: `1px solid ${theme.inputBorder}`,
      backgroundColor: theme.inputBg,
      fontSize: "1rem",
      color: theme.inputText,
      outline: "none",
      boxSizing: "border-box"
    },
    inputLikeBtn: {
      width: "100%",
      height: 44,
      padding: "0 0.9rem",
      borderRadius: 12,
      border: `1px solid ${theme.inputBorder}`,
      backgroundColor: theme.inputBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      boxSizing: "border-box",
      textAlign: "left"
    },
    inputText: {
      color: theme.inputText,
      fontSize: "1rem"
    },
    chev: {
      opacity: 0.6,
      color: theme.inputText,
      fontSize: 18,
      marginLeft: 10
    },
    btn: {
      height: 44,
      padding: "0 0.9rem",
      borderRadius: 12,
      border: "none",
      fontSize: "1rem",
      color: theme.buttonText,
      background: theme.button,
      cursor: "pointer",
      fontWeight: 500,
      boxShadow: theme.shadow,
      transition: "background .2s, color .18s, box-shadow .2s",
      boxSizing: "border-box"
    },
    iconBtn: {
      height: 44,
      width: 44,
      minWidth: 44,
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      fontSize: 18,
      boxShadow: theme.shadow,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  };
}
