import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    ng?: { getComponent(el: Element): any };
    exported?: { format: string; content: string | Blob }[];
  }
}

const editor = (page: Page) => page.locator('fsd-diagram, fsd-sequence');
const tab = (page: Page, name: string) => page.getByRole('tab', { name: new RegExp(`^${name}`) });
const exportButton = (page: Page, format: string) =>
  editor(page).getByRole('button', { name: `Export as ${format}` });
const appState = (page: Page) =>
  page.evaluate(() => {
    const app = window.ng!.getComponent(document.querySelector('app-root')!);
    return { nodes: app.currentFlowchart.nodes.length as number };
  });

let errors: string[];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await editor(page).getByRole('button', { name: '+ Node' }).waitFor();
});

test.afterEach(() => {
  expect(errors).toEqual([]);
});

for (const [name, add, preset] of [
  ['Flowchart', '+ Node', 'Node Payment valid?'],
  ['Question Flow', '+ Question', 'Question What is your role?'],
  ['Journey Map', '+ Step', 'Step 3: Complete profile'],
] as const) {
  test(`${name} renders its preset and adds nodes`, async ({ page }) => {
    await tab(page, name).click();
    const addButton = editor(page).getByRole('button', { name: add });
    await addButton.waitFor();
    await expect(editor(page).getByRole('button', { name: preset })).toBeVisible();
    const groups = editor(page).locator('svg g');
    const before = await groups.count();
    await addButton.click();
    await expect(groups).toHaveCount(before + 1);
  });
}

test('changing variant remounts with the new initialModel', async ({ page }) => {
  await tab(page, 'Question Flow').click();
  await editor(page).getByRole('button', { name: '+ Question' }).waitFor();
  await expect(editor(page).getByRole('button', { name: 'Node Payment valid?' })).toHaveCount(0);
  await tab(page, 'Flowchart').click();
  await expect(editor(page).getByRole('button', { name: 'Node Payment valid?' })).toBeVisible();
});

test('theme input reaches the editor', async ({ page }) => {
  const background = () =>
    editor(page).evaluate((host) => {
      const painted = [...host.querySelectorAll('*')].find(
        (el) => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)',
      );
      return painted && getComputedStyle(painted).backgroundColor;
    });
  await page.getByRole('button', { name: '☀ Light' }).click();
  await expect.poll(background).toBe('rgb(255, 255, 255)');
  await page.getByRole('button', { name: '☾ Dark' }).click();
  await expect.poll(background).not.toBe('rgb(255, 255, 255)');
});

for (const [name, ready, stem, key] of [
  ['Flowchart', '+ Node', 'diagram', 'nodes'],
  ['Sequence', '+ Actor', 'sequence', 'actors'],
] as const) {
  test(`${name} exports download a file without an exportEvent listener`, async ({ page }) => {
    await tab(page, name).click();
    await editor(page).getByRole('button', { name: ready }).waitFor();
    for (const [format, extension] of [
      ['JSON', 'json'],
      ['Mermaid', 'mermaid'],
      ['PlantUML', 'puml'],
      ['SVG', 'svg'],
      ['PNG', 'png'],
    ]) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        exportButton(page, format).click(),
      ]);
      expect(download.suggestedFilename()).toBe(`${stem}.${extension}`);
      const content = readFileSync(await download.path());
      expect(content.length).toBeGreaterThan(0);
      if (format === 'JSON') expect(JSON.parse(content.toString())[key].length).toBeGreaterThan(0);
    }
  });
}

test('Mermaid import replaces the model', async ({ page }) => {
  await editor(page).getByRole('button', { name: 'Import diagram' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('textarea').fill('graph TD\n  A[Alpha] --> B[Bravo]\n  B --> C[Charlie]\n');
  await dialog.getByRole('button', { name: 'Import', exact: true }).click();
  await expect(editor(page).getByRole('button', { name: 'Node Bravo' })).toBeVisible();
});

test('Sequence adds an actor and undoes it', async ({ page }) => {
  await tab(page, 'Sequence').click();
  const addActor = editor(page).getByRole('button', { name: '+ Actor' });
  await addActor.waitFor();
  const shapes = editor(page).locator('svg *');
  const before = await shapes.count();
  await addActor.click();
  await expect.poll(() => shapes.count()).toBeGreaterThan(before);
  await editor(page).locator('button[title="Undo (Ctrl+Z)"]').click();
  await expect(shapes).toHaveCount(before);
});

test('the editor unmounts on the docs tab and returns', async ({ page }) => {
  await tab(page, 'For Developers').click();
  await expect(page.locator('.docs-page')).toBeVisible();
  await expect(editor(page)).toHaveCount(0);
  await tab(page, 'Flowchart').click();
  await expect(editor(page).getByRole('button', { name: '+ Node' })).toBeVisible();
});

test.describe('Angular outputs', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'development', 'needs window.ng');
  });

  test('modelChange reaches the host', async ({ page }) => {
    const { nodes } = await appState(page);
    await editor(page).getByRole('button', { name: '+ Node' }).click();
    await expect.poll(async () => (await appState(page)).nodes).toBe(nodes + 1);
  });

  test('a bound exportEvent replaces the download', async ({ page }) => {
    await page.evaluate(() => {
      window.exported = [];
      const diagram = window.ng!.getComponent(document.querySelector('fsd-diagram')!);
      diagram.exportEvent.subscribe((e: { format: string; content: string | Blob }) =>
        window.exported!.push(e),
      );
    });
    // A theme change rebuilds the editor props, which picks up the new listener.
    await page.getByRole('button', { name: '☾ Dark' }).click();
    let downloads = 0;
    page.on('download', () => downloads++);
    await exportButton(page, 'JSON').click();
    await expect(page.getByText('Exported as JSON')).toBeVisible();
    const exported = await page.evaluate(() => window.exported!.map((e) => e.format));
    expect(exported).toEqual(['json']);
    expect(downloads).toBe(0);
  });
});
