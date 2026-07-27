import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('asteroid-card')).toHaveCount(3);
});

test('@visual карточка астероида сохраняет внешний вид', async ({ page }) => {
    await expect(page.getByTestId('asteroid-card').first()).toHaveScreenshot('asteroid-card.png');
});

test('@visual диалог астероида сохраняет внешний вид', async ({ page }) => {
    await page
        .getByRole('button', { name: /Подробнее об астероиде/ })
        .first()
        .click();
    await expect(page.getByRole('dialog')).toHaveScreenshot('asteroid-dialog.png');
});

test('@visual стабильная часть страницы сравнивается с маской', async ({ page }) => {
    await expect(page).toHaveScreenshot('asteroids-page-masked.png', {
        fullPage: true,
        mask: [page.locator('canvas')],
    });
});

test('@visual шапка сайта сохраняет внешний вид', async ({ page }) => {
    const headerBox = await page.getByRole('banner').first().boundingBox();
    expect(headerBox).not.toBeNull();
    await expect(page).toHaveScreenshot('site-header.png', {
        clip: headerBox!,
    });
});
