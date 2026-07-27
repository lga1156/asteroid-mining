import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await expect(page.getByTestId('asteroid-card')).toHaveCount(3);
});

test('пользователь видит список астероидов с характеристиками', async ({ page }) => {
    const card = page.getByTestId('asteroid-card').first();
    await expect(card).toContainText('Диаметр');
    await expect(card).toContainText('Расстояние');
    await expect(card).toContainText('Fe');
    await expect(card).toContainText('H₂O');
});

test('пользователь открывает и закрывает детали астероида', async ({ page }) => {
    await page
        .getByRole('button', { name: /Подробнее об астероиде/ })
        .first()
        .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Ресурсы астероида');
    await expect(dialog).toContainText('Масса');
    await expect(dialog).toContainText('Объём');

    await dialog.getByRole('button', { name: /close dialog/i }).click();
    await expect(dialog).toBeHidden();
});

test('пользователь запускает добычу и получает подтверждение', async ({ page }) => {
    await page.route('**/api/mine', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await route.continue();
    });
    await page.getByRole('button', { name: 'В план миссии' }).first().click();
    await page
        .getByRole('link', { name: /План миссии/ })
        .first()
        .click();

    const launchButton = page.getByRole('button', { name: /Отправить на добычу/ });
    const responsePromise = page.waitForResponse(
        (response) => response.url().endsWith('/api/mine') && response.request().method() === 'POST'
    );
    await launchButton.click();
    await expect(launchButton).toBeDisabled();
    await responsePromise;
    await expect(page.getByRole('dialog')).toContainText('Миссия запущена');
});

test('навигация открывает раздел статуса добычи', async ({ page }) => {
    await page.getByRole('link', { name: 'Статус добычи' }).first().click();
    await expect(page.getByRole('heading', { name: 'Статус добычи' })).toBeVisible();
});
