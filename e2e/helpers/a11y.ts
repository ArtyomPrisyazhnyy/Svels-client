import AxeBuilder from '@axe-core/playwright';
import { type Page, expect } from '@playwright/test';

export type AxeScanOptions = {
  /** Limit analysis to these rules (axe rule ids). */
  rules?: string[];
  /** Exclude rules from the run. */
  excludeRules?: string[];
  /** Limit analysis to a selector (e.g. open modal). */
  includeSelector?: string;
};

export async function expectNoSeriousAxeViolations(
  page: Page,
  options: AxeScanOptions = {},
): Promise<void> {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

  if (options.includeSelector) {
    builder = builder.include(options.includeSelector);
  }

  if (options.rules?.length) {
    builder = builder.withRules(options.rules);
  }

  if (options.excludeRules?.length) {
    builder = builder.disableRules(options.excludeRules);
  } else if (!options.rules?.length) {
    builder = builder.disableRules(['color-contrast']);
  }

  const results = await builder.analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  if (serious.length > 0) {
    const summary = serious
      .map((v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.map((n) => n.html).join('\n')}`)
      .join('\n\n');
    expect(serious, `axe serious/critical violations:\n${summary}`).toHaveLength(0);
  }
}

export async function expectNoContrastViolations(
  page: Page,
  includeSelector = '#main-content',
): Promise<void> {
  let builder = new AxeBuilder({ page }).withRules(['color-contrast']);
  if (includeSelector) {
    builder = builder.include(includeSelector);
  }
  const results = await builder.analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );
  if (serious.length > 0) {
    const summary = serious
      .map((v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.map((n) => n.html).join('\n')}`)
      .join('\n\n');
    expect(serious, `axe serious/critical violations:\n${summary}`).toHaveLength(0);
  }
}
