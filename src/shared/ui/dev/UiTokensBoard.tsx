import './ui-tokens-board.scss';

export function UiTokensBoard() {
  return (
    <div className="ui-tokens-board" data-testid="ui-tokens-board">
      <h1 className="ui-tokens-board__title">Design tokens</h1>

      <section className="ui-tokens-board__section">
        <h2 className="ui-tokens-board__section-title">Spacing</h2>
        <div className="ui-tokens-board__spacing-row">
          {[1, 2, 3, 4, 5, 6, 8, 10].map((step) => (
            <div key={step} className="ui-tokens-board__spacing-item">
              <div
                className="ui-tokens-board__spacing-swatch"
                style={{ width: `var(--space-${step})` }}
                data-space={step}
              />
              <span className="ui-tokens-board__label">--space-{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ui-tokens-board__section">
        <h2 className="ui-tokens-board__section-title">Radii</h2>
        <div className="ui-tokens-board__radii-row">
          {(['sm', 'md', 'lg', 'xl', 'pill'] as const).map((key) => (
            <div key={key} className="ui-tokens-board__radius-item">
              <div className={`ui-tokens-board__radius-swatch ui-tokens-board__radius-swatch--${key}`} />
              <span className="ui-tokens-board__label">--radius-{key}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ui-tokens-board__section">
        <h2 className="ui-tokens-board__section-title">Control heights</h2>
        <div className="ui-tokens-board__controls-row">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div
              key={size}
              className={`ui-tokens-board__control ui-tokens-board__control--${size}`}
            >
              --control-h-{size}
            </div>
          ))}
        </div>
      </section>

      <section className="ui-tokens-board__section">
        <h2 className="ui-tokens-board__section-title">Type scale</h2>
        <div className="ui-tokens-board__type-stack">
          {(
            [
              ['xs', 'Type xs'],
              ['sm', 'Type sm'],
              ['md', 'Type md'],
              ['lg', 'Type lg'],
              ['xl', 'Type xl'],
              ['2xl', 'Type 2xl'],
            ] as const
          ).map(([token, label]) => (
            <p key={token} className={`ui-tokens-board__type ui-tokens-board__type--${token}`}>
              {label} ({token})
            </p>
          ))}
        </div>
      </section>

      <section className="ui-tokens-board__section">
        <h2 className="ui-tokens-board__section-title">Semantic colours</h2>
        <div className="ui-tokens-board__colors-row">
          {(['surface', 'text', 'accent', 'border', 'bg'] as const).map((key) => (
            <div key={key} className="ui-tokens-board__color-item">
              <div className={`ui-tokens-board__color-swatch ui-tokens-board__color-swatch--${key}`} />
              <span className="ui-tokens-board__label">--rs-{key}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
