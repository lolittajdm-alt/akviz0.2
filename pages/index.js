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
    const txt = encodeURIComponent(`
${copyToClipboard()}
    `);
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
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #2c5364,#203a43,#0f2027)",
      color: "#fff", minHeight: "100vh", padding: "2rem"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ textAlign:"center", fontSize:"3rem", marginBottom:"1rem" }}>
          ««Доповідь»»
        </h1>

        {/* Сектор/Підрозділ/Позиція/Нас. пункт */}
        {[
          { key:"sector", label:"Сектор*" },
          { key:"subdivision", label:"Підрозділ* (напр. ____ зрап…)" },
          { key:"position", label:"Позиція*" },
          { key:"location", label:"Населений пункт*" },
        ].map(({ key,label })=>(
          <div key={key} style={blockMargin}>
            <div style={labelStyle}>{label}</div>
            <div style={{display:"flex", gap:"0.5rem"}}>
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                disabled={locks[key]}
                style={inputStyle(locks[key])}
              />
              <button
                onClick={()=>toggleLock(key)}
                style={{
                  ...buttonStyle,
                  backgroundColor: locks[key]?"#a94442":"#4caf50"
                }}
              >
                {locks[key]?"Заблоковано":"Редагувати"}
              </button>
            </div>
            {isEmpty(key)&&<div style={errorStyle}>Поле має бути заповненим</div>}
          </div>
        ))}

        {/* Ціль */}
        <div style={blockMargin}>
          <div style={labelStyle}>Ціль</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
            {goalsList.map(g=>(
              <button
                key={g}
                onClick={()=>toggleGoal(g)}
                style={{
                  ...buttonStyle,
                  backgroundColor: form.selectedGoals.includes(g)?"#4caf50":"#666"
                }}
              >
                {g}
              </button>
            ))}
            <button onClick={resetGoals} style={{...buttonStyle, backgroundColor:"#4caf50"}}>
              Оновити
            </button>
          </div>
        </div>

        {/* Сторона */}
        <div style={blockMargin}>
          <div style={labelStyle}>Сторона</div>
          <div style={{ display:"flex", gap:"0.3rem" }}>
            {["Ворожий","Свій","Нейтральний"].map(s=>(
              <button
                key={s}
                onClick={()=>selectSide(s)}
                style={{
                  ...buttonStyle,
                  flexGrow:1,
                  backgroundColor: form.side===s?"#4caf50":"#666"
                }}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Номер цілі */}
        <div style={blockMargin}>
          <div style={labelStyle}>Номер цілі</div>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <input
              type="text"
              value={form.targetNumber}
              onChange={handleTargetNumberChange}
              disabled={form.noIssue}
              placeholder="номер цілі"
              style={inputStyle(form.noIssue)}
            />
            <button
              onClick={toggleNoIssue}
              style={{
                ...buttonStyle,
                backgroundColor: form.noIssue?"#a94442":"#4caf50"
              }}
            >Без видачі</button>
          </div>
          {errors.targetNumber&&<div style={errorStyle}>Вкажіть номер цілі, або «Без видачі»</div>}
        </div>

        {/* Назва */}
<div style={blockMargin}>
  <div style={labelStyle}>Назва</div>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
    {namesList.map((n) => (
      <button
        key={n}
        onClick={() => selectName(n)}
        disabled={!form.selectedGoals.includes("БПЛА")}
        style={{
          ...buttonStyle,
          flex: "1 1 auto",
          opacity: form.selectedGoals.includes("БПЛА") ? 1 : 0.5,
          backgroundColor: form.name === n ? "#4caf50" : buttonStyle.backgroundColor,
        }}
      >
        {n}
      </button>
    ))}
  </div>
</div>
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
        <div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
          <div style={labelStyle}>Азимут°*</div>
          <input
            type="text"
            value={form.azimuth?`${form.azimuth}°`:""}
            onChange={onAzimuthChange}
            placeholder="0 – 359"
            maxLength={4}
            style={{
              width:"100%",padding:"0.5rem",borderRadius:"6px",
              backgroundColor:"#222",color:"#fff",fontSize:"1rem",
              boxSizing:"border-box",
              border: form.azimuth.trim()===""||!validateAzimuth(form.azimuth)?"1px solid #ff6666":"none"
            }}
          />
          {(form.azimuth.trim()===""||!validateAzimuth(form.azimuth))&&(
            <div style={errorStyle}>Поле має бути заповненим та мати значення між 0°–359°</div>
          )}
        </div>

        {/* Курс */}
        <div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
          <div style={labelStyle}>Курс°*</div>
          <input
            type="text"
            value={form.course?`${form.course}°`:""}
            onChange={onCourseChange}
            placeholder="0 – 359"
            maxLength={4}
            style={{
              width:"100%",padding:"0.5rem",borderRadius:"6px",
              backgroundColor:"#222",color:"#fff",fontSize:"1rem",
              boxSizing:"border-box",
              border: form.course.trim()===""||!validateCourse(form.course)?"1px solid #ff6666":"none"
            }}
          />
          {(form.course.trim()===""||!validateCourse(form.course))&&(
            <div style={errorStyle}>Поле має бути заповненим та мати значення між 0°–359°</div>
          )}
        </div>

        {/* Відстань */}
        <div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
          <div style={labelStyle}>Відстань, м*</div>
          <input
            type="text"
            value={form.distance}
            onChange={onDistanceChange}
            placeholder="Відстань до цілі"
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
        </div>

        {/* Висота */}
        <div style={{ ...blockMargin, display:"flex", flexDirection:"column" }}>
          <div style={labelStyle}>Висота, м*</div>
          <input
            type="text"
            value={form.height}
            onChange={onHeightChange}
            placeholder="Висота над рівнем моря"
            style={{
              width:"100%",padding:"0.5rem",borderRadius:"6px",
              backgroundColor:"#222",color:"#fff",fontSize:"1rem",
              boxSizing:"border-box",
              border: form.height.trim()===""||!validateHeight(form.height)?"1px solid #ff6666":"none"
            }}
          />
          {(form.height.trim()===""||!validateHeight(form.height))&&(
            <div style={errorStyle}>Поле має бути заповненим та містити тільки число</div>
          )}
        </div>
        <div style={{ display:"flex", gap:"0.3rem", marginBottom:"0.3rem" }}>
          {[{label:"+100 м",delta:100},{label:"+500 м",delta:500},{label:"-100 м",delta:-100},{label:"-500 м",delta:-500}]
            .map(({label,delta})=>(
            <button
              key={label}
              onClick={()=>changeHeight(delta)}
              style={{...buttonStyle,flex:1}}
            >{label}</button>
          ))}
        </div>

        {/* Вияв */}
<div style={{ marginBottom: "1rem" }}>
  <div style={labelStyle}>Вияв</div>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
    {["Акустично", "Радіолокаційно", "Візуально"].map((method) => (
      <button
        key={method}
        onClick={() => toggleDetection(method)}
        style={{
          ...buttonStyle,
          flex: "1 1 auto",
          backgroundColor: form.detectionMethods.includes(method) ? "#4caf50" : buttonStyle.backgroundColor
        }}
      >
        {method}
      </button>
    ))}

    {/* 4-та кнопка на всю ширину */}
    <button
      onClick={() => toggleDetection("Із застосуванням приладів спостереження")}
      style={{
        ...buttonStyle,
        width: "100%",
        backgroundColor: form.detectionMethods.includes("Із застосуванням приладів спостереження") ? "#4caf50" : buttonStyle.backgroundColor
      }}
    >
      Із застосуванням приладів спостереження
    </button>
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

        {/* Результат */}
        <div style={blockMargin}>
          <div style={labelStyle}>Результат</div>
          <div style={{ display:"flex", gap:"0.3rem" }}>
            {["Виявлено","Обстріляно","Уражено"].map(r=>(
              <button
                key={r}
                onClick={()=>setForm(f=>({...f,result:r}))}
                style={{
                  ...buttonStyle,flex:1,
                  backgroundColor: form.result===r?"#4caf50":"#666"
                }}
              >{r}</button>
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

        {/* Опис */}
        <div style={blockMargin}>
          <div style={labelStyle}>Опис</div>
          <div style={{display:"flex",gap:"0.3rem"}}>
            <button
              onClick={()=>setForm(f=>({...f,description:"Змінила звук"}))}
              style={{...buttonStyle,flex:1,backgroundColor:form.description==="Змінила звук"?"#4caf50":"#666"}}
            >Змінила звук</button>
            <button
              onClick={()=>setForm(f=>({...f,description:"Змінила курс"}))}
              style={{...buttonStyle,flex:1,backgroundColor:form.description==="Змінила курс"?"#4caf50":"#666"}}
            >Змінила курс</button>
          </div>
        </div>

        {/* Інша інформація */}
        <div style={{...blockMargin,display:"flex",flexDirection:"column"}}>
          <div style={labelStyle}>Інша інформація про ціль або застосування</div>
          <textarea
            name="description"
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

        {/* Звіт */}
        <div style={{...blockMargin,marginTop:"2rem"}}>
          <h2 style={{...labelStyle,marginBottom:"0.5rem"}}>Звіт</h2>
          <div style={{
            backgroundColor:"transparent",color:"#fff",padding:"1rem",
            borderRadius:"6px",whiteSpace:"pre-wrap",fontFamily:"monospace"
          }}>
{`
П: ${form.sector},${form.subdivision},${form.position}
Ціль: ${form.selectedGoals.join(", ")},${form.side || ""},${form.noIssue ? "Без видачі" : form.targetNumber}
Висота: ${form.height ? form.height + " м" : ""}
Відстань: ${form.distance ? form.distance + " м" : ""}
Кількість: ${form.quantity} од.
А: ${form.azimuth ? form.azimuth + "°" : ""}
К: ${form.course ? form.course + "°" : ""}
НП: ${form.location}
Ч: ${form.time}
ПП: ${form.result || ""}
`}
          </div>
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
