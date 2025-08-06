import React, { useState, useEffect } from "react";

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
  });
  const [showTopFields, setShowTopFields] = useState(true);
  const [locks, setLocks] = useState({ sector: false, subdivision: false, position: false, location: false });
  const [errors, setErrors] = useState({ distance: false, height: false, course: false, azimuth: false });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ——— Эффекты ———
  useEffect(() => {
    console.log('theme change', isDarkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  // Переключатель темы
  const toggleTheme = () => {
    console.log('toggleTheme', isDarkMode);
    setIsDarkMode(v => !v);
  };

  // Установка текущего времени
  const updateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    setForm((f) => ({ ...f, time: formatted }));
  };
  useEffect(updateTime, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sf = localStorage.getItem("show_top_fields");
      if (sf != null) setShowTopFields(sf === "true");
      const ls = localStorage.getItem("report_locks");
      if (ls) setLocks(JSON.parse(ls));
      ["sector","subdivision","position","location"].forEach((k) => {
        const v = localStorage.getItem(`report_${k}`);
        if (v != null) setForm((f) => ({ ...f, [k]: v }));
      });
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("show_top_fields", showTopFields);
      localStorage.setItem("report_locks", JSON.stringify(locks));
    }
  }, [showTopFields, locks]);

  // ——— Хендлеры ———
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange', name, value);
    if (locks[name]) return;
    setForm((f) => ({ ...f, [name]: value }));
    if (["sector","subdivision","position","location"].includes(name)) {
      localStorage.setItem(`report_${name}`, value);
    }
  };
  const toggleLock = (f) => { setLocks((l) => ({ ...l, [f]: !l[f] })); };

  const changeQuantity = (d) => {
    console.log('changeQuantity', d);
    setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity + d) }));
  };
  const toggleGoal = (g) => {
    console.log('toggleGoal', g);
    setForm((f) => ({
      ...f,
      selectedGoals: f.selectedGoals.includes(g)
        ? f.selectedGoals.filter((x) => x !== g)
        : [...f.selectedGoals, g],
    }));
  };
  const selectSide = (s) => { console.log('selectSide', s); setForm((f) => ({ ...f, side: f.side===s?null:s })); };
  const selectName = (n) => { console.log('selectName', n); setForm((f) => ({ ...f, name: n })); };

  const validate = (v, maxLen) => /^\d+$/.test(v) && v.length<=maxLen;
  const onAzimuthChange = (e) => { const v=e.target.value.replace(/\D/g,'').slice(0,3); console.log('onAzimuthChange', v); setForm(f=>({...f, azimuth:v})); setErrors(err=>({...err, azimuth:!validate(v,3)})); };
  const onCourseChange  = (e) => { const v=e.target.value.replace(/\D/g,'').slice(0,3); console.log('onCourseChange', v);  setForm(f=>({...f, course:v })); setErrors(err=>({...err, course:!validate(v,3)})); };
  const onDistanceChange= (e) => { const v=e.target.value.replace(/\D/g,'').slice(0,5); console.log('onDistanceChange', v); setForm(f=>({...f, distance:v})); setErrors(err=>({...err, distance:!validate(v,5)})); };
  const onHeightChange  = (e) => { const v=e.target.value.replace(/\D/g,'').slice(0,5); console.log('onHeightChange', v); setForm(f=>({...f, height:v})); setErrors(err=>({...err, height:!validate(v,5)})); };

  const toggleDetection = (m) => { console.log('toggleDetection', m); setForm(f=>({ ...f, detectionMethods: f.detectionMethods.includes(m)?f.detectionMethods.filter(x=>x!==m):[...f.detectionMethods,m] })); };

  const generateReportText = () => {
    console.log('generateReportText');
    const isExp = form.selectedGoals.includes('Вибух');
    const isGun = form.selectedGoals.includes('Постріли(ЗУ,кулемет)');
    return [
      form.sector||form.subdivision||form.position?`П: ${[form.sector,form.subdivision,form.position].filter(Boolean).join(', ')}`:null,
      `Ціль: ${[...form.selectedGoals, form.side, form.noIssue?'Без видачі':`по цілі ${form.targetNumber}`].filter(Boolean).join(', ')}`,
      !isExp && form.height?`Висота: ${form.height} м`:null,
      form.distance?`Відстань: ${form.distance} м`:null,
      !isExp&&!isGun&&form.quantity?`Кількість: ${form.quantity} од.`:null,
      form.azimuth?`А: ${form.azimuth}°`:null,
      !isExp&&form.course?`К: ${form.course}°`:null,
      form.location?`НП: ${form.location}`:null,
      form.time?`Ч: ${form.time}`:null,
      form.detectionMethods.length?`Вияв: ${form.detectionMethods.join(', ')}`:null,
      form.result?`ПП: ${form.result}`:null,
      form.description?`Опис: ${form.description}`:null,
      form.additionalInfo?`Інфо: ${form.additionalInfo}`:null,
    ].filter(Boolean).join('\n');
  };
  const copyReport = () => { console.log('copyReport'); navigator.clipboard.writeText(generateReportText()); };
  const openWhatsApp = () => { console.log('openWhatsApp'); window.open(`whatsapp://send?text=${encodeURIComponent(generateReportText())}`); };

  // ——— Стили iOS & тема ———
  const iosContainer = { fontFamily:systemFont, minHeight:"100vh", padding:"1rem", background:isDarkMode?"#1C1C1E":"#FFFFFF", color:isDarkMode?"#F2F2F7":"#1C1C1E", transition:"background 0.3s,color 0.3s" };
  const iosCard = { background:isDarkMode?"rgba(44,44,46,0.9)":"rgba(255,255,255,0.8)", borderRadius:"16px", padding:"1rem", marginBottom:"1rem", boxShadow:isDarkMode?"0 2px 4px rgba(0,0,0,0.6)":"0 2px 4px rgba(0,0,0,0.1)", transition:"background 0.3s,box-shadow 0.3s" };
  const iosLabel = { fontSize:"0.9rem", marginBottom:"0.3rem", color:isDarkMode?"#F2F2F7":"#1C1C1E" };
  const iosInput = { width:"100%", padding:"0.6rem", borderRadius:"12px", border:"none", backgroundColor:isDarkMode?"#3C3C3E":"#ECECEC", fontSize:"1rem", marginBottom:"0.6rem", color:isDarkMode?"#FFFFFF":"#1C1C1E", transition:"background 0.3s,color 0.3s" };
  const iosButton = { padding:"0.6rem 1.2rem", fontSize:"1rem", borderRadius:"16px", border:"none", fontFamily:systemFont, cursor:"pointer", background:isDarkMode?"#3A3A3C":"#EBEBF5", color:isDarkMode?"#F2F2F7":"#1C1C1E", boxShadow:isDarkMode?"inset 0 1px 0 rgba(255,255,255,0.1)":"inset 0 1px 0 rgba(0,0,0,0.05)", transition:"background 0.3s,color 0.3s" };

  return (
    <div style={iosContainer}>
      {/* шапка */}
      <div style={{...iosCard,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{margin:0,fontSize:"1.4rem"}}>АкВіз 2.0</h1>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <button onClick={toggleTheme} style={{width:"2.6rem",height:"1.4rem",borderRadius:"1rem",background:isDarkMode?"#48484A":"#E5E5EA",padding:"2px",display:"flex",alignItems:"center",cursor:"pointer",transition:"background 0.3s"}}><div style={{width:"1rem",height:"1rem",borderRadius:"50%",background:"#FFFFFF",transform:isDarkMode?"translateX(1.2rem)":"translateX(0)",transition:"transform 0.3s"}}/></button>
          <button onClick={()=>window.location.reload()} style={{...iosButton,background:"#8E8E93",color:"#FFFFFF"}}>Оновити</button>
        </div>
      </div>

      {/* показать/скрыть */}
      <div style={iosCard}>
        <button onClick={()=>setShowTopFields(p=>!p)} style={{...iosButton,width:"100%"}}>{showTopFields?"Приховати поля":"Показати поля"}</button>
      </div>

      {/* поля */}
      {showTopFields && (
        <>
          <div style={iosCard}>
            <label style={iosLabel}>Сектор</label>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <input name="sector" value={form.sector} onChange={handleChange} style={iosInput} placeholder="ЦОП"/>
              <button onClick={()=>toggleLock("sector")} style={iosButton}>{locks.sector?"🔒":"✏️"}</button>
            </div>
            <label style={iosLabel}>Підрозділ</label>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <input name="subdivision" value={form.subdivision} onChange={handleChange} style={iosInput} placeholder="3 ОТБр"/>
              <button onClick={()=>toggleLock("subdivision")} style={iosButton}>{locks.subdivision?"🔒":"✏️"}</button>
            </div>
            <label style={iosLabel}>Позиція</label>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <input name="position" value={form.position} onChange={handleChange} style={iosInput} placeholder="МВГ Халк"/>
              <button onClick={()=>toggleLock("position")} style={iosButton}>{locks.position?"🔒":"✏️"}</button>
            </div>
          </div>
          <div style={iosCard}>
            <label style={iosLabel}>Н.пункт</label>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <input name="location" value={form.location} onChange={handleChange} style={iosInput} placeholder="Іванівка"/>
              <button onClick={()=>toggleLock("location")} style={iosButton}>{locks.location?"🔒":"✏️"}</button>
            </div>
          </div>
        </>
      )}
      <div style={iosCard}>
        <label style={iosLabel}>Ціль</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
          {goalsList.map((g)=>(
            <button key={g} onClick={()=>toggleGoal(g)} style={{...iosButton,flex:"1 1 calc(50% - 0.5rem)",background:form.selectedGoals.includes(g)?"#32D74B":iosButton.background,color:form.selectedGoals.includes(g)?"#fff":iosButton.color,borderRadius:"8px"}}>{g}</button>
          ))}
        </div>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Сторона</label>
        <div style={{display:"flex",gap:"0.5rem"}}>
          {['Ворожий','Свій','Нейтральний'].map(s=>(<button key={s} onClick={()=>selectSide(s)} style={{...iosButton,background:form.side===s?"#32D74B":iosButton.background,color:form.side===s?"#fff":iosButton.color}}>{s}</button>))}
        </div>
      </div>
      {!form.noIssue&&<div style={iosCard}>
        <label style={iosLabel}>Номер</label>
        <div style={{display:"flex",gap:"0.5rem"}}>
          <input name="targetNumber" value={form.targetNumber} onChange={handleChange} style={iosInput} placeholder="номер"/>
          <button onClick={()=>setForm(f=>({...f,noIssue:true,targetNumber:""}))} style={iosButton}>Без видачі</button>
        </div>
        {!form.targetNumber&&<div style={{color:"#FF3B30"}}>Вкажіть номер</div>}
      </div>}
      <div style={iosCard}>
        <label style={iosLabel}>Назва</label>
        <div style={{display:"flex",gap:"0.5rem"}}>
          {namesList.map(n=>(<button key={n} onClick={()=>selectName(n)} style={{...iosButton,background:form.name===n?"#32D74B":iosButton.background,color:form.name===n?"#fff":iosButton.color}}>{n}</button>))}
        </div>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Кількість</label>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
          <button onClick={()=>changeQuantity(-1)} style={{...iosButton,background:"#FF375F"}} disabled={form.quantity<=1}>–</button>
          <span style={{width:"2rem",textAlign:"center"}}>{form.quantity}</span>
          <button onClick={()=>changeQuantity(1)} style={{...iosButton,background:"#32D74B"}}>+</button>
        </div>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Азимут,°</label>
        <input value={form.azimuth} onChange={onAzimuthChange} style={{...iosInput,border:errors.azimuth?"1px solid #FF3B30":"none"}}/>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Курс,°</label>
        <input value={form.course} onChange={onCourseChange} style={{...iosInput,border:errors.course?"1px solid #FF3B30":"none"}}/>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Відстань,м*</label>
        <input value={form.distance} onChange={onDistanceChange} style={{...iosInput,border:errors.distance?"1px solid #FF3B30":"none"}}/>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Висота,м*</label>
        <input value={form.height} onChange={onHeightChange} style={{...iosInput,border:errors.height?"1px solid #FF3B30":"none"}}/>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Вияв</label>
        <div style={{display:"flex",gap:"0.5rem"}}>
          {['Акустично','Візуально'].map(m=><button key={m} onClick={()=>toggleDetection(m)} style={{...iosButton,flex:1,background:form.detectionMethods.includes(m)?"#32D74B":iosButton.background}}>{m}</button>)}
        </div>
        <button onClick={()=>toggleDetection('Із застосуванням приладів спостереження')} style={iosButton}>Із застосуванням приладів спостереження</button>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Результат</label>
        <div style={{display:"flex",gap:"0.5rem"}}>
          {['Уражено','Не уражено','Достовірно невизначено'].map(r=><button key={r} onClick={()=>setForm(f=>({...f,result:r}))} style={{...iosButton,background:form.result===r?"#32D74B":iosButton.background}}>{r}</button>)}
        </div>
      </div>
      <div style={iosCard}>
        <label style={iosLabel}>Опис</label>
        <textarea value={form.description} onChange={handleChange} name="description" style={{...iosInput,height:"80px"}}/>
      </div>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem"}}>
        <button onClick={copyReport} style={iosButton}>Копіювати</button>
        <button onClick={openWhatsApp} style={{...iosButton,background:"#34C759",color:"#FFFFFF"}}>WhatsApp</button>
      </div>
      <div style={iosCard}>
        <pre style={{whiteSpace:"pre-wrap",fontSize:"0.9rem"}}>{generateReportText()}</pre>
      </div>
    </div>
  );
}
