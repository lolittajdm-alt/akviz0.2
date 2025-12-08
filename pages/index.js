import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "380XXXXXXXXX"; // ← ВСТАВ СВІЙ НОМЕР без +

const CATEGORIES = [
  { id: "coffee", label: "Кава" },
  { id: "tea", label: "Чай" },
];

const COFFEE_SUBCATEGORIES = [
  { id: "beans", label: "Зернова кава" },
  { id: "ground", label: "Мелена кава" },
  { id: "instant", label: "Розчинна кава" },
];

const PRODUCTS = [
  // КАВА: ЗЕРНОВА
  {
    id: "beans-1",
    category: "coffee",
    subcategory: "beans",
    name: "Arabica Premium 250 г",
    description: "100% арабiка середнього обсмаження.",
    price: 180,
  },
  {
    id: "beans-2",
    category: "coffee",
    subcategory: "beans",
    name: "Espresso Blend 1 кг",
    description: "Сумiш арабiки та робусти для насиченого смаку.",
    price: 650,
  },

  // КАВА: МЕЛЕНА
  {
    id: "ground-1",
    category: "coffee",
    subcategory: "ground",
    name: "Мелена кава Classic 250 г",
    description: "Середнє обсмаження, універсальний помел.",
    price: 160,
  },
  {
    id: "ground-2",
    category: "coffee",
    subcategory: "ground",
    name: "Мелена кава для турки 250 г",
    description: "Дрібний помел, iдеально для турки або джезви.",
    price: 170,
  },

  // КАВА: РОЗЧИННА
  {
    id: "instant-1",
    category: "coffee",
    subcategory: "instant",
    name: "Розчинна кава Gold 100 г",
    description: "Легкий аромат та швидке приготування.",
    price: 120,
  },
  {
    id: "instant-2",
    category: "coffee",
    subcategory: "instant",
    name: "Розчинна кава Classic 200 г",
    description: "Класичний смак розчинної кави на кожен день.",
    price: 190,
  },

  // ЧАЙ
  {
    id: "tea-black",
    category: "tea",
    name: "Чорний чай Ceylon 100 г",
    description: "Класичний чорний цейлонський чай.",
    price: 90,
  },
  {
    id: "tea-green",
    category: "tea",
    name: "Зелений чай Jasmine 100 г",
    description: "Зелений чай з ніжним жасминовим ароматом.",
    price: 95,
  },
  {
    id: "tea-herbal",
    category: "tea",
    name: "Трав'яний збiр Relax 80 г",
    description: "М'ята, меліса та інші трави — ідеальні для вечора.",
    price: 110,
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("coffee");
  const [activeCoffeeSubcategory, setActiveCoffeeSubcategory] =
    useState("beans");

  const [cart, setCart] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "coffee") {
      return PRODUCTS.filter(
        (p) =>
          p.category === "coffee" &&
          (!p.subcategory || p.subcategory === activeCoffeeSubcategory)
      );
    }
    if (activeCategory === "tea") {
      return PRODUCTS.filter((p) => p.category === "tea");
    }
    return PRODUCTS;
  }, [activeCategory, activeCoffeeSubcategory]);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + (qty || 0), 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      PRODUCTS.reduce((sum, p) => {
        const qty = cart[p.id] || 0;
        return sum + qty * p.price;
      }, 0),
    [cart]
  );

  const handleQtyChange = (id, delta) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleOrder = () => {
    if (!totalItems) {
      alert("Додайте хоча б одну позицію в замовлення.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      alert("Заповніть ім'я та телефон.");
      return;
    }

    const lines = [];
    lines.push("📝 НОВЕ ЗАМОВЛЕННЯ");
    lines.push("");
    lines.push(`👤 Ім'я: ${name.trim()}`);
    lines.push(`📞 Телефон: ${phone.trim()}`);
    lines.push(
      `🚚 Спосіб отримання: ${
        deliveryMethod === "pickup" ? "Самовивіз" : "Доставка"
      }`
    );
    if (deliveryMethod === "delivery" && address.trim()) {
      lines.push(`📍 Адреса: ${address.trim()}`);
    }
    lines.push("");
    lines.push("🛒 Замовлення:");

    PRODUCTS.forEach((p) => {
      const qty = cart[p.id] || 0;
      if (!qty) return;
      lines.push(`• ${p.name} x${qty} — ${p.price * qty} грн`);
    });

    lines.push("");
    lines.push(`Разом: ${totalPrice} грн`);

    if (comment.trim()) {
      lines.push("");
      lines.push(`💬 Коментар: ${comment.trim()}`);
    }

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="page-root">
      <div className="coffee-container">
        
        {/* HERO */}
        <header className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <span className="hero-badge">Кавовий магазин</span>
              <h1 className="hero-title">
                Смачна кава
                <br />
                для кожного дня
              </h1>
              <p className="hero-text">
                Обирайте зернову, мелену або розчинну каву, а також чай. Додавайте у кошик та оформлюйте замовлення в WhatsApp.
              </p>
            </div>
          </div>
        </header>

        {/* ABOUT */}
        <section className="about">
          <div className="about-content">
            <h2 className="section-label">Про нас</h2>
            <h3 className="section-title">Ми готуємо якісно</h3>
            <p className="section-text">
              Ми працюємо з найкращими сортами кави та чаїв, щоб ви могли насолоджуватися улюбленим смаком щодня.
            </p>
            <p className="section-text">
              Наше завдання — зробити процес замовлення максимально простим, зручним і швидким.
            </p>
          </div>
        </section>

        {/* MENU */}
        <section className="menu" id="menu-section">
          <div className="menu-header">
            <h2 className="section-label">Меню</h2>
            <h3 className="section-title">Кава та чай</h3>
          </div>

          {/* Категорії */}
          <nav className="category-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={
                  "category-chip" + (activeCategory === cat.id ? " category-chip-active" : "")
                }
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Підкатегорії кави */}
          {activeCategory === "coffee" && (
            <nav className="category-bar coffee-subbar">
              {COFFEE_SUBCATEGORIES.map((sub) => (
                <button
                  key={sub.id}
                  className={
                    "category-chip" +
                    (activeCoffeeSubcategory === sub.id ? " category-chip-active" : "")
                  }
                  onClick={() => setActiveCoffeeSubcategory(sub.id)}
                >
                  {sub.label}
                </button>
              ))}
            </nav>
          )}

          {/* Товари */}
          <main className="product-grid">
            {filteredProducts.map((p) => {
              const qty = cart[p.id] || 0;
              return (
                <section className="product-card" key={p.id}>
                  <div className="product-info">
                    <h4 className="product-name">{p.name}</h4>
                    <p className="product-desc">{p.description}</p>
                  </div>
                  <div className="product-bottom">
                    <div className="product-price">{p.price} грн</div>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => handleQtyChange(p.id, -1)}>
                        –
                      </button>
                      <span className="qty-number">{qty || 0}</span>
                      <button className="qty-btn" onClick={() => handleQtyChange(p.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </section>
              );
            })}
          </main>
        </section>

        {/* ORDER */}
        <section className="order-section" id="order-section">
          <h2 className="section-label">Замовлення</h2>
          <h3 className="section-title">Оформлення замовлення</h3>
          <p className="section-text">
            Вкажіть контактні дані та спосіб отримання — ми відповімо вам у WhatsApp.
          </p>

          <input
            className="order-input"
            placeholder="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="order-input"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="delivery-toggle">
            <button
              className={"toggle-btn" + (deliveryMethod === "pickup" ? " toggle-active" : "")}
              onClick={() => setDeliveryMethod("pickup")}
            >
              Самовивіз
            </button>
            <button
              className={"toggle-btn" + (deliveryMethod === "delivery" ? " toggle-active" : "")}
              onClick={() => setDeliveryMethod("delivery")}
            >
              Доставка
            </button>
          </div>

          {deliveryMethod === "delivery" && (
            <input
              className="order-input"
              placeholder="Адреса"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          )}

          <textarea
            className="order-textarea"
            placeholder="Коментар"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <p className="order-summary">
            Позицій: <strong>{totalItems}</strong>. Сума:{" "}
            <strong>{totalPrice} грн</strong>.
          </p>

          <button className="order-button" onClick={handleOrder}>
            Відправити в WhatsApp
          </button>
        </section>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Кавовий магазин. Всі права захищено.</p>
        </footer>
      </div>
    </div>
  );
}
