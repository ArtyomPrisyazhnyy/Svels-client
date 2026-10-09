/** Статичная сцена продукта в hero: окно сайта + телефон приложения. */
export function LandingHeroScene() {
  return (
    <div className="landing-scene" aria-hidden>
      <div className="landing-browser">
        <div className="landing-browser__bar">
          <span className="landing-browser__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="landing-browser__url">bistro-lotos.by</span>
        </div>
        <div className="landing-browser__body">
          <div className="landing-browser__hero">
            <span className="landing-browser__mark">Bistro Lotos</span>
            <strong>Вечер в чайной</strong>
            <em>Стол у окна · 19:00</em>
          </div>
          <div className="landing-browser__grid">
            <span>
              Сенча
              <small>12 BYN</small>
            </span>
            <span>
              Матча
              <small>16 BYN</small>
            </span>
            <span>
              Десерт
              <small>9 BYN</small>
            </span>
          </div>
        </div>
      </div>

      <div className="landing-phone">
        <div className="landing-phone__notch" />
        <div className="landing-phone__screen">
          <header>
            <b>Bistro Lotos</b>
            <span>Сегодня</span>
          </header>
          <ul>
            <li>
              <i />
              Стол 7
              <em>подтверждён</em>
            </li>
            <li>
              <i />
              Предзаказ
              <em>24 BYN</em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
