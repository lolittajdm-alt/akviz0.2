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

  // ——— Общие хендлеры ———
  const handleChange = e => {
    const { name, value } = e.target;
    if (locks[name]) return;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(f => ({ ...f, [name]: false }));
  };
  const toggleLock = field => setLocks(l => ({ ...l, [field]: !l[field] }));
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
  const blockMargin = { marginBottom: "1rem" };
  const errorStyle = {
    color: "#ff6666",
    fontSize: "0.75rem",
    marginTop: "0.2rem",
  };
  const labelStyle = {
    fontSize: "0.9rem",
    marginBottom: "0.3rem",
    fontWeight: 600,
  };

  return (
    <div className="container">
      <div className="inner">
        <h1 className="title">««Доповідь»»</h1>

        {/* Сектор/Підрозділ/Позиція/Нас. пункт */}
        {[
          { key:"sector", label:"Сектор*" },
          { key:"subdivision", label:"Підрозділ* (напр. ____ зрап…)" },
          { key:"position", label:"Позиція*" },
          { key:"location", label:"Населений пункт*" },
        ].map(({ key,label })=>(
          <div key={key} className="block">
            <div className="label">{label}</div>
            <div className="row">
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                disabled={locks[key]}
                className={`input ${locks[key] ? "locked" : ""}`}
              />
              <button
                onClick={()=>toggleLock(key)}
                className={`btn-lock ${locks[key] ? "off" : "on"}`}
              >
                {locks[key]?"Заблоковано":"Редагувати"}
              </button>
            </div>
            {isEmpty(key)&&<div className="error">Поле має бути заповненим</div>}
          </div>
        ))}

        {/* Ціль */}
        <div className="block">
          <div className="label">Ціль</div>
          <div className="wrap">
            {goalsList.map(g=>(
              <button
                key={g}
                onClick={()=>toggleGoal(g)}
                className={`btn ${form.selectedGoals.includes(g)?"sel":""}`}
              >{g}</button>
            ))}
            <button onClick={resetGoals} className="btn sel">Оновити</button>
          </div>
        </div>

        {/* ... здесь точно такой же JSX для всех остальных блоков ... */}

        {/* Внизу кнопки */}
        <div className="actions">
          <button onClick={copyToClipboard} className="btn action">Копіювати</button>
          <button onClick={openWhatsApp}    className="btn action">WhatsApp</button>
        </div>
      </div>

      {/* Модалка */}
      {showWeaponModal && (
        <div className="modal-back">
          <div className="modal">
            <h2>Вибір зброї</h2>
            <div className="modal-list">
              {Object.keys(ammoCalibers).map(w=>(
                <button
                  key={w}
                  onClick={()=>{
                    setAmmoList(l=>l.includes(w)?l:[...l,w]);
                    setShowWeaponModal(false);
                  }}
                  className={`btn ${ammoList.includes(w)?"sel":""}`}
                >{w}</button>
              ))}
            </div>
            <button onClick={()=>setShowWeaponModal(false)} className="btn close">Закрити</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
          background: linear-gradient(135deg,#2c5364,#203a43,#0f2027);
          color: #fff;
          min-height: 100vh;
          padding: 2rem;
        }
        .inner {
          max-width: 600px;
          margin: 0 auto;
        }
        .title {
          text-align: center;
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .block { margin-bottom: 1rem; }
        .label { font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 600; }
        .row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .input {
          flex-grow: 1;
          padding: 0.5rem;
          border-radius: 6px;
          border: none;
          background: #444;
          color: #fff;
        }
        .input.locked {
          background: inherit;
          color: #ccc;
          cursor: not-allowed;
        }
        .btn {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          background: #666;
          color: #fff;
        }
        .btn.sel { background: #4caf50; }
        .btn-lock.on { background: #4caf50; }
        .btn-lock.off { background: #a94442; }
        .wrap { display: flex; flex-wrap: wrap; gap: 0.3rem; }
        .error { color: #ff6666; font-size: 0.75rem; margin-top: 0.2rem; }
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .actions .action { flex: 1; }

        /* модалка */
        .modal-back {
          position: fixed;
          top:0; left:0; width:100vw; height:100vh;
          background: rgba(0,0,0,0.6);
          display:flex; align-items:center; justify-content:center;
        }
        .modal {
          background: #222;
          padding: 1rem;
          border-radius:8px;
          width: 90%;
          max-width:320px;
        }
        .modal-list { display:flex; flex-direction:column; gap:0.4rem; }
        .modal .close { margin-top:0.8rem; width:100%; background:#1e90ff; }

        /* адаптив */
        @media (max-width: 600px) {
          .inner { padding: 0 1rem; }
          .title { font-size: 2.5rem; }
          .row, .wrap, .actions { flex-direction: column; }
          .btn { width: 100%; text-align: center; }
        }
      `}</style>
    </div>
  );
}
