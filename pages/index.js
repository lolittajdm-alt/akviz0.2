import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const favoritesCount = 0;
  const cartCount = 0;

  const openMenu = () => {
    setIsMenuOpen(true);
    setIsCartOpen(false);
    setIsAuthOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
    setIsMenuOpen(false);
    setIsAuthOpen(false);
  };

  const openAuth = () => {
    setIsAuthOpen(true);
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsAuthOpen(false);
  };

  return (
    <div className="page-root">

      {/* ЛЕВОЕ МЕНЮ */}
      <aside className={"side-panel side-panel-left" + (isMenuOpen ? " side-panel-open" : "")}>
        <div className="side-panel-header">
          <span className="side-panel-title">Меню</span>
          <button className="side-panel-close" onClick={closeAll}>✕</button>
        </div>

        <nav className="side-panel-list">
          <button className="side-panel-item" onClick={closeAll}>Головна</button>
          <button className="side-panel-item" onClick={closeAll}>Кава</button>
          <button className="side-panel-item" onClick={closeAll}>Чай</button>
          <button className="side-panel-item" onClick={closeAll}>Контакти</button>
        </nav>
      </aside>

      {/* КОРЗИНА СПРАВА */}
      <aside className={"side-panel side-panel-right" + (isCartOpen ? " side-panel-open" : "")}>
        <div className="side-panel-header">
          <span className="side-panel-title">Кошик</span>
          <button className="side-panel-close" onClick={closeAll}>✕</button>
        </div>

        <div className="side-panel-body">
          <p className="side-panel-empty">Ваш кошик поки порожній.</p>
        </div>
      </aside>

      {/* МОДАЛЬНОЕ ОКНО — ВХОД */}
      {isAuthOpen && (
        <div className="auth-modal-wrapper">
          <div className="auth-modal">
            <div className="auth-header">
              <h2 className="auth-title">Вхід в акаунт</h2>
              <button className="auth-close" onClick={closeAll}>✕</button>
            </div>

            <p className="auth-text">
              Увійдіть у свій акаунт або зареєструйтесь за номером телефону.
            </p>

            <input
              className="auth-input"
              type="tel"
              placeholder="+38 (0__) ___ __ __"
            />

            <button className="auth-btn-primary">Увійти / Зареєструватися</button>

            <p className="auth-subtext">
              Натискаючи кнопку, ви погоджуєтесь з умовами використання сервісу.
            </p>
          </div>
        </div>
      )}

      {/* BACKDROP */}
      {(isMenuOpen || isCartOpen || isAuthOpen) && (
        <div className="backdrop" onClick={closeAll} />
      )}

      {/* ВЕРХНИЙ ХЕДЕР */}
      <header className="topbar">
        <button className="burger-btn" onClick={openMenu}>
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>

        <div className="topbar-spacer" />

        <a href="tel:+380689462411" className="topbar-phone">+38 (068) 946 24 11</a>
      </header>

      {/* ЛОГО + ИКОНКИ */}
      <section className="logo-strip">
        <div className="logo-strip-left">
          <img src="/lavazza-logo.png" alt="Lavazza" className="lavazza-logo" />
        </div>

        <div className="logo-strip-right">
          <button className="icon-wrapper" onClick={openAuth} title="Вхід">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              stroke="#0a0a1a" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4v18h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
          </button>

          <button className="icon-wrapper" title="Обрані">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              stroke="#0a0a1a" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6c-1.5-1.6-4-1.6-5.6 0L12 7.8 8.8 4.6c-1.5-1.6-4-1.6-5.6 0-1.6 1.6-1.6 4.2 0 5.8l8.1 8.2a1 1 0 0 0 1.4 0l8.1-8.2c1.8-1.6 1.8-4.2 0-5.8z" />
            </svg>
            <span className="icon-badge">{favoritesCount}</span>
          </button>

          <button className="icon-wrapper" onClick={openCart} title="Кошик">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              stroke="#0a0a1a" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2 3h3l3.6 11.6c.2.7.9 1.4 1.6 1.4h8.8c.7 0 1.4-.7 1.6-1.4L23 6H6" />
            </svg>
            <span className="icon-badge">{cartCount}</span>
          </button>
        </div>
      </section>

      <main className="main-empty"></main>

      <footer className="site-footer">
        LavazzaShop ©2025 <br /> Усі права захищені.
      </footer>
    </div>
  );
}
