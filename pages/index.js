import { useEffect, useMemo, useState } from "react";

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
  const subdivisionsList = [
    "ПвК Центр",
    "138 ртбр",
    "96 зрбр",
    "14 зрбр",
    "156 зрп",
    "39 брта",
    "40 брта",
    "831 брта",
    "31 опз та ртз",
    "110 ак",
    "21 ак",
    "121 ак",
    "1163 бо",
    "1129 зрп",
    "39 зрп",
    "223 зрп",
    "225 зрп",
    "201 зрбр",
    "302 зрбр",
    "540 зрбр",
    "164 ртбр",
    "114 брта",
    "25 брТрА",
    "1 брОП НГУ",
    "2 обр НГУ",
    "4 бр НГУ",
    "16 оабр НГУ",
    "21 обр НГУ",
    "22 обр НГУ",
    "27 обр НГУ",
    "28 п НГУ",
    "31 п НГУ",
    "36 п НГУ",
    "37 п НГУ",
    "38 п НГУ",
    "40 п НГУ",
    "45 п НГУ",
    "ОПБр",
    "101 обро ГШ",
    "125 овмбр",
    "172 брез",
    "178 брез",
    "72 омбр",
    "210 ОШП",
    "229 оцз",
    "3343 оцз втм",
    "13 озкб",
    "630 озкб",
    "631 озкб",
    "635 озкб",
    "637 озкб",
    "638 озкб",
    "642 озкб",
    "643 озкб",
    "644 озкб",
    "645 озкб",
    "646 озкб",
    "650 озкб",
    "1020 зрап",
    "1027 зрап",
    "1121 зрап",
    "1021 зап",
    "1 обр ТРО",
    "102 обр ТРО",
    "103 обр ТРО",
    "104 обр ТРО",
    "105 обр ТРО",
    "106 обр ТРО",
    "112 обр ТРО",
    "114 обр ТРО",
    "115 обр ТРО",
    "116 обр ТРО",
    "117 обр ТРО",
    "118 обр ТРО",
    "119 обр ТРО",
    "120 обр ТРО",
    "121 обр ТРО",
    "127 обр ТРО",
    "168 обр ТРО",
    "105 Прик3",
    "3 Прик3",
    "9 Прик3",
    "ДФТГ",
    "ДПСУ",
    "НГУ",
    "НПУ",
    "ГУР",
  ];
  const callsignPrefixList = ["МВГ", "ВГ"];

  const regionsList = ["Вінницька", "Житомирська", "Київська", "Кіровоградська", "Одеська", "Полтавська", "Сумська", "Черкаська", "Чернігівська"];

  const ranksList = ["cолд.", "cт.солд.", "мол.с-нт", "с-нт", "ст.с-нт", "гол.с-нт", "шт.с-нт", "м.с-нт", "мол.л-т", "л-т", "ст.л-т", "к-н", "м-р", "п.п-к", "п-к"];

  const goalsList = ["БПЛА", "Постріли", "Виходи(ПЗРК,ЗРК)", "Вибух", "КР", "Гелікоптер", "Літак малий", "Літак великий", "Квадрокоптер", "Зонд", "Інше (в коментарі)"];
  const namesList = ["Shahed-136", "Гербера", "Невстановлений"];

  // ——— Список оружия ———
  const ammoList = [
    "зі стрілецької зброї 5.45/5.56",
    "зі стрілецької зброї 7.62",
    "із ВКК Browning M2 12.7",
    "із ВКК CANiK M2 12.7",
    "із НСВ Утьос 12.7",
    "із ВКК ДШК 12.7",
    "із ВКК КПВТ 14.5",
    "із ЗКУ Viktor MR-2 14.5",
    "із ЗКУ-1(2) 14.5",
    "із АЗГ М-75 20мм.",
    "із ЗУ М-55 20мм.",
    "із ЗУ 23-2 23мм.",
    "із ЗУ 23-4 Рокач(Шилка) 23мм.",
    "із ЗУ VZ-53/59 Praga 30мм.",
    "із гарманти НР 30мм.",
    "із АЗГ L-70 Bofors 40мм.",
    "із АЗГ С-60 57мм.",
    "із ЗСАУ Cheeteh 35мм.",
    "із ЗСУ 1А2 Gepard 35мм.",
    "із ЗСАУ 2С6 Тунгуска",
    "із ПЗРК RBS-70",
    "із ПЗРК Ігла-С",
    "із ПЗРК Ігла(Ігла-1)",
    "із ПЗРК Stinger",
    "із ПЗРК FN-6",
    "із ПЗРК Piorun",
    "із ПЗРК Стріла-3",
    "із МОПУ Джигіт",
    "із ЗРК STASH",
    "із ЗРК DASH",
    "із ЗРК RAVEN",
    "із ЗРК Raven",
    "із ЗРК Avenger",
    "із ЗРК Оса АКМ",
    "із ЗРК СА-95",
    "із ЗРК ITEL-1,5",
  ];

  // ✅ Список боєприпасів (Розхід)
  const bkList = [
    "Розхід ЗКР",
    "Розхід НБЖ",
    "Снаряд 57х348мм. АЗГ(С-60)",
    "Снаряд 40х365мм. (L-70 Bofors)",
    "Снаряд 35х228мм. (Gepard)",
    "Снаряд 30х210мм. (VZ-53/50 Praga)",
    "Снаряд 30х155мм. (НР-30)",
    "Набій 23х152мм. (ЗУ-23-4) АРІ",
    "Набій 23х152мм. (ЗУ-23-2) ОФЗ",
    "Набій 23х152мм. (ЗУ-23-2) БЗТ",
    "Набій 23х152мм. (ЗУ-23-2) ОФЗТ",
    "Набій 20х110м. (АЗГ М-75, М55) БЗТ",
    "Набій 20х110м. (АЗГ М-75, М55) ТЗ",
    "Набій 20х110м. (АЗГ М-75, М55) ТЗО", 
    "Набій 14,5х114 мм (ЗПУ, КПВТ) МДЗ",
    "Набій 14,5х114 мм (ЗПУ, КПВТ) Б-32",
    "Набій 14,5х114 мм (ЗПУ, КПВТ) БЗТ",
    "Набій 12,7х108мм. (ДШК, НСВ, Корд, W85) МДЗ",
    "Набій 12,7х108мм. (ДШК, НСВ, Корд, W85) БЗТ",
    "Набій 12,7х108мм. (ДШК, НСВ, Корд, W85) Б-32",
    "Набій 12,7х108мм. (ДШК, НСВ, Корд, W85) 1СЛ",
    "Набій 12.7х108мм. FMJ",
    "Набій 12,7х99мм. (Canik , Browning)",
    "Набій 7,62х54мм. (ПКМ, КМ-7,62, СВД) ЛПС",
    "Набій 7,62х54мм. (ПКМ, КМ-7,62, СВД) Т-46",
    "Набій 7,62х54мм. (ПКМ, КМ-7,62, СВД) Б-32",
    "Набій 7,62х54мм. (ПКМ, КМ-7,62, СВД) ПЗ",
    "Набій 7,62х54мм. FMJ",
    "Набій 7,62х51мм. (CZ TSR, MG3, MG42, FN MAG) M-80, M-62",
    "Набій 7,62х39мм. (РКК, РКД, АКМ) ПС",
    "Набій 7,62х39мм. (РКК, РКД, АКМ) Т-45",
    "Набій 5,56х45мм. (FNS) SS109",
    "Набій 5,45х39мм. ПС",
    "Набій 5,45х39мм. Т"
                 ];

  // ——— Состояния формы ———
  const [form, setForm] = useState({
    subdivision: "",
    callsignPrefix: "",
    callsignText: "",
    location: "",
    region: "",
    weapons: [""],

    date: "",
    time: "",
    selectedGoals: [],
    side: null,
    targetNumber: "",
    noIssue: false,
    name: null,

    quantity: "",

    azimuth: "",
    course: "",
    distance: "",
    height: "",
    detectionMethods: [],

    result: null,

    explosionPlace: "",

    bk: [{ type: "", qty: "" }],

    description: "",

    additionalInfo: "",
    personnel: [{ rank: "", name: "" }],
  });

  const [showTopFields, setShowTopFields] = useState(true);
  const [errors, setErrors] = useState({});

  // ✅ Повна доповідь
  const [showFull, setShowFull] = useState(false);
  const [showFullSettings, setShowFullSettings] = useState(false);

  // ✅ Настройки повної доповіді
  const defaultFullSettings = useMemo(
    () => ({
      fireWeapon: "КПВТ",
      block1Prefix:
        "Номер обслуги 2 відділення 1 Зенітного ракетного взводу  \n2 зенітно-ракетної батареї \n2 зенітно-ракетного дивізіону в/ч А5101",
      block1Suffix: "відкрив вогонь з",
      block2:
        "надавали\nцілевказівку та здійснювали\nобʼєктивний контроль\nномер обслуги 1 відділення 3 зенітного ракетного взводу 2 зенітної ракетної батареї 2 зенітного ракетного дивізіону в/ч А5101 солдат Чабанюк Владислав Володимирович.",
      block3:
        "Номер обслуги 2 відділення 3 зенітного ракетного взводу 2 зенітної ракетної батареї 2 зенітного ракетного дивізіону в/ч А5101 молодший сержант ШЕВЧЕНКО Владислав Ігорович",
    }),
    []
  );
  const [fullSettings, setFullSettings] = useState(defaultFullSettings);

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

    const savedWeapons = localStorage.getItem("report_weapons_v3");
    if (savedWeapons) {
      try {
        const arr = JSON.parse(savedWeapons);
        if (Array.isArray(arr) && arr.length) setForm((f) => ({ ...f, weapons: arr }));
      } catch {}
    }

    const savedPersonnel = localStorage.getItem("akviz_personnel_v3");
    if (savedPersonnel) {
      try {
        const arr = JSON.parse(savedPersonnel);
        if (Array.isArray(arr) && arr.length) setForm((f) => ({ ...f, personnel: arr }));
      } catch {}
    }

    const savedBk = localStorage.getItem("akviz_bk_v3");
    if (savedBk) {
      try {
        const arr = JSON.parse(savedBk);
        if (Array.isArray(arr) && arr.length) setForm((f) => ({ ...f, bk: arr }));
      } catch {}
    }

    const savedFull = localStorage.getItem("akviz_full_settings_v3");
    if (savedFull) {
      try {
        const obj = JSON.parse(savedFull);
        if (obj && typeof obj === "object") setFullSettings((s) => ({ ...s, ...obj }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("show_top_fields", String(showTopFields));
  }, [showTopFields]);

  // ——— Helpers localStorage ———
  const savePersonnel = (arr) => localStorage.setItem("akviz_personnel_v3", JSON.stringify(arr));
  const saveWeapons = (arr) => localStorage.setItem("report_weapons_v3", JSON.stringify(arr));
  const saveBk = (arr) => localStorage.setItem("akviz_bk_v3", JSON.stringify(arr));
  const saveFullSettings = (obj) => localStorage.setItem("akviz_full_settings_v3", JSON.stringify(obj));

  // ——— Хендлеры ———
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (["subdivision", "callsignPrefix", "callsignText", "location", "region"].includes(name)) {
      localStorage.setItem(`report_${name}_v3`, value);
    }
  };

  const toggleGoal = (g) =>
    setForm((f) => {
      const isOn = f.selectedGoals.includes(g);
      const nextGoals = isOn ? f.selectedGoals.filter((x) => x !== g) : [...f.selectedGoals, g];

      let nextExplosionPlace = f.explosionPlace;
      let nextResult = f.result;

      if (isOn && g === "Вибух") {
        nextExplosionPlace = "";
        if (nextResult === "вибух") nextResult = null;
      }

      return { ...f, selectedGoals: nextGoals, explosionPlace: nextExplosionPlace, result: nextResult };
    });

  const selectSide = (s) => setForm((f) => ({ ...f, side: f.side === s ? null : s }));
  const selectName = (n) => setForm((f) => ({ ...f, name: n }));

  // ✅ количество: пусто по умолчанию, + / - корректно
  const changeQuantity = (d) =>
    setForm((f) => {
      const cur = String(f.quantity ?? "").trim();
      if (cur === "") return d > 0 ? { ...f, quantity: "1" } : f;
      let num = Number(cur.replace(/\D/g, "")) || 0;
      num += d;
      if (num <= 0) return { ...f, quantity: "" };
      return { ...f, quantity: String(num) };
    });

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
      detectionMethods: f.detectionMethods.includes(m) ? f.detectionMethods.filter((x) => x !== m) : [...f.detectionMethods, m],
    }));

  // ✅ ЗБРОЯ: добавить/удалить
  const addWeaponField = () =>
    setForm((f) => {
      const arr = [...(f.weapons || []), ""];
      saveWeapons(arr);
      return { ...f, weapons: arr };
    });

  const removeWeaponField = (idx) =>
    setForm((f) => {
      const arr = [...(f.weapons || [])];
      arr.splice(idx, 1);
      const next = arr.length ? arr : [""];
      saveWeapons(next);
      return { ...f, weapons: next };
    });

  // ✅ РОЗХІД БК: добавить/удалить
  const addBkField = () =>
    setForm((f) => {
      const arr = [...(f.bk || []), { type: "", qty: "" }];
      saveBk(arr);
      return { ...f, bk: arr };
    });

  const removeBkField = (idx) =>
    setForm((f) => {
      const arr = [...(f.bk || [])];
      arr.splice(idx, 1);
      const next = arr.length ? arr : [{ type: "", qty: "" }];
      saveBk(next);
      return { ...f, bk: next };
    });

  // ✅ О/С: добавить/удалить
  const addPersonnel = () =>
    setForm((f) => {
      const arr = [...(f.personnel || []), { rank: "", name: "" }];
      savePersonnel(arr);
      return { ...f, personnel: arr };
    });

  const removePersonnel = (idx) =>
    setForm((f) => {
      const arr = [...(f.personnel || [])];
      arr.splice(idx, 1);
      const next = arr.length ? arr : [{ rank: "", name: "" }];
      savePersonnel(next);
      return { ...f, personnel: next };
    });

  // ✅ Обновить значения (ТОЛЬКО нужные поля)
  const resetFieldsOnly = () => {
    const now = new Date();
    const newTime = now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    const newDate = now.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });

    // расход тоже чистим + localStorage для bk
    const clearedBk = [{ type: "", qty: "" }];
    saveBk(clearedBk);

    setShowFull(false);
    setShowFullSettings(false);

    setForm((f) => ({
      ...f,
      // цель
      selectedGoals: [],
      side: null,
      name: null,
      explosionPlace: "",

      // номер
      targetNumber: "",
      noIssue: false,

      // количество/параметры
      quantity: "",
      azimuth: "",
      course: "",
      distance: "",
      height: "",

      // дата/час
      time: newTime,
      date: newDate,

      // вияв/результат
      detectionMethods: [],
      result: null,

      // расход/комментарий
      bk: clearedBk,
      description: "",
    }));
  };

  // ——— Копирование и WhatsApp ———
  const copyText = (t) => {
    const text = String(t || "").replace(/\n/g, "\r\n");
    navigator.clipboard.writeText(text);
    alert("Скопійовано!");
  };
  const openWhatsAppText = (t) => {
    window.location.href = `whatsapp://send?text=${encodeURIComponent(String(t || ""))}`;
  };

  // ——— Генератор основного отчёта ———
  const generateReportText = () => {
    const {
      subdivision,
      callsignPrefix,
      callsignText,
      location,
      region,
      weapons,
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
      explosionPlace,
      personnel,
      bk,
    } = form;

    const fullCallsign = [callsignPrefix, callsignText].filter(Boolean).join(" ");
    const weaponsString = (weapons || []).filter(Boolean).join(", ");

    const personnelString = (personnel || [])
      .filter((p) => (p.rank || "").trim() || (p.name || "").trim())
      .map((p) => `${(p.rank || "").trim()} ${(p.name || "").trim()}`.trim())
      .filter(Boolean)
      .join(",");

    const sideLower = side ? String(side).toLowerCase() : "";

    const prettyName = name === "Shahed-136" ? "Shahed" : name;

    let goalPart = "";
    const q = String(quantity || "").trim();
    const qPart = q ? `${q} ` : "";

    if ((selectedGoals || []).includes("Вибух")) {
      const place = explosionPlace ? explosionPlace : "";
      goalPart = `вибух ${qPart}${place}`.trim();
    } else {
      const goalsForReport = (selectedGoals || []).map((g) => {
        if (g === "БПЛА" && prettyName) return `БПЛА ${prettyName}`;
        return g;
      });
      goalPart = `${qPart}${goalsForReport.filter(Boolean).join(",")}`.trim();
    }

    if (goalPart && sideLower) goalPart = `${goalPart} ${sideLower}`.trim();

    // ✅ вияв (с маленькой), несколько — через запятую
    const det = (detectionMethods || []).map((x) => String(x).toLowerCase()).join(",");

    // ✅ после вияву добавляем слово без запятой
    let afterDet = "";
    if (result === "ЗНИЩЕНО" || result === "не знищено") afterDet = "обстріляно";
    else if (result === "не застосовувались") afterDet = "виявлено";

    const detWithWord = det ? `${det}${afterDet ? ` ${afterDet}` : ""}` : "";

    const parts = [];
    if (azimuth) parts.push(`А-${azimuth}`);
    if (distance) parts.push(`Д-${distance}`);
    if (course) parts.push(`К-${course}`);
    if (detWithWord) parts.push(detWithWord);
    if (goalPart) parts.push(goalPart);

    const opisLine = parts.length ? `Опис:${parts.join(",")}${personnelString ? `,${personnelString}` : ""}` : `Опис:${personnelString || "-"}`;

    const resultLine = `Результат:${result ? ` ${result}` : ""}`;

    const targetLineValue = noIssue ? "б/н" : targetNumber ? `${targetNumber}` : "";
    const targetLine = `№ цілі: ${targetLineValue}`;

    const commentLine = `Коментар: ${String(description || "").trim() ? String(description).trim() : "-"}`;

    const bkLines =
      result === "ЗНИЩЕНО" || result === "не знищено"
        ? (bk || [])
            .filter((x) => (x?.type || "").trim() && (x?.qty || "").trim())
            .map((x) => `${x.type.trim()} - ${String(x.qty).trim()}`)
        : [];

    return [
      date ? `Дата: ${date}` : null,
      time ? `Час: ${time}` : null,
      targetLine,
      resultLine,
      location ? `Н.П.: ${location}` : null,
      region ? `Обл.: ${region}` : null,
      subdivision ? `Підрозділ: ${subdivision}` : null,
      fullCallsign ? `Позивний: ${fullCallsign}` : null,
      weaponsString ? `Зброя: ${weaponsString}` : null,
      height ? `Висота: ${height}` : null,
      opisLine,
      commentLine,
      ...bkLines,
    ]
      .filter((x) => x !== null && x !== undefined && String(x).trim() !== "")
      .join("\n");
  };

  // ——— Генератор повної доповіді ———
  const generateFullReportText = () => {
    const { date, time, callsignPrefix, callsignText, selectedGoals, side, targetNumber, noIssue, name, azimuth, course, height, distance, detectionMethods, result, bk } = form;

    const prettyName = name === "Shahed-136" ? "Shahed" : name;

    const detWords = (detectionMethods || []).map((x) => String(x).toLowerCase()).join(" ");
    const sideLower = side ? String(side).toLowerCase() : "";

    const targetPart = noIssue ? "б/н" : targetNumber ? `№${targetNumber}` : "";
    const targetWrap = targetPart ? `(ціль ${targetPart})` : "";

    let goalText = "ціль";
    if ((selectedGoals || []).includes("БПЛА")) {
      const who = sideLower === "ворожий" ? "противника" : sideLower === "свій" ? "своїх" : "невизначеної сторони";
      goalText = `ударний БПЛА ${who}${prettyName ? ` типу «${prettyName}»` : ""}`;
    }

    const params = [azimuth ? `Азимут:${azimuth}` : null, course ? `курс: ${course}` : null, height ? `висота ${height}м` : null, distance ? `дистанція: ${distance}м` : null]
      .filter(Boolean)
      .join(", ");

    const tail =
      result === "ЗНИЩЕНО" ? "Ціль обстріляна знищена." : result === "не знищено" ? "Ціль обстріляна не знищена." : "Ціль обстріляна.";

    const totalBk = (bk || []).reduce((sum, x) => sum + (Number(String(x?.qty || "").replace(/\D/g, "")) || 0), 0);
    const caliber = (bk || []).some((x) => String(x?.type || "").includes("14,5")) ? "14.5x114мм" : (bk || []).length ? "БК" : "";
    const bkLine = totalBk > 0 ? `Витрата БК: ${caliber ? `${caliber} - ` : ""}${totalBk} шт.` : `Витрата БК:`;

    const header = `${time || ""} ${date || ""}${callsignPrefix || ""}${callsignText ? ` «${callsignText}»` : ""}`.trim();
    const line2 = `в районі пів.зах. околиці н.п. Димер було виявлено${detWords ? ` ${detWords}` : ""} ${goalText} ${targetWrap}. ${params ? `${params}.` : ""}`.replace(/\s+/g, " ").trim();

    const b1 = `${fullSettings.block1Prefix}\n${fullSettings.block1Suffix} ${fullSettings.fireWeapon}`.trim();
    const b2 = String(fullSettings.block2 || "").trim();
    const b3 = String(fullSettings.block3 || "").trim();

    return [header, line2, b1, b2, `${b3}. ${tail}`, bkLine].filter(Boolean).join("\n");
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

  const canShowFullButton = form.result === "ЗНИЩЕНО" || form.result === "не знищено";

  const mainReport = useMemo(() => generateReportText(), [form, fullSettings]);
  const fullReport = useMemo(() => generateFullReportText(), [form, fullSettings]);

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
      <style>{`
        /* крестик: теперь не перекрывает стрелку select */
        .xbtn{
          position:absolute;
          top:50%;
          right:40px;         /* <-- сдвиг влево от стрелки */
          transform: translateY(-50%) scale(.95);
          background:transparent;
          border:none;
          color:${theme.danger};
          font-weight:900;
          font-size:16px;
          line-height:16px;
          padding:6px;
          cursor:pointer;
          opacity:.9;
          transition: transform .18s ease, opacity .18s ease;
        }
        .xbtn:active{
          transform: translateY(-50%) scale(.85) rotate(12deg);
          opacity:.7;
        }
        .fieldWrap{
          position:relative;
        }
        select.nativeSelect{
          -webkit-appearance: menulist;
          appearance: menulist;
        }
      `}</style>

      {/* Шапка */}
      <div style={{ ...cardStyle(theme), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.35rem", color: theme.label, fontWeight: 600 }}>АкВіз 2.0</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {Switch}
          <button
            onClick={resetFieldsOnly}
            title="Оновити значення (ціль/параметри/час/вияв/результат/розхід/коментар)"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              border: "none",
              background: theme.secondary,
              color: theme.label,
              boxShadow: theme.shadow,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            ⟳
          </button>
        </div>
      </div>

      {/* Показать/скрыть */}
      <div style={{ ...cardStyle(theme), display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <button onClick={() => setShowTopFields((prev) => !prev)} style={{ ...buttonStyle(theme), background: theme.secondary, color: theme.label, fontWeight: 500, minWidth: 160 }}>
          {showTopFields ? "Приховати поля" : "Показати поля"}
        </button>
      </div>

      {/* Верхний блок */}
      {showTopFields && (
        <div style={cardStyle(theme)}>
          {/* Підрозділ */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Підрозділ</label>
            <select
              className="nativeSelect"
              value={form.subdivision}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => ({ ...f, subdivision: v }));
                localStorage.setItem("report_subdivision_v3", v);
              }}
              style={{ ...inputStyle(theme) }}
            >
              <option value="">Оберіть підрозділ</option>
              {subdivisionsList.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          {/* Особовий склад */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Особовий склад</label>

            {(form.personnel || []).map((person, idx) => (
              <div key={idx} className="fieldWrap" style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: 10 }}>
                {form.personnel.length > 1 && (
                  <button className="xbtn" onClick={() => removePersonnel(idx)} type="button" aria-label="Видалити">
                    ×
                  </button>
                )}

                <select
                  className="nativeSelect"
                  value={person.rank}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      const arr = [...f.personnel];
                      arr[idx] = { ...arr[idx], rank: v };
                      savePersonnel(arr);
                      return { ...f, personnel: arr };
                    });
                  }}
                  style={{ ...inputStyle(theme), marginBottom: 0, width: 120, minWidth: 120, maxWidth: 120 }}
                >
                  <option value="">Звання</option>
                  {ranksList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

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

            <button onClick={addPersonnel} style={{ ...buttonStyle(theme), background: theme.success, color: "#fff", margin: 0, width: "100%", fontWeight: 600 }}>
              + Додати особовий склад
            </button>
          </div>

          {/* Позивний */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Позивний</label>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <select
                className="nativeSelect"
                value={form.callsignPrefix}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => ({ ...f, callsignPrefix: v }));
                  localStorage.setItem("report_callsignPrefix_v3", v);
                }}
                style={{ ...inputStyle(theme), marginBottom: 0, width: 90, minWidth: 90, maxWidth: 90 }}
              >
                <option value="">МВГ</option>
                {callsignPrefixList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <input name="callsignText" value={form.callsignText} onChange={handleChange} placeholder="Халк / Лис / ..." style={{ ...inputStyle(theme), marginBottom: 0, flex: 1 }} />
            </div>
          </div>

          {/* НП */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle(theme)}>Населений пункт</label>
            <input name="location" value={form.location} onChange={handleChange} style={{ ...inputStyle(theme), marginBottom: 0 }} placeholder="Наприклад м. Кривий Ріг" />
          </div>

          {/* Область */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle(theme)}>Область</label>
            <select
              className="nativeSelect"
              value={form.region}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => ({ ...f, region: v }));
                localStorage.setItem("report_region_v3", v);
              }}
              style={{ ...inputStyle(theme), marginBottom: 0 }}
            >
              <option value="">Оберіть область</option>
              {regionsList.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Зброя */}
          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle(theme)}>Зброя</label>

            {(form.weapons || []).map((w, idx) => (
              <div key={idx} className="fieldWrap" style={{ marginBottom: 10 }}>
                {form.weapons.length > 1 && (
                  <button className="xbtn" onClick={() => removeWeaponField(idx)} type="button" aria-label="Видалити">
                    ×
                  </button>
                )}
                <select
                  className="nativeSelect"
                  value={w}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      const arr = [...(f.weapons || [])];
                      arr[idx] = v;
                      saveWeapons(arr);
                      return { ...f, weapons: arr };
                    });
                  }}
                  style={{ ...inputStyle(theme), marginBottom: 0 }}
                >
                  <option value="">{`Оберіть зброю ${idx + 1}`}</option>
                  {ammoList.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button type="button" onClick={addWeaponField} style={{ ...buttonStyle(theme), background: theme.success, color: "#fff", margin: 0, width: "100%", fontWeight: 600 }}>
              + Додати зброю
            </button>
          </div>
        </div>
      )}

      {/* Ціль */}
      <div style={{ ...cardStyle(theme), padding: "1rem 0.7rem", display: "flex", flexDirection: "column" }}>
        <label style={{ ...labelStyle(theme), marginLeft: "0.3rem", marginBottom: "0.8rem", fontSize: "1.07rem" }}>Ціль</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.65rem", width: "100%", alignItems: "stretch" }}>
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
                padding: "0.62rem 0.6rem",
                fontSize: "0.95rem",
                cursor: "pointer",
                minWidth: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                lineHeight: 1.15,
                overflow: "hidden",
                wordBreak: "break-word",
                whiteSpace: "normal",
                ...(goal === "Інше (в коментарі)" ? { gridColumn: "span 2" } : {}),
              }}
              title={goal}
            >
              {goal}
            </button>
          ))}
        </div>

        {/* ✅ Вибух: уточнение "на землі / у повітрі" */}
        {form.selectedGoals.includes("Вибух") && (
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle(theme)}>Уточнення</label>
            <select
              className="nativeSelect"
              value={form.explosionPlace}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => ({ ...f, explosionPlace: v, result: v ? "вибух" : f.result }));
              }}
              style={{ ...inputStyle(theme), marginBottom: 0 }}
            >
              <option value="">Оберіть</option>
              <option value="на землі">на землі</option>
              <option value="у повітрі">у повітрі</option>
            </select>
          </div>
        )}
      </div>

      {/* Сторона */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Сторона</label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {["Ворожий", "Свій", "Нейтральний"].map((s) => (
            <button
              key={s}
              onClick={() => selectSide(s)}
              style={{ ...buttonStyle(theme), background: form.side === s ? theme.success : theme.secondary, color: form.side === s ? "#fff" : theme.label, fontWeight: form.side === s ? 600 : 500 }}
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
            style={{ ...buttonStyle(theme), backgroundColor: form.noIssue ? theme.danger : theme.secondary, color: form.noIssue ? "#fff" : theme.label, height: 44, minWidth: 128, marginBottom: 0 }}
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
                  ...buttonStyle(theme),
                  background: form.name === n ? theme.success : theme.secondary,
                  color: form.name === n ? "#fff" : theme.label,
                  fontWeight: form.name === n ? 700 : 500,
                  padding: "0.62rem 0.6rem",
                  borderRadius: "14px",
                  boxShadow: form.name === n ? "0 2px 8px rgba(50,215,75,0.14)" : theme.shadow,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
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
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              setForm((f) => ({ ...f, quantity: v }));
            }}
            inputMode="numeric"
            pattern="\d*"
            placeholder=""
            style={{ ...inputStyle(theme), textAlign: "center", flex: 1, marginBottom: 0, height: 44 }}
          />
          <button onClick={() => changeQuantity(-1)} style={{ ...buttonStyle(theme), backgroundColor: "#FF375F", color: "#fff", height: 44, minWidth: 44, marginBottom: 0, padding: 0 }}>
            –
          </button>
          <button onClick={() => changeQuantity(1)} style={{ ...buttonStyle(theme), backgroundColor: "#32D74B", color: "#fff", height: 44, minWidth: 44, marginBottom: 0, padding: 0 }}>
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
          style={{ ...inputStyle(theme), border: form.azimuth.trim() === "" || !validateAzimuth(form.azimuth) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}` }}
        />
        {(form.azimuth.trim() === "" || !validateAzimuth(form.azimuth)) && <div style={{ color: theme.danger, fontSize: "0.82rem", marginBottom: "0.6rem" }}>Поле має бути заповненим!</div>}

        <label style={labelStyle(theme)}>Курс (°)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={form.course}
          onChange={onCourseChange}
          style={{ ...inputStyle(theme), border: form.course.trim() === "" || !validateCourse(form.course) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}` }}
        />
        {(form.course.trim() === "" || !validateCourse(form.course)) && <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.35rem" }}>Поле має бути заповненим!</div>}
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
            style={{ ...inputStyle(theme), border: form.distance.trim() === "" || !validateDistance(form.distance) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}` }}
          />
          {(form.distance.trim() === "" || !validateDistance(form.distance)) && <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.2rem" }}>Поле має бути заповненим!</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+1000", "+5000", "-100", "-1000", "-5000"].map((label) => (
              <button key={label} onClick={() => changeDistance(Number(label))} style={{ ...buttonStyle(theme), backgroundColor: label.startsWith("-") ? theme.danger : theme.success, color: "#fff", padding: "0.4rem 0.5rem" }}>
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
            style={{ ...inputStyle(theme), border: form.height.trim() === "" || !validateHeight(form.height) ? `1px solid ${theme.danger}` : `1px solid ${theme.inputBorder}` }}
          />
          {(form.height.trim() === "" || !validateHeight(form.height)) && <div style={{ color: theme.danger, fontSize: "0.82rem", marginTop: "0.2rem" }}>Поле має бути заповненим!</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginTop: "0.45rem" }}>
            {["+100", "+500", "-100", "-500"].map((label) => (
              <button key={label} onClick={() => changeHeight(Number(label))} style={{ ...buttonStyle(theme), backgroundColor: label.startsWith("-") ? theme.danger : theme.success, color: "#fff", padding: "0.4rem 0.5rem" }}>
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
          <button onClick={updateDate} style={{ ...buttonStyle(theme), background: theme.secondary, color: theme.label, minWidth: 44 }} title="Оновити дату">
            ⟳
          </button>
        </div>

        <label style={labelStyle(theme)}>Час</label>
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.7rem" }}>
          <input type="text" name="time" value={form.time} onChange={handleChange} style={{ ...inputStyle(theme), flex: 1, marginBottom: 0, height: 44, textAlign: "center" }} />
        </div>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            onClick={() => {
              updateTime();
              updateDate();
            }}
            style={{ ...buttonStyle(theme), background: isDark ? theme.button : theme.success, color: "#fff", height: 44 }}
          >
            Щойно
          </button>
          <button
            onClick={() => {
              let [h, m] = (form.time || "00:00").split(":").map(Number);
              m++;
              if (m > 59) {
                m = 0;
                h = (h + 1) % 24;
              }
              setForm((f) => ({ ...f, time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` }));
            }}
            style={{ ...buttonStyle(theme), background: isDark ? theme.button : theme.success, color: "#fff", height: 44 }}
          >
            +1хв
          </button>
          <button
            onClick={() => {
              let [h, m] = (form.time || "00:00").split(":").map(Number);
              m--;
              if (m < 0) {
                m = 59;
                h = h - 1;
                if (h < 0) h = 23;
              }
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
              <span style={{ display: "block", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Результат */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Результат</label>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.65rem" }}>
          {["ЗНИЩЕНО", "не знищено", "не застосовувались"].map((r) => (
            <button
              key={r}
              onClick={() => setForm((f) => ({ ...f, result: r }))}
              style={{
                ...buttonStyle(theme),
                background: form.result === r ? theme.success : theme.secondary,
                color: form.result === r ? "#fff" : theme.label,
                fontWeight: form.result === r ? 700 : 500,
                ...(r === "не застосовувались" ? { gridColumn: "span 2" } : {}),
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Розхід БК */}
      {["ЗНИЩЕНО", "не знищено"].includes(form.result || "") && (
        <div style={cardStyle(theme)}>
          <label style={labelStyle(theme)}>Розхід БК</label>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {(form.bk || []).map((row, idx) => (
              <div key={idx} className="fieldWrap" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                {form.bk.length > 1 && (
                  <button className="xbtn" onClick={() => removeBkField(idx)} type="button" aria-label="Видалити">
                    ×
                  </button>
                )}

                <select
                  className="nativeSelect"
                  value={row.type}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      const arr = [...(f.bk || [])];
                      const cur = arr[idx] || { type: "", qty: "" };
                      arr[idx] = { ...cur, type: v };
                      saveBk(arr);
                      return { ...f, bk: arr };
                    });
                  }}
                  style={{ ...inputStyle(theme), marginBottom: 0, flex: 1 }}
                >
                  <option value="">{`Оберіть набій ${idx + 1}`}</option>
                  {bkList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={row.qty}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setForm((f) => {
                      const arr = [...(f.bk || [])];
                      const cur = arr[idx] || { type: "", qty: "" };
                      arr[idx] = { ...cur, qty: v };
                      saveBk(arr);
                      return { ...f, bk: arr };
                    });
                  }}
                  placeholder="К-сть"
                  style={{ ...inputStyle(theme), width: 120, marginBottom: 0, textAlign: "center", fontWeight: 600, height: 44 }}
                />
              </div>
            ))}
          </div>

          <button onClick={addBkField} style={{ ...buttonStyle(theme), background: theme.success, color: "#fff", width: "100%", fontWeight: 600, margin: 0 }}>
            + Додати набій
          </button>
        </div>
      )}

      {/* Коментар */}
      <div style={cardStyle(theme)}>
        <label style={labelStyle(theme)}>Коментар</label>
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

      {/* Кнопки (основные) */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.6rem" }}>
        <button onClick={() => copyText(mainReport)} style={buttonStyle(theme)}>
          Копіювати
        </button>
        <button onClick={() => openWhatsAppText(mainReport)} style={{ ...buttonStyle(theme), background: theme.success, color: "#fff" }}>
          WhatsApp
        </button>
      </div>

      {/* ✅ Повна доповідь (кнопка) */}
      {canShowFullButton && (
        <div style={{ ...cardStyle(theme), marginBottom: "1.2rem" }}>
          <button
            onClick={() => {
              setShowFull((v) => !v);
              setShowFullSettings(false);
            }}
            style={{ ...buttonStyle(theme), width: "100%", margin: 0, fontWeight: 700, background: theme.secondary, color: theme.label }}
          >
            {showFull ? "Сховати повну доповідь" : "Повна доповідь"}
          </button>

          {showFull && (
            <button onClick={() => setShowFullSettings((v) => !v)} style={{ ...buttonStyle(theme), width: "100%", marginTop: 10, fontWeight: 700, background: theme.button, color: "#fff" }}>
              Налаштування
            </button>
          )}

          {showFull && showFullSettings && (
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle(theme)}>Зброя (відкрив вогонь з)</label>
              <input
                value={fullSettings.fireWeapon}
                onChange={(e) => {
                  const v = e.target.value;
                  setFullSettings((s) => {
                    const next = { ...s, fireWeapon: v };
                    saveFullSettings(next);
                    return next;
                  });
                }}
                placeholder="КПВТ"
                style={{ ...inputStyle(theme) }}
              />

              <label style={labelStyle(theme)}>Блок 1 (початок)</label>
              <textarea
                value={fullSettings.block1Prefix}
                onChange={(e) => {
                  const v = e.target.value;
                  setFullSettings((s) => {
                    const next = { ...s, block1Prefix: v };
                    saveFullSettings(next);
                    return next;
                  });
                }}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "12px",
                  border: `1px solid ${theme.inputBorder}`,
                  backgroundColor: theme.textareaBg,
                  fontSize: "1rem",
                  color: theme.textareaText,
                  resize: "vertical",
                  outline: "none",
                  marginBottom: "0.6rem",
                }}
              />

              <label style={labelStyle(theme)}>Блок 2</label>
              <textarea
                value={fullSettings.block2}
                onChange={(e) => {
                  const v = e.target.value;
                  setFullSettings((s) => {
                    const next = { ...s, block2: v };
                    saveFullSettings(next);
                    return next;
                  });
                }}
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "12px",
                  border: `1px solid ${theme.inputBorder}`,
                  backgroundColor: theme.textareaBg,
                  fontSize: "1rem",
                  color: theme.textareaText,
                  resize: "vertical",
                  outline: "none",
                  marginBottom: "0.6rem",
                }}
              />

              <label style={labelStyle(theme)}>Блок 3</label>
              <textarea
                value={fullSettings.block3}
                onChange={(e) => {
                  const v = e.target.value;
                  setFullSettings((s) => {
                    const next = { ...s, block3: v };
                    saveFullSettings(next);
                    return next;
                  });
                }}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "12px",
                  border: `1px solid ${theme.inputBorder}`,
                  backgroundColor: theme.textareaBg,
                  fontSize: "1rem",
                  color: theme.textareaText,
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ✅ Повна доповідь (перед основной) */}
      {canShowFullButton && showFull && (
        <div style={cardStyle(theme)}>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "1rem", color: theme.label, margin: 0, background: "none" }}>{fullReport}</pre>

          <div style={{ display: "flex", gap: "0.6rem", marginTop: 12 }}>
            <button onClick={() => copyText(fullReport)} style={buttonStyle(theme)}>
              Копіювати
            </button>
            <button onClick={() => openWhatsAppText(fullReport)} style={{ ...buttonStyle(theme), background: theme.success, color: "#fff" }}>
              WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Отчёт (основной) */}
      <div style={cardStyle(theme)}>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "1rem", color: theme.label, margin: 0, background: "none" }}>{mainReport}</pre>
      </div>
    </div>
  );
}

/* ===================== UI helpers ===================== */

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
