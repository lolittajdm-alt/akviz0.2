import React, { useState, useEffect } from "react";

// iOS system font
const systemFont = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;

// ——— Полный список оружия (сокращено для примера, добавь все свои!) ———
const weaponsList = [
  "АКС-74У - 5.45х39мм", "АКМ - 7.62х39мм", "АК-74 - 5.45х39мм",
  "Спарка Максим - 7.62x54мм", "Grot - 5.56х45мм",
  "CZ BREN 2 - 5.56х45мм", "РПК-74 - 5.45х39мм",
  "РПКЛ - 7.62х39мм", "ДП-27 - 7.62x54мм", "ДШК - 12.7х108мм",
  "ДШКМ - 12.7х108мм", "ПКТ - 7.62x54мм", "ПКM - 7.62x54мм",
  "КПВТ - 14.5x114мм", "MG-42 - 7.62х51мм", "MG3 - 7.62х51мм",
  "CANiK M2 - 12.7х99мм", "Browning M2 - 12.7х99мм", "НСВ - 12.7х108мм",
  "ЗПУ-2 - 14.5x114мм", "FN MAG - 7.62х51мм", "FN MINIMI - 5.56х45мм",
  "ЗУ 23-2 - 23х152мм", "АЗГ М-75 - 20x110мм", "АЗГ-57 - 57мм",
  "Bofors L70 - 40мм", "Gepard 1A2 - 35х228мм", "Тунгуска гармата - 30мм",
  "ЗКР Ігла", "НДЖ Ігла", "ЗКР Ігла-1", "НДЖ Ігла-1", "ЗКР Стріла-2",
  "НДЖ Стріла-2", "ЗКР Стріла-2М", "НДЖ Стріла-2М", "ЗКР Стріла-3",
  "НДЖ Стріла-3", "ЗКР Stinger", "НДЖ Stinger", "ЗКР Piorun",
  "НДЖ Piorun", "Тунгуска ЗКР - ЗКР 9M311", "ЗРК DASH - ракета AGM-114L"
];

const goalsList = [
  "КР", "Літак Малий", "БПЛА", "Гелікоптер", "Квадрокоптер", "Літак Великий",
  "Постріли", "Вибух", "Виходи", "Зонд", "Інше (деталі в описі)"
];
const namesList = ["Shahed-136", "Гербера", "Невстановлений"]; // примеры, дополни!

const detectionMethodsList = [
  "Акустично", "Візуально", "Радіолокаційно", "Із застосуванням приладів спостереження"
];

const resultList = ["Обстріляно", "Уражено"]; // только эти могут вызвать "Розхід БК"

export default function Home() {
  // ——— Тема ———
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("theme") === "dark"
      : false
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  // ——— Состояние формы ———
  const [form, setForm] = useState({
    sector: "",
    subdivision: "",
    position: "",
    location: "",
    region: "",
    time: "",
    selectedGoals: [],
    side: null,
    targetNumber: "",
    noIssue: false,
    name: null,
    quantity: 1,
    azimuth: "",
    course: "",
    height: "",
    distance: "",
    detectionMethods: [],
    result: null,
    description: "",
    // Розхід БК
    selectedWeapons: [],
    weaponsAmounts: {},
    // Пример дополнительных полей
    zrap: "",
    zradn: "",
    mv: "",
    D: "",
    H: "",
    A: "",
    K: ""
  });

  // ——— Модалка выбора оружия ———
  const [showWeaponModal, setShowWeaponModal] = useState(false);

  // ——— Темы ———
  const theme = isDark
    ? {
        bg: "#101012",
        card: "#23242a",
        inputBg: "#23242a",
        inputBorder: "#35363f",
        label: "#f8f8f8",
        secondary: "#32343b",
        button: "#0A84FF",
        success: "#32D74B",
        danger: "#FF375F",
        shadow: "0 4px 32px rgba(0,0,0,0.22)"
      }
    : {
        bg: "#f5f6fa",
        card: "#fff",
        inputBg: "#f2f2f7",
        inputBorder: "#d8d8de",
        label: "#262626",
        secondary: "#e9e9ee",
        button: "#007AFF",
        success: "#32D74B",
        danger: "#FF375F",
        shadow: "0 4px 32px rgba(30,30,70,0.07)"
      };

  // ——— Стили ———
  const cardStyle = (theme) => ({
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: theme.card,
    boxShadow: theme.shadow,
    transition: "background .23s"
  });
  const labelStyle = (theme) => ({
    color: theme.label,
    fontWeight: 500,
    fontSize: "1.08rem",
    marginBottom: "0.6rem"
  });
  const inputStyle = (theme) => ({
    background: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: "12px",
    padding: "0.62rem 1rem",
    color: theme.label,
    fontSize: "1.04rem",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    transition: "background .23s"
  });
  const buttonStyle = (theme) => ({
    border: "none",
    borderRadius: "12px",
    background: theme.button,
    color: "#fff",
    fontWeight: 600,
    boxShadow: theme.shadow,
    cursor: "pointer",
    transition: "background .18s, color .18s, box-shadow .18s"
  });

  // ——— iOS Switch (крупный) ———
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
        marginLeft: "1.1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          display: "block",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isDark ? "#32D74B" : "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
          position: "absolute",
          top: 5,
          left: isDark ? 31 : 5,
          transition: "left .22s cubic-bezier(.47,1.64,.41,.8), background .2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isDark ? (
          <span style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            fontSize: 19, color: "#fff"
          }}>🌙</span>
        ) : (
          <span style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            fontSize: 19, color: "#ffe200"
          }}>☀️</span>
        )}
      </span>
    </button>
  );

  // ——— Колбэки ———
  const onFieldNumeric = (field, max = null) => (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (max && +value > max) value = max.toString();
    setForm((f) => ({ ...f, [field]: value }));
  };
  const changeQuantity = (d) =>
    setForm((f) => ({
      ...f,
      quantity: Math.max(1, +(f.quantity || 1) + d),
    }));

  const toggleGoal = (goal) =>
    setForm((f) => {
      const arr = f.selectedGoals.includes(goal)
        ? f.selectedGoals.filter((g) => g !== goal)
        : [...f.selectedGoals, goal];
      // Если убираем БПЛА — очищаем имя
      if (goal === "БПЛА" && !arr.includes("БПЛА")) {
        return { ...f, selectedGoals: arr, name: null };
      }
      return { ...f, selectedGoals: arr };
    });

  const selectName = (name) =>
    setForm((f) => ({ ...f, name }));

  const toggleDetection = (method) =>
    setForm((f) => ({
      ...f,
      detectionMethods: f.detectionMethods.includes(method)
        ? f.detectionMethods.filter((m) => m !== method)
        : [...f.detectionMethods, method]
    }));

  // ——— Генерация итогового отчёта в одну строку (как ты просил) ———
  const generateReportText = () => {
    // Цели с названием БПЛА
    const goals = form.selectedGoals.map(goal =>
      goal === "БПЛА" && form.name ? `БПЛА ${form.name}` : goal
    );

    // Оружие и расход БК (если есть)
    let ammoPart = "";
    if (
      (form.result === "Обстріляно" || form.result === "Уражено") &&
      form.selectedWeapons &&
      form.selectedWeapons.length > 0
    ) {
      ammoPart =
        "Витрата БК: " +
        form.selectedWeapons
          .map(
            w =>
              `${w}${form.weaponsAmounts?.[w] ? ` - ${form.weaponsAmounts[w]} шт.` : ""}`
          )
          .join(", ");
    }

    // Позиции (Д-100, H-100 и т.д.)
    const posFields = [];
    if (form.D) posFields.push(`Д-${form.D}`);
    if (form.H) posFields.push(`H-${form.H}`);
    if (form.A) posFields.push(`A-${form.A}`);
    if (form.K) posFields.push(`K-${form.K}`);
    const posString = posFields.length ? ` (${posFields.join(", ")})` : "";

    // Оружие в заголовке
    const weaponsPart =
      form.selectedWeapons && form.selectedWeapons.length > 0
        ? "з " + form.selectedWeapons.join(", ")
        : "";

    // Итоговая строка (примерно под твой шаблон)
    let result = [
      form.sector ? `Сектор «${form.sector}»` : "",
      form.time ? `, ${form.time}` : "",
      form.targetNumber ? ` - №${form.targetNumber}` : "",
      form.subdivision ? ` - ${form.subdivision}` : "",
      form.zrap ? ` - ${form.zrap}` : "",
      form.zradn ? `, зрадн ${form.zradn}` : "",
      form.position ? `, ${form.position}` : "",
      form.mv ? ` (${form.mv})` : "",
      form.location ? ` в районі ${form.location}` : "",
      form.region ? `, ${form.region}` : "",
      weaponsPart && ` ${weaponsPart}`,
      posString && ` ${posString}`,
      (form.result === "Обстріляно" || form.result === "Уражено")
        ? ` ${form.result} ${goals.join(", ")}`
        : "",
      ammoPart ? `. ${ammoPart}` : ""
    ]
      .filter(Boolean)
      .join("")
      .replace(/\s+/g, " ")
      .replace(/, ,/g, ",")
      .replace(/ - ,/g, " - ")
      .replace(/ ,/g, ",")
      .replace(/ \./g, ".");

    return result.trim();
  };

  // ——— Разметка ———
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        fontFamily: systemFont,
        color: theme.label,
        transition: "background .2s"
      }}
    >
      {/* ——— Хедер ——— */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "2.1rem 0 1.5rem 0.8rem"
      }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: "2.15rem",
          letterSpacing: "-1px",
          color: theme.label,
          margin: 0,
        }}>АкВіз 2.0</h2>
        {Switch}
      </div>

      <div style={{maxWidth: 540, margin: "0 auto", padding: "0 0.4rem"}}>

        {/* ——— Сектор ——— */}
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Сектор</label>
          <input
            type="text"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Введіть сектор"
          />
        </div>

        {/* ——— Підрозділ ——— */}
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Підрозділ</label>
          <input
            type="text"
            value={form.subdivision}
            onChange={e => setForm(f => ({ ...f, subdivision: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Введіть підрозділ"
          />
        </div>

        {/* ——— Позиція ——— */}
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Позиція</label>
          <input
            type="text"
            value={form.position}
            onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Введіть позицію"
          />
        </div>

        {/* ——— Місцезнаходження (нас. пункт) ——— */}
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Населений пункт</label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Введіть населений пункт"
          />
        </div>

        {/* ——— Ціль ——— */}
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
            {goalsList.map((goal, i) => (
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
                  ...(goal === "Інше (деталі в описі)" ? { gridColumn: "span 2" } : {})
                }}
                title={goal}
              >
                {goal}
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
                onChange={onFieldNumeric("targetNumber", 99999)}
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

        {/* ——— Назва БПЛА ——— */}
        {form.selectedGoals.includes("БПЛА") && (
          <div style={cardStyle(theme)}>
            <label style={labelStyle(theme)}>Назва БПЛА</label>
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
                    background: form.name === n
                      ? (isDark ? theme.success : theme.button)
                      : theme.secondary,
                    color: form.name === n ? "#fff" : theme.label,
                    fontWeight: form.name === n ? 600 : 500,
                    border: "none",
                    borderRadius: "14px",
                    boxShadow: form.name === n
                      ? (isDark
                        ? "0 2px 8px rgba(50,215,75,0.14)"
                        : "0 2px 8px rgba(10,132,255,0.14)")
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
              type="text"
              value={form.quantity}
              onChange={e =>
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
                backgroundColor: "#FF375F",
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
                backgroundColor: "#32D74B",
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

        {/* ——— Відстань та Висота (без border) ——— */}
        <div style={{
          border: "none",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: theme.card,
          boxShadow: theme.shadow,
          transition: "background .23s"
        }}>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle(theme)}>Відстань</label>
              <input
                type="text"
                value={form.distance}
                onChange={onFieldNumeric("distance", 99999)}
                inputMode="numeric"
                pattern="\d*"
                style={inputStyle(theme)}
                placeholder="м"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle(theme)}>Висота</label>
              <input
                type="text"
                value={form.height}
                onChange={onFieldNumeric("height", 99999)}
                inputMode="numeric"
                pattern="\d*"
                style={inputStyle(theme)}
                placeholder="м"
              />
            </div>
          </div>
        </div>

        {/* ——— Азимут, Курс ——— */}
        <div style={cardStyle(theme)}>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle(theme)}>Азимут</label>
              <input
                type="text"
                value={form.azimuth}
                onChange={onFieldNumeric("azimuth", 360)}
                inputMode="numeric"
                pattern="\d*"
                style={inputStyle(theme)}
                placeholder="0-360"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle(theme)}>Курс</label>
              <input
                type="text"
                value={form.course}
                onChange={onFieldNumeric("course", 360)}
                inputMode="numeric"
                pattern="\d*"
                style={inputStyle(theme)}
                placeholder="0-360"
              />
            </div>
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
            {detectionMethodsList.map((m) => (
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
                  background: form.result === r ? theme.success : theme.secondary,
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

        {/* ——— Розхід БК (отображается при Обстріляно/Уражено) ——— */}
        {(form.result === "Обстріляно" || form.result === "Уражено") && (
          <div style={{
            ...cardStyle(theme),
            marginTop: "1.1rem",
            padding: "1.1rem 0.7rem",
            position: "relative"
          }}>
            <label style={{
              ...labelStyle(theme),
              marginLeft: "0.3rem",
              marginBottom: "0.8rem"
            }}>Розхід БК</label>
            {form.selectedWeapons && form.selectedWeapons.length > 0 ? (
              <div style={{marginBottom: "0.7rem", fontSize: "1rem", color: theme.label}}>
                {form.selectedWeapons.map(w =>
                  `${w} ${form.weaponsAmounts?.[w] ? `— ${form.weaponsAmounts[w]} шт.` : ""}`
                ).join("; ")}
              </div>
            ) : (
              <div style={{
                fontSize: "1rem", color: theme.label, minHeight: 28, marginBottom: "0.7rem"
              }}>
                Оберіть тип зброї
              </div>
            )}
            <button
              style={{
                ...buttonStyle(theme),
                width: "100%",
                fontWeight: 600,
                padding: "0.7rem 0",
                fontSize: "1.03rem"
              }}
              onClick={() => setShowWeaponModal(true)}
            >
              Вибрати наявні типи зброї
            </button>
            {/* ——— Модальное окно выбора оружия ——— */}
            {showWeaponModal && (
              <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.37)",
                zIndex: 3000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <div style={{
                  background: theme.card,
                  borderRadius: 16,
                  padding: "1.5rem 1.3rem 1.3rem 1.3rem",
                  minWidth: 340,
                  boxShadow: theme.shadow,
                  maxHeight: "80vh",
                  overflow: "auto",
                  position: "relative"
                }}>
                  <div style={{fontWeight: 600, fontSize: "1.1rem", marginBottom: "1.2rem", textAlign: "center"}}>
                    Виберіть типи зброї і вкажіть кількість
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.2rem"}}>
                    {weaponsList.map(w => (
                      <div key={w} style={{display: "flex", alignItems: "center", gap: "0.7rem"}}>
                        <input
                          type="checkbox"
                          checked={form.selectedWeapons?.includes(w) || false}
                          onChange={e => {
                            setForm(f => {
                              const selected = f.selectedWeapons || [];
                              const newSel = e.target.checked
                                ? [...selected, w]
                                : selected.filter(sw => sw !== w);
                              // Удаляем количество если оружие убирают
                              const newAmounts = { ...(f.weaponsAmounts || {}) };
                              if (!e.target.checked) delete newAmounts[w];
                              return { ...f, selectedWeapons: newSel, weaponsAmounts: newAmounts };
                            });
                          }}
                          style={{width: 18, height: 18, accentColor: theme.success, cursor: "pointer"}}
                        />
                        <span style={{flex: 1}}>{w}</span>
                        {form.selectedWeapons?.includes(w) && (
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            placeholder="К-сть"
                            value={form.weaponsAmounts?.[w] || ""}
                            onChange={e =>
                              setForm(f => ({
                                ...f,
                                weaponsAmounts: {
                                  ...(f.weaponsAmounts || {}),
                                  [w]: e.target.value.replace(/\D/g, "")
                                }
                              }))
                            }
                            style={{
                              ...inputStyle(theme),
                              width: 70,
                              minWidth: 55,
                              textAlign: "center",
                              fontSize: "0.98rem"
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowWeaponModal(false)}
                    style={{
                      ...buttonStyle(theme),
                      width: "100%",
                      fontWeight: 600,
                      padding: "0.7rem 0",
                      fontSize: "1.03rem",
                      marginTop: 8
                    }}
                  >
                    Готово
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ——— Час ——— */}
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Час</label>
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.3rem" }}>
            <input
              type="text"
              value={form.time}
              onChange={onFieldNumeric("time", 9999)}
              placeholder="Введіть час (наприклад 19:11)"
              style={{
                ...inputStyle(theme),
                flex: 1,
                marginBottom: 0,
                height: 44,
                lineHeight: "44px",
                fontSize: "1rem"
              }}
              inputMode="numeric"
            />
            <button
              style={{
                ...buttonStyle(theme),
                backgroundColor: "#32D74B",
                color: "#fff",
                minWidth: 90,
                height: 44,
                fontWeight: 600,
                fontSize: "1.03rem"
              }}
              onClick={() => setForm(f => ({ ...f, time: new Date().toLocaleTimeString().slice(0,5) }))}
            >
              Щойно
            </button>
            <button
              style={{
                ...buttonStyle(theme),
                backgroundColor: theme.secondary,
                color: theme.label,
                minWidth: 54,
                height: 44,
                fontWeight: 600,
                fontSize: "1.03rem"
              }}
              onClick={() =>
                setForm(f => ({
                  ...f,
                  time: (() => {
                    const [hh, mm] = (f.time || "").split(":").map(Number);
                    if (!isNaN(hh) && !isNaN(mm)) {
                      let date = new Date();
                      date.setHours(hh, mm + 1);
                      return date
                        .toLocaleTimeString()
                        .slice(0, 5);
                    }
                    return f.time;
                  })()
                }))
              }
            >
              +1хв
            </button>
            <button
              style={{
                ...buttonStyle(theme),
                backgroundColor: theme.secondary,
                color: theme.label,
                minWidth: 54,
                height: 44,
                fontWeight: 600,
                fontSize: "1.03rem"
              }}
              onClick={() =>
                setForm(f => ({
                  ...f,
                  time: (() => {
                    const [hh, mm] = (f.time || "").split(":").map(Number);
                    if (!isNaN(hh) && !isNaN(mm)) {
                      let date = new Date();
                      date.setHours(hh, mm - 1);
                      return date
                        .toLocaleTimeString()
                        .slice(0, 5);
                    }
                    return f.time;
                  })()
                }))
              }
            >
              -1хв
            </button>
          </div>
        </div>

        {/* ——— Опис ——— */}
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Опис</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{
              ...inputStyle(theme),
              minHeight: 54,
              resize: "vertical"
            }}
            placeholder="Вкажіть додаткову інформацію"
          />
        </div>

        {/* ——— Кнопка/Звіт ——— */}
        <div style={{
          ...cardStyle(theme),
          marginBottom: 28,
          padding: "1.2rem 1rem"
        }}>
          <label style={labelStyle(theme)}>Звіт</label>
          <pre style={{
            background: theme.inputBg,
            color: theme.label,
            fontSize: "1.04rem",
            lineHeight: 1.5,
            padding: "0.92rem 1rem",
            borderRadius: "10px",
            minHeight: 54,
            marginTop: "0.7rem",
            marginBottom: "0.8rem",
            whiteSpace: "pre-wrap"
          }}>
            {generateReportText()}
          </pre>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button
              style={{
                ...buttonStyle(theme),
                flex: 1,
                background: theme.success,
                color: "#fff",
                fontWeight: 600,
                fontSize: "1.07rem"
              }}
              onClick={() => {
                navigator.clipboard.writeText(generateReportText());
              }}
            >
              Копіювати
            </button>
            <button
              style={{
                ...buttonStyle(theme),
                flex: 1,
                background: theme.button,
                color: "#fff",
                fontWeight: 600,
                fontSize: "1.07rem"
              }}
              onClick={() => {
                window.open(`https://wa.me/?text=${encodeURIComponent(generateReportText())}`);
              }}
            >
              Відправити в WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
