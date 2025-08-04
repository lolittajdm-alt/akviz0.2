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
    additionalInfo: "",
  });
  // ——— Состояние: показывать или скрывать верхние поля ———
  const [showTopFields, setShowTopFields] = useState(true);

useEffect(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("show_top_fields");
    if (saved !== null) {
      setShowTopFields(saved === "true");
    }
  }
}, []);
  // ——— Автоматичне визначення азимуту за сенсором ———
useEffect(() => {
  if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      if (alpha !== null && !isNaN(alpha)) {
        const azimuth = Math.round(alpha);
        setForm((prev) => ({ ...prev, azimuth: String(azimuth) }));
      }
    };

    if (
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }
}, []);

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
    "АКМ": "7.62×39мм",
    "АКС-74У": "5.45×39мм",
    "АК-74": "5.45×39мм",
    "Grot": "5.56×45мм",
    "CZ BREN 2": "5.56×45мм",
    "Спарка Максим": "7.62×54мм",
    "РПК-74": "5.45×39мм",
    "РПКЛ": "7.62×39мм",
    "ДП-27": "7.62×54мм",
    "ДШК": "12.7×108мм",
    "ДШКМ": "12.7×108мм",
    "ПКТ": "7.62×54мм",
    "ПКМ": "7.62×54мм",
    "КПВТ": "14.5×114мм",
    "MG-42": "7.62×51мм",
  };

  // ——— Таймер ———
const updateTime = () => {
  const now = new Date();
  setForm(f => ({
    ...f,
    time: `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
  }));
};
useEffect(updateTime, []);
  useEffect(() => {
  localStorage.setItem("show_top_fields", String(showTopFields));
}, [showTopFields]);

// ——— Відновлення полів із localStorage ———
useEffect(() => {
  const savedFields = ["sector", "subdivision", "position", "location"];
  const restored = {};

  savedFields.forEach((field) => {
    const val = localStorage.getItem(`report_${field}`);
    if (val !== null) restored[field] = val;
  });

  if (Object.keys(restored).length > 0) {
    setForm(f => ({ ...f, ...restored }));
  }
}, []);
  // ——— Відновлення полів із localStorage ———
useEffect(() => {
  const saved = localStorage.getItem("report_locks");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setLocks(prev => ({ ...prev, ...parsed }));
    } catch (err) {
      console.error("Помилка при читанні locks з localStorage:", err);
    }
  }
}, []);

  // ——— Общие хендлеры ———
  const handleChange = e => {
  const { name, value } = e.target;
  if (locks[name]) return;

  setForm(f => ({ ...f, [name]: value }));

  // Зберігати у localStorage для перших чотирьох полів
  if (["sector", "subdivision", "position", "location"].includes(name)) {
    localStorage.setItem(`report_${name}`, value);
  }

  setErrors(f => ({ ...f, [name]: false }));
};
  const toggleLock = field => {
  setLocks(prev => {
    const updated = { ...prev, [field]: !prev[field] };
    localStorage.setItem("report_locks", JSON.stringify(updated));
    return updated;
  });
};
  const isEmpty = field => !form[field]?.trim();

  // ——— Цели ———
  const toggleGoal = g => {
    setForm(f => {
      const exists = f.selectedGoals.includes(g);
      const newGoals = exists
        ? f.selectedGoals.filter(x => x !== g)
        : [...f.selectedGoals, g];
      return { ...f, selectedGoals: newGoals, name: newGoals.includes("БПЛА") ? f.name : null };
    });
  };
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

  // ——— Валидации ———
  const validateAzimuth = v => /^\d{1,3}$/.test(v) && +v <= 359;
  const validateCourse = v => /^\d{1,3}$/.test(v) && +v <= 359;
  const validateDistance = v => /^\d+$/.test(v) && +v > 0;
  const validateHeight = v => /^\d+$/.test(v);

  const onAzimuthChange = e => {
    let v = e.target.value.replace(/\D/g,"").slice(0,3);
    setForm(f => ({ ...f, azimuth: v }));
    setErrors(f => ({ ...f, azimuth: !validateAzimuth(v) }));
  };
  const onCourseChange = e => {
    let v = e.target.value.replace(/\D/g,"").slice(0,3);
    setForm(f => ({ ...f, course: v }));
    setErrors(f => ({ ...f, course: !validateCourse(v) }));
  };
  const onDistanceChange = e => {
    let v = e.target.value.replace(/\D/g,"");
    setForm(f => ({ ...f, distance: v }));
    setErrors(f => ({ ...f, distance: !validateDistance(v) }));
  };
  const changeDistance = d => {
    let x = +form.distance || 0;
    x += d; if (x < 0) x = 0;
    setForm(f => ({ ...f, distance: String(x) }));
    setErrors(f => ({ ...f, distance: !validateDistance(String(x)) }));
  };
  const onHeightChange = e => {
    let v = e.target.value.replace(/\D/g,"");
    setForm(f => ({ ...f, height: v }));
    setErrors(f => ({ ...f, height: !validateHeight(v) }));
  };
  const changeHeight = d => {
    let h = +form.height || 0;
    h += d; if (h < 0) h = 0;
    setForm(f => ({ ...f, height: String(h) }));
    setErrors(f => ({ ...f, height: !validateHeight(String(h)) }));
  };

  // ——— Время ———
  const changeTimeByMinutes = d => {
    const [H, M] = form.time.split(":").map(Number);
    let total = H*60 + M + d;
    if (total < 0) total=0;
    if (total > 24*60-1) total = 24*60-1;
    const hh = String(Math.floor(total/60)).padStart(2,"0");
    const mm = String(total%60).padStart(2,"0");
    setForm(f => ({ ...f, time:`${hh}:${mm}` }));
  };
  const setTimeNow = () => updateTime();

  // ——— Копировать/WhatsApp ———
  const copyToClipboard = () => {
  const text = `
П: ${form.sector},${form.subdivision},${form.position}
Ціль: ${form.selectedGoals.join(", ")},${form.side || ""},${form.noIssue ? "Без видачі" : form.targetNumber}
Висота: ${form.height ? form.height + " м" : ""}
Відстань: ${form.distance ? form.distance + " м" : ""}
Кількість: ${form.quantity} од.
А: ${form.azimuth ? form.azimuth + "°" : ""}
К: ${form.course ? form.course + "°" : ""}
НП: ${form.location}
Ч: ${form.time}
Вияв: ${form.detectionMethods.length ? form.detectionMethods.join(", ") : ""}
ПП: ${form.result || ""}
Опис: ${[form.additionalInfo, form.description].filter(Boolean).join(". ")}
`.trim();

  navigator.clipboard.writeText(text);
  alert("Скопійовано!");
};
  const openWhatsApp = () => {
  const text = `
П: ${form.sector},${form.subdivision},${form.position}
Ціль: ${form.selectedGoals.join(", ")},${form.side || ""},${form.noIssue ? "Без видачі" : form.targetNumber}
Висота: ${form.height ? form.height + " м" : ""}
Відстань: ${form.distance ? form.distance + " м" : ""}
Кількість: ${form.quantity} од.
А: ${form.azimuth ? form.azimuth + "°" : ""}
К: ${form.course ? form.course + "°" : ""}
НП: ${form.location}
Ч: ${form.time}
Вияв: ${form.detectionMethods.length ? form.detectionMethods.join(", ") : ""}
ПП: ${form.result || ""}
Опис: ${form.description || ""}
`.trim();

  const encoded = encodeURIComponent(text);

  // Використає системний WhatsApp (звичайний або бізнес)
  window.location.href = `whatsapp://send?text=${encoded}`;
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
  fontSize: "0.8rem", // ← зменшено вдвічі
  marginBottom: "0.4rem",
  fontWeight: 700,
};
  function toggleDetection(method) {
  setForm((prev) => {
    const alreadySelected = prev.detectionMethods.includes(method);
    return {
      ...prev,
      detectionMethods: alreadySelected
        ? prev.detectionMethods.filter((m) => m !== method)
        : [...prev.detectionMethods, method],
    };
  });
}
  return (
    <div
  style={{
    width: "100vw",              // ширина рівна ширині екрана
    maxWidth: "100vw",           // не ширше екрана
    height: "100vh",             // на весь екран по висоті
    overflowY: "auto",
    padding: "1rem",
    backgroundColor: "#1e2b40",
    color: "#fff",
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  }}
>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
  <h1 style={{ fontSize: "1.5rem", margin: 0 }}>АкВіз 2.0</h1>
  <button
    onClick={() => window.location.reload()}
    style={{
      ...buttonStyle,
      backgroundColor: "#444"  // Темний, як інші
    }}
  >
    Оновити
  </button>
</div>
{/* Кнопка згортання/розгортання */}
<div style={{ marginBottom: "1rem" }}>
  <button
    onClick={() => setShowTopFields(prev => !prev)}
    style={{
      ...buttonStyle,
      backgroundColor: "#444",
      width: "100%"
    }}
  >
    {showTopFields ? "Приховати поля" : "Показати поля"}
  </button>
</div>

{/* Верхні поля (умовно) */}
{showTopFields && (
  <>
    {/* Сектор */}
    <div style={blockMargin}>
      <label style={labelStyle}>Сектор</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          name="sector"
          value={form.sector}
          onChange={handleChange}
          style={inputStyle(locks.sector)}
        />
        <button
          onClick={() => toggleLock("sector")}
          style={{
            ...buttonStyle,
            backgroundColor: locks.sector ? "#a94442" : "#4caf50"
          }}
        >
          {locks.sector ? "Заблоковано" : "Редагувати"}
        </button>
      </div>
    </div>

    {/* Підрозділ */}
    <div style={blockMargin}>
      <label style={labelStyle}>Підрозділ</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          name="subdivision"
          value={form.subdivision}
          onChange={handleChange}
          style={inputStyle(locks.subdivision)}
        />
        <button
          onClick={() => toggleLock("subdivision")}
          style={{
            ...buttonStyle,
            backgroundColor: locks.subdivision ? "#a94442" : "#4caf50"
          }}
        >
          {locks.subdivision ? "Заблоковано" : "Редагувати"}
        </button>
      </div>
    </div>

    {/* Позиція */}
    <div style={blockMargin}>
      <label style={labelStyle}>Позиція</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          style={inputStyle(locks.position)}
        />
        <button
          onClick={() => toggleLock("position")}
          style={{
            ...buttonStyle,
            backgroundColor: locks.position ? "#a94442" : "#4caf50"
          }}
        >
          {locks.position ? "Заблоковано" : "Редагувати"}
        </button>
      </div>
    </div>

    {/* Населений пункт */}
    <div style={blockMargin}>
      <label style={labelStyle}>Населений пункт</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          style={inputStyle(locks.location)}
        />
        <button
          onClick={() => toggleLock("location")}
          style={{
            ...buttonStyle,
            backgroundColor: locks.location ? "#a94442" : "#4caf50"
          }}
        >
          {locks.location ? "Заблоковано" : "Редагувати"}
        </button>
      </div>
    </div>
  </>
)}

        {/* ——— Ціль ——— */}
<div
  style={{
    marginBottom: "0.8rem",
    padding: "0.8rem",
    border: "1px solid #444",
    borderRadius: "12px",
    backgroundColor: "transparent",
  }}
>
  <label style={{ ...labelStyle, fontSize: "1rem", marginBottom: "0.5rem" }}>
    Тип цілі
  </label>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      justifyContent: "space-between",
    }}
  >
    {goalsList.map((goal) => (
      <label
        key={goal}
        style={{
          flex: "1 1 calc(33.33% - 0.5rem)",
          display: "flex",
          alignItems: "center",
          backgroundColor: "transparent",
          color: "#fff",
          padding: "0.4rem 0.6rem",
          borderRadius: "8px",
          fontSize: "0.85rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="checkbox"
          checked={form.selectedGoals.includes(goal)}
          onChange={() => toggleGoal(goal)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            width: "1rem",
            height: "1rem",
            borderRadius: "50%",
            border: "2px solid #ccc",
            backgroundColor: form.selectedGoals.includes(goal)
              ? "#2e75ff"
              : "transparent",
            marginRight: "0.5rem",
            cursor: "pointer",
          }}
        />
        {goal}
      </label>
    ))}
  </div>
</div>
          {/* Сторона */}
        <div style={blockMargin}>
  <label style={{ ...labelStyle, fontSize: "1rem" }}>Сторона</label>
  <div style={{ display: "flex", gap: "0.5rem" }}>
    {["Ворожий", "Свій", "Нейтральний"].map((side) => (
      <label
        key={side}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: form.side === side ? "#2e75ff" : "#333",
          color: "#fff",
          padding: "0.4rem 0.8rem",
          borderRadius: "16px",
          fontSize: "0.9rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="radio"
          checked={form.side === side}
          onChange={() => selectSide(side)}
          style={{ marginRight: "0.5rem" }}
        />
        {side}
      </label>
    ))}
  </div>
</div>

        {/* Номер цілі */}
<div style={blockMargin}>
  <div style={labelStyle}>Номер цілі</div>
  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
    <input
      type="text"
      value={form.targetNumber}
      onChange={handleTargetNumberChange}
      disabled={form.noIssue}
      placeholder="номер цілі"
      inputMode="numeric"
      style={inputStyle(form.noIssue)}
    />
    <button
      onClick={toggleNoIssue}
      style={{
        ...buttonStyle,
        backgroundColor: form.noIssue ? "#a94442" : "#4caf50",
      }}
    >
      Без видачі
    </button>
  </div>
  {errors.targetNumber && (
    <div style={errorStyle}>
      Вкажіть номер цілі, або «Без видачі»
    </div>
  )}
</div> 
           
           {/* Назва */}
{form.selectedGoals.includes("БПЛА") && (
  <div style={blockMargin}>
    <label style={{ ...labelStyle, fontSize: "1rem" }}>Назва</label>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {namesList.map((name) => (
        <label
          key={name}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: form.name === name ? "#2e75ff" : "#333",
            color: "#fff",
            padding: "0.4rem 0.8rem",
            borderRadius: "16px",
            fontSize: "0.9rem",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="radio"
            checked={form.name === name}
            onChange={() => selectName(name)}
            style={{ marginRight: "0.5rem" }}
          />
          {name}
        </label>
      ))}
    </div>
  </div>
)}
        
        {/* Кількість */}
        <div style={blockMargin}>
          <div style={{ ...labelStyle, marginBottom:"0.3rem" }}>
            Кількість (од.)*
          </div>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <input
              type="number"
              value={form.quantity}
              min={1}
              onChange={e=>setForm(p=>({...p,quantity: Math.max(1,Number(e.target.value)||1)}))}
              style={{
                flexGrow:1,
                textAlign:"center",
                padding:"0.5rem",
                borderRadius:"6px",
                border:"none",
                backgroundColor:"#222",
                color:"#fff",
                fontSize:"1rem"
              }}
            />
            <button onClick={()=>changeQuantity(-1)} style={{padding:"0.5rem 3rem",backgroundColor:"#a94442",...buttonStyle}}>–1</button>
            <button onClick={()=>changeQuantity(1)}  style={{padding:"0.5rem 3rem",backgroundColor:"#4caf50",...buttonStyle}}>+1</button>
          </div>
        </div>

        {/* Азимут */}
<div style={{ ...blockMargin, display: "flex", flexDirection: "column" }}>
  <div style={labelStyle}>Азимут°*</div>
  <input
    type="text"
    inputMode="numeric"
    pattern="\d*"
    value={form.azimuth ? `${form.azimuth}°` : ""}
    onChange={onAzimuthChange}
    placeholder="0° – 359°"
    maxLength={4}
    style={{
      width: "100%",
      padding: "0.5rem",
      borderRadius: "6px",
      backgroundColor: "#222",
      color: "#fff",
      fontSize: "1rem",
      boxSizing: "border-box",
      border:
        form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)
          ? "1px solid #ff6666"
          : "none",
    }}
  />
  {(form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)) && (
    <div style={errorStyle}>
      Поле має бути заповненим та мати значення між 0°–359°
    </div>
  )}
</div>

        {/* Курс */}
<div style={{ ...blockMargin, display: "flex", flexDirection: "column" }}>
  <div style={labelStyle}>Курс°*</div>
  <input
    type="text"
    inputMode="numeric"
    pattern="\d*"
    value={form.course ? `${form.course}°` : ""}
    onChange={onCourseChange}
    placeholder="0° – 359°"
    maxLength={4}
    style={{
      width: "100%",
      padding: "0.5rem",
      borderRadius: "6px",
      backgroundColor: "#222",
      color: "#fff",
      fontSize: "1rem",
      boxSizing: "border-box",
      border:
        form.course.trim() === "" || !validateCourse(form.course)
          ? "1px solid #ff6666"
          : "none",
    }}
  />
  {(form.course.trim() === "" || !validateCourse(form.course)) && (
    <div style={errorStyle}>
      Поле має бути заповненим та мати значення між 0°–359°
    </div>
  )}
</div>

        {/* Відстань */}
<div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
  <div style={labelStyle}>Відстань, м*</div>
  <input
    type="text"
    value={form.distance}
    onChange={onDistanceChange}
    placeholder="- о - о -"
    inputMode="numeric"
    style={{
      width:"100%",padding:"0.5rem",borderRadius:"6px",
      backgroundColor:"#222",color:"#fff",fontSize:"1rem",
      boxSizing:"border-box",
      border: form.distance.trim()===""||!validateDistance(form.distance)?"1px solid #ff6666":"none"
    }}
  />
  {(form.distance.trim()===""||!validateDistance(form.distance))&&(
    <div style={errorStyle}>Поле має бути заповненим та мати значення більше 0</div>
  )}
  
  {/* Кнопки з’являються тільки якщо є значення */}
  {form.distance.trim() !== "" && validateDistance(form.distance) && (
    <div style={{ display:"flex", gap:"0.3rem", marginTop:"0.3rem" }}>
      {[{label:"+100",delta:100},{label:"+1000",delta:1000},{label:"-100",delta:-100},{label:"-1000",delta:-1000}]
        .map(({label,delta})=>(
        <button
          key={label}
          onClick={()=>changeDistance(delta)}
          style={{...buttonStyle,flex:1}}
        >{label}</button>
      ))}
    </div>
  )}
</div>
       {/* Висота */}
<div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
  <div style={labelStyle}>Висота, м*</div>
  <input
    type="text"
    value={form.height}
    onChange={onHeightChange}
    placeholder="- о - о -"
    inputMode="numeric"
    style={{
      width:"100%",padding:"0.5rem",borderRadius:"6px",
      backgroundColor:"#222",color:"#fff",fontSize:"1rem",
      boxSizing:"border-box",
      border: form.height.trim()===""||!validateHeight(form.height)
        ? "1px solid #ff6666"
        : "none"
    }}
  />
  {(form.height.trim()===""||!validateHeight(form.height))&&(
    <div style={errorStyle}>
      Поле має бути заповненим та містити тільки число
    </div>
  )}

  {/* Кнопки зміни висоти — тільки якщо поле валідне */}
  {form.height.trim() !== "" && validateHeight(form.height) && (
    <div style={{ display:"flex", gap:"0.3rem", marginTop:"0.3rem" }}>
      {[{label:"+100 м",delta:100},{label:"+500 м",delta:500},{label:"-100 м",delta:-100},{label:"-500 м",delta:-500}]
        .map(({label,delta})=>(
        <button
          key={label}
          onClick={()=>changeHeight(delta)}
          style={{...buttonStyle,flex:1}}
        >
          {label}
        </button>
      ))}
    </div>
  )}
</div>

        {/* ——— Вияв ——— */}
<div style={blockMargin}>
  <label style={{ ...labelStyle, fontSize: "1rem" }}>Вияв</label>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      justifyContent: "space-between",
    }}
  >
    {[
      "Акустично",
      "Радіолокаційно",
      "Візуально",
      "Із застосуванням приладів спостереження",
    ].map((method) => (
      <label
        key={method}
        style={{
          flex: "1 1 calc(50% - 0.5rem)",
          display: "flex",
          alignItems: "center",
          backgroundColor: form.detectionMethods.includes(method)
            ? "#2e75ff"
            : "#333",
          color: "#fff",
          padding: "0.4rem 0.8rem",
          borderRadius: "16px",
          fontSize: "0.9rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="checkbox"
          checked={form.detectionMethods.includes(method)}
          onChange={() => toggleDetection(method)}
          style={{ marginRight: "0.5rem" }}
        />
        {method}
      </label>
    ))}
  </div>
</div>

        {/* Час */}
        <div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
          <div style={{ ...labelStyle, marginBottom:"0.3rem" }}>Час</div>
          <input
            type="text"
            value={form.time}
            readOnly
            style={{
              ...inputStyle(),width:"100%",boxSizing:"border-box",marginBottom:"0.5rem"
            }}
          />
          <div style={{ display:"flex", gap:"0.3rem" }}>
            <button onClick={setTimeNow} style={{...buttonStyle,flex:1,backgroundColor:"#4caf50"}}>Щойно</button>
            <button onClick={()=>changeTimeByMinutes(1)} style={{...buttonStyle,flex:1,backgroundColor:"#4caf50"}}>+1 хв</button>
            <button onClick={()=>changeTimeByMinutes(-1)} style={{...buttonStyle,flex:1,backgroundColor:"#a94442"}}>-1 хв</button>
          </div>
        </div>

        {/* ——— Результат ——— */}
<div style={blockMargin}>
  <label style={{ ...labelStyle, fontSize: "1rem" }}>Результат</label>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      justifyContent: "space-between",
    }}
  >
    {["Виявлено", "Обстріляно", "Уражено"].map((r) => (
      <label
        key={r}
        style={{
          flex: "1 1 calc(33.33% - 0.5rem)",
          display: "flex",
          alignItems: "center",
          backgroundColor: form.result === r ? "#2e75ff" : "#333",
          color: "#fff",
          padding: "0.4rem 0.8rem",
          borderRadius: "16px",
          fontSize: "0.9rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="radio"
          name="result"
          checked={form.result === r}
          onChange={() => setForm((f) => ({ ...f, result: r }))}
          style={{ marginRight: "0.5rem" }}
        />
        {r}
      </label>
    ))}
  </div>
</div>

        {/* Розхід БК */}
        <div style={blockMargin}>
          <div style={labelStyle}>Розхід БК</div>
          <button
            onClick={()=>setShowWeaponModal(true)}
            style={{...buttonStyle,width:"100%",backgroundColor:"#444"}}
          >Вибрати наявні типи зброї</button>
          {ammoList.map(w=>(
            <div
              key={w}
              style={{display:"flex",alignItems:"center",gap:"0.5rem",marginTop:"0.4rem"}}
            >
              <div style={{flex:2}}>{w} – {ammoCalibers[w]}</div>
              <input
                type="number"
                min={0}
                placeholder="шт."
                value={ammoQuantities[w] ?? ""}
                onChange={e=>setAmmoQuantities(q=>({...q,[w]:Number(e.target.value)}))}
                style={{
                  flex:1,padding:"0.3rem",borderRadius:"4px",border:"none",
                  backgroundColor:"#333",color:"#fff",fontSize:"0.9rem",textAlign:"center"
                }}
              />
            </div>
          ))}
        </div>

        <div style={blockMargin}>
  <label style={{ ...labelStyle, fontSize: "1rem" }}>Опис</label>
  <div style={{ display: "flex", gap: "0.5rem" }}>
    {["Змінила звук", "Змінила курс"].map((desc) => (
      <label
        key={desc}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: form.description === desc ? "#2e75ff" : "#333",
          color: "#fff",
          padding: "0.4rem 0.8rem",
          borderRadius: "16px",
          fontSize: "0.9rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="radio"
          checked={form.description === desc}
          onChange={() => setForm((f) => ({ ...f, description: desc }))}
          style={{ marginRight: "0.5rem" }}
        />
        {desc}
      </label>
    ))}
  </div>
</div>

        {/* Інша інформація */}
        <div style={{...blockMargin,display:"flex",flexDirection:"column"}}>
          <div style={labelStyle}>Інша інформація про ціль або застосування</div>
          <textarea
            name="additionalInfo"
            value={form.description}
            onChange={handleChange}
            placeholder="Інша інформація про ціль або застосування"
            style={{
              width:"100%",padding:"0.5rem",borderRadius:"6px",border:"none",
              backgroundColor:"#222",color:"#fff",fontSize:"1rem",boxSizing:"border-box",
              minHeight:"4rem",resize:"vertical"
            }}
          />
        </div>

        {/* ——— Звіт ——— */}
<div style={{ marginTop: "1.5rem" }}>
  <label
    style={{
      fontSize: "0.8rem",
      marginBottom: "0.5rem",
      display: "block",
      color: "#fff",
    }}
  >
    Звіт
  </label>
  <pre
    style={{
      whiteSpace: "pre-wrap",
      fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
      backgroundColor: "#222",
      padding: "1rem",
      borderRadius: "10px",
      color: "#fff",
      minHeight: "6rem",
    }}
  >
    {[
      form.sector || form.subdivision || form.position
        ? `П: ${[form.sector, form.subdivision, form.position].filter(Boolean).join(", ")}`
        : null,
      form.selectedGoals.length || form.side || form.targetNumber || form.noIssue
        ? `Ціль: ${[
            ...form.selectedGoals,
            form.side,
            form.noIssue ? "Без видачі" : form.targetNumber
          ].filter(Boolean).join(", ")}`
        : null,
      form.height ? `Висота: ${form.height} м` : null,
      form.distance ? `Відстань: ${form.distance} м` : null,
      form.quantity ? `Кількість: ${form.quantity} од.` : null,
      form.azimuth ? `А: ${form.azimuth}°` : null,
      form.course ? `К: ${form.course}°` : null,
      form.location ? `НП: ${form.location}` : null,
      form.time ? `Ч: ${form.time}` : null,
      form.detectionMethods.length ? `Вияв: ${form.detectionMethods.join(", ")}` : null,
      form.result ? `ПП: ${form.result}` : null,
      form.description?.trim() ? `Інше: ${form.description.trim()}` : null
    ]
      .filter(Boolean)
      .join("\n")}
  </pre>
</div>
        {/* Дії */}
        <div style={{display:"flex",gap:"1rem",marginBottom:"1rem"}}>
          <button
            onClick={copyToClipboard}
            style={{...buttonStyle,flex:1,backgroundColor:"#1e90ff"}}
          >Копіювати</button>
          <button
            onClick={openWhatsApp}
            style={{...buttonStyle,flex:1,backgroundColor:"#25d366"}}
          >Відкрити WhatsApp</button>
        </div>
      </div>

      {/* Модалка вибору зброї */}
      {showWeaponModal && (
        <div style={{
          position:"fixed",top:0,left:0,width:"100vw",height:"100vh",
          backgroundColor:"rgba(0,0,0,0.6)",display:"flex",
          alignItems:"center",justifyContent:"center"
        }}>
          <div style={{
            backgroundColor:"#222",padding:"1rem",borderRadius:"8px",
            maxWidth:"90%",width:320
          }}>
            <h2 style={{color:"#fff",marginBottom:"0.5rem"}}>Вибір зброї</h2>
            <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
              {Object.keys(ammoCalibers).map(w=>(
                <button
                  key={w}
                  onClick={()=>{
                    setAmmoList(l=>l.includes(w)?l:[...l,w]);
                    setShowWeaponModal(false);
                  }}
                  style={{
                    ...buttonStyle,
                    backgroundColor: ammoList.includes(w)?"#4caf50":"#666"
                  }}
                >{w}</button>
              ))}
            </div>
            <button
              onClick={()=>setShowWeaponModal(false)}
              style={{
                marginTop:"0.8rem",...buttonStyle,
                backgroundColor:"#1e90ff",width:"100%"
              }}
            >Закрити</button>
          </div>
        </div>
      )}
    </div>
  );
}
