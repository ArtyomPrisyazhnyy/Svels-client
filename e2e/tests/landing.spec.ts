import { test, expect } from '../fixtures/test';

test.describe('Landing / platform home', () => {
  test('показывает бренд, hero-заголовок и CTA на заявку', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('landing-page')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Svels' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Сайт и мобильное приложение для вашего заведения/ }),
    ).toBeVisible();
    await expect(page.getByTestId('landing-cta-contact').first()).toBeVisible();
  });

  test('CTA открывает модалку заявки с полями имени, телефона и способами связи', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByTestId('landing-cta-contact').first().click();

    await expect(page.getByRole('heading', { name: 'Оставить заявку' })).toBeVisible();
    await expect(page.getByLabel('Ваше имя')).toBeVisible();
    await expect(page.getByLabel('Номер телефона')).toBeVisible();
    await expect(page.getByRole('radio', { name: /Telegram/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /WhatsApp/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Viber/ })).toBeVisible();
  });

  test('в модалке заявки выбран один мессенджер, по умолчанию Telegram', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('landing-cta-contact').first().click();

    const telegram = page.getByRole('radio', { name: /Telegram/ });
    const whatsapp = page.getByRole('radio', { name: /WhatsApp/ });
    const viber = page.getByRole('radio', { name: /Viber/ });

    await expect(telegram).toBeChecked();
    await expect(whatsapp).not.toBeChecked();
    await expect(viber).not.toBeChecked();

    await whatsapp.check();
    await expect(whatsapp).toBeChecked();
    await expect(telegram).not.toBeChecked();
    await expect(viber).not.toBeChecked();

    await viber.check();
    await expect(viber).toBeChecked();
    await expect(whatsapp).not.toBeChecked();
    await expect(telegram).not.toBeChecked();
  });

  test('разделы возможностей, тарифов и FAQ присутствуют на странице', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('landing-features')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Как это выглядит у гостя' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Тарифы' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Часто задаваемые вопросы' }),
    ).toBeVisible();
  });

  test('витрина возможностей переключает экраны по клику', async ({ page }) => {
    await page.goto('/');
    const features = page.getByTestId('landing-features');

    await expect(features.getByRole('tab', { name: /Бронь стола/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByTestId('landing-scene-booking')).toBeVisible();

    await features.getByRole('tab', { name: /Предзаказ/ }).click();
    await expect(page.getByTestId('landing-scene-preorder')).toBeVisible();
    await expect(features.getByRole('tab', { name: /Предзаказ/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('FAQ открывает один ответ с панелью вопроса', async ({ page }) => {
    await page.goto('/');
    const faq = page.getByTestId('landing-faq');
    const first = faq.getByRole('button', { name: 'Что входит в Svels?' });
    const second = faq.getByRole('button', { name: 'Можно ли использовать свой домен?' });

    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(faq.getByText(/white-label мобильное приложение/)).toBeVisible();

    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(faq.getByText(/bistro-lotos\.by/)).toBeVisible();
  });

  test('тарифы показывают месяц и корректную годовую экономию', async ({ page }) => {
    await page.goto('/');
    const pricing = page.getByTestId('landing-pricing');

    await expect(pricing.getByRole('heading', { name: 'Сайт' })).toBeVisible();
    await expect(pricing.getByText('119', { exact: true })).toBeVisible();
    await expect(pricing.getByText('149', { exact: true })).toBeVisible();

    await page.getByTestId('landing-pricing-yearly').click();

    await expect(pricing.getByText('990', { exact: true })).toBeVisible();
    await expect(pricing.getByText('1 190', { exact: true })).toBeVisible();
    await expect(pricing.getByText(/на 36,50 BYN в месяц дешевле/)).toBeVisible();
    await expect(pricing.getByText(/на 49,83 BYN в месяц дешевле/)).toBeVisible();
  });

  test('контейнеры шапки, секций и футера одной ширины', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const widths = await page.evaluate(() => {
      const selectors = [
        '.landing__header .landing__container',
        '.landing__hero',
        '.landing__section--steps .landing__container',
        '.landing__section--features .landing__container',
        '.landing__section--pricing .landing__container',
        '.landing__section--faq .landing__container',
        '.landing__footer .landing__container',
      ];

      return selectors.map((selector) => {
        const el = document.querySelector(selector);
        if (!el) {
          throw new Error(`Нет контейнера: ${selector}`);
        }
        return Math.round(el.getBoundingClientRect().width);
      });
    });

    expect(widths.every((width) => width === widths[0])).toBe(true);
  });

  test('ссылки «Возможности», «Тарифы» и FAQ плавно скроллят к разделам', async ({ page }) => {
    await page.goto('/');

    const scrollBehavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(scrollBehavior).toBe('smooth');

    const nav = page.getByRole('navigation', { name: 'Разделы' });

    await nav.getByRole('link', { name: 'Возможности' }).click();
    await expect(page).toHaveURL(/#features$/);
    await expect(page.locator('#features')).toBeInViewport();

    await nav.getByRole('link', { name: 'Тарифы' }).click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();

    await nav.getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/#faq$/);
    await expect(page.locator('#faq')).toBeInViewport();
  });

  test('в футере есть ссылка на политику конфиденциальности', async ({ page }) => {
    await page.goto('/');

    const link = page.getByRole('link', { name: 'Политика конфиденциальности' });
    await expect(link).toHaveAttribute('href', '/privacypolicy');
    await link.click();
    await expect(page).toHaveURL(/\/privacypolicy$/);
    await expect(page.getByTestId('privacy-policy-page')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Политика конфиденциальности/ }),
    ).toBeVisible();
    await expect(page.getByText(/ЧЕРНОВИК, требует проверки юристом/)).toBeVisible();
  });

  test('на странице политики шапка ведёт на главную к разделам', async ({ page }) => {
    await page.goto('/privacypolicy');

    const nav = page.getByRole('navigation', { name: 'Разделы' });
    await expect(nav.getByRole('link', { name: 'Возможности' })).toHaveAttribute('href', '/#features');

    await nav.getByRole('link', { name: 'Тарифы' }).click();
    await expect(page).toHaveURL(/\/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();

    await page.goto('/privacypolicy');
    await nav.getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/\/#faq$/);
    await expect(page.locator('#faq')).toBeInViewport();
  });

  test('модалка заявки требует согласия с политикой конфиденциальности', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('landing-cta-contact').first().click();

    await page.getByLabel('Ваше имя').fill('Иван');
    await page.getByLabel('Номер телефона').fill('+375291234567');

    const submit = page.getByRole('button', { name: 'Отправить заявку' });
    const consent = page.getByTestId('contact-modal-privacy-consent');

    await expect(consent).toBeVisible();
    await expect(consent).not.toBeChecked();
    await expect(submit).toBeDisabled();
    await expect(page.getByRole('link', { name: 'политики конфиденциальности' })).toHaveAttribute(
      'href',
      '/privacypolicy',
    );

    await consent.scrollIntoViewIfNeeded();
    await consent.check({ force: true });
    await expect(consent).toBeChecked();
    await expect(submit).toBeEnabled();
  });
});
