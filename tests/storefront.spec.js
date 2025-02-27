import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www-dev.uat-thesun.co.uk/joinsunclub/index.html');

    // logic for iframe
    // const frameLocator = page.frameLocator("[title='Iframe title']");
    // const acceptBtn = frameLocator.locator('[title="Accept and continue"]')
    //
    // if(await acceptBtn.count() > 0) {
    //     await acceptBtn.click();
    // }
});

test('Storefront page Screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('landing.png', {
        threshold: 0.01, // Allow up to 1% of pixel differences
    });
});

test('Storefront page has title', async ({ page }) => {
    await expect(page).toHaveTitle("Sun Club");
});

test('Storefront page has picture', async ({ page }) => {
    const image  = page.locator("[alt='Landing image for Sun Club']")

    await expect(image).toBeVisible();
});


test('Verify "what Your Sun Club membership will include:" text', async ({ page }) => {
    const whatMembershipIncludeText  = await  page.locator(".membership-benefits__list-container li").allTextContents();

    const expectedText = [
        'More exclusive stories every day',
        'FOMO? Everything you NEED to know',
        'More showbiz, more sport, more opinion, more Deidre',
        'The BIGGEST news sent straight to you',
        'Tickets to Sun Superdays, plus Hols from £9.50',
        'Win BIG every month with more competitions'
    ]

    await expect(whatMembershipIncludeText.length).toBe(expectedText.length)

    for (let i = 0; i < expectedText.length; i++) {
        await expect(whatMembershipIncludeText[i]).toEqual(expectedText[i]);
    }
});

test('Verify "see here" link opens the T&C', async ({ page }) => {
    const seeHereLink = await page.locator(".tandcs__link")
    await seeHereLink.scrollIntoViewIfNeeded();
    await seeHereLink.click();

    await expect(page).toHaveTitle("Sun Club Terms and Conditions");
    await expect(page).toHaveURL("https://www-dev.uat-thesun.co.uk/sun-club-terms-and-conditions/")
});

test('Verify "All your questions answered" content', async ({ page }) => {
    const arrowBtns = await page.$$(".faq__list img")
    const expectedText = [
        'Your Sun Club membership will include everything you love from The Sun!\n' +
        '\n' +
        'Exclusive stories every day for members only, more showbiz, more sport, more opinion, more Deidre! The biggest and best news stories sent straight to you.\n' +
        'Never have FOMO again!\n' +
        'Plus exclusive members only monthly competitions and tickets to Sun Superdays and Hols from £9.50.',

        'Unlimited access to Sun Club is just £1.99 a month for your first year. Following this, a payment of £4.99 will be taken on or around the same day every month.\n' +
        '\n' +
        'If you take out an annual membership, you will pay just £12 for the full first 12 months, then £49.99 a year thereafter.\n' +
        '\n' +
        'Your membership is automatically renewed and you can give notice to cancel at any time.',

        'You can cancel at any time, simply follow the cancellation instructions in your My Account area. You must give us at least 7 days\' notice before your next billing date.',

        'Please visit our Help Hub here which includes our live chat service.',

        'Your membership to Sun Club is an instant access service and starts when your order is processed. You agree that the digital content will be available to you immediately, and you acknowledge that you will lose your automatic right to a 14 day cancellation period, we will not refund or credit for partial months used. By taking out this membership with News Group Newspapers, you agree that you are 18 or over, live in the UK or Ireland and are a new member to Sun Club. We reserve the right to not fulfil, or cancel your order, if you have already held a Sun Club membership in the past 6 months. Your membership is subject to our full membership terms and conditions which are available online here.'
    ]

    for (let i = 0; i < arrowBtns.length; i++) {
        await arrowBtns[i].click(); // Click the current arrow button
        const actualText = await page.locator(".faq__item__answer").nth(i).textContent(); // Get the displayed text
        expect(actualText.replace(/\s+/g, ' ').trim()).toBe(expectedText[i].replace(/\s+/g, ' ').trim()); // Verify the text matches
    }

});

test('Verify "Need help? Click here" leads to Help hub', async ({ page }) => {
    const needHelpClickHere = await page.locator(".faq__link")
    await needHelpClickHere.scrollIntoViewIfNeeded();
    await needHelpClickHere.click();

    await expect(page).toHaveTitle("Help Hub");
    await expect(page).toHaveURL("https://help.uat-thesun.co.uk/")
});

test('Verify monthly membership ', async ({ page }) => {
    const monthlyMembershipBtn = await page.getByText("Monthly Membership - £1.99 per month")
    await monthlyMembershipBtn.click();

    await expect(page).toHaveURL("https://join.uat-thesun.co.uk/checkout/index.html?pc=SMSC108")
    await expect(page.getByText('Your subscription start date:')).toBeVisible();
});

test('Verify annual membership ', async ({ page }) => {
    const annualMembershipBtn = await page.getByText("Annual Membership - £12 per year")
    await annualMembershipBtn.click();

    await expect(page).toHaveURL("https://join.uat-thesun.co.uk/checkout/index.html?pc=SMSC109")
    await expect(page.getByText('Your subscription start date:')).toBeVisible();
});



