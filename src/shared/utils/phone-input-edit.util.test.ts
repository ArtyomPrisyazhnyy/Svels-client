import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  applyBelarusNationalPhoneEdit,
  caretAfterDigitIndex,
  countDigitsBefore,
} from './phone-input-edit.util.ts';

describe('countDigitsBefore / caretAfterDigitIndex', () => {
  it('maps caret through mask separators', () => {
    const formatted = '29 123-45-67';
    assert.equal(countDigitsBefore(formatted, 0), 0);
    assert.equal(countDigitsBefore(formatted, 2), 2);
    assert.equal(countDigitsBefore(formatted, 3), 2);
    assert.equal(countDigitsBefore(formatted, 4), 3);
    assert.equal(caretAfterDigitIndex(formatted, 2), 2);
    assert.equal(caretAfterDigitIndex(formatted, 3), 4);
  });
});

describe('applyBelarusNationalPhoneEdit', () => {
  it('deletes the digit before caret on backspace in the middle (not the last digit)', () => {
    const formatted = '26 123-45-67';
    const caret = countDigitsBefore(formatted, 2);
    assert.equal(caret, 2);

    const result = applyBelarusNationalPhoneEdit(
      formatted,
      2,
      2,
      'deleteContentBackward',
      null,
    );

    assert.equal(result.formattedNational, '21 234-56-7');
    assert.equal(result.caret, caretAfterDigitIndex(result.formattedNational, 1));
  });

  it('deletes previous digit when caret is right after a mask space', () => {
    const formatted = '29 123-45-67';
    const result = applyBelarusNationalPhoneEdit(
      formatted,
      3,
      3,
      'deleteContentBackward',
      null,
    );

    assert.equal(result.formattedNational, '21 234-56-7');
    assert.equal(result.caret, 1);
  });

  it('deletes the digit at caret on Delete', () => {
    const formatted = '29 123-45-67';
    const result = applyBelarusNationalPhoneEdit(
      formatted,
      2,
      2,
      'deleteContentForward',
      null,
    );

    assert.equal(result.formattedNational, '29 234-56-7');
    assert.equal(result.caret, 2);
  });

  it('inserts digits in the middle', () => {
    const formatted = '29 123-45-67';
    const result = applyBelarusNationalPhoneEdit(formatted, 2, 2, 'insertText', '5');

    assert.equal(result.formattedNational, '29 512-34-56');
    assert.equal(result.caret, caretAfterDigitIndex(result.formattedNational, 3));
  });

  it('replaces a selected digit range with typed digits', () => {
    const formatted = '29 123-45-67';
    const start = caretAfterDigitIndex(formatted, 2);
    const end = caretAfterDigitIndex(formatted, 5);
    const result = applyBelarusNationalPhoneEdit(
      formatted,
      start,
      end,
      'insertReplacementText',
      '000',
    );

    assert.equal(result.formattedNational, '29 000-45-67');
    assert.equal(result.caret, caretAfterDigitIndex(result.formattedNational, 5));
  });

  it('pastes a full +375 number into an empty field', () => {
    const result = applyBelarusNationalPhoneEdit(
      '',
      0,
      0,
      'insertFromPaste',
      '+375290000001',
    );

    assert.equal(result.formattedNational, '29 000-00-01');
    assert.equal(result.caret, result.formattedNational.length);
  });

  it('pastes 375 without plus and strips 80 prefix', () => {
    const from375 = applyBelarusNationalPhoneEdit('', 0, 0, 'insertFromPaste', '375330000002');
    assert.equal(from375.formattedNational, '33 000-00-02');

    const from80 = applyBelarusNationalPhoneEdit('', 0, 0, 'insertFromPaste', '80290000003');
    assert.equal(from80.formattedNational, '29 000-00-03');
  });

  it('pastes partial digits in the middle', () => {
    const formatted = '26 000-00-01';
    const result = applyBelarusNationalPhoneEdit(
      formatted,
      2,
      2,
      'insertFromPaste',
      '29',
    );

    assert.equal(result.formattedNational, '26 290-00-00');
    assert.equal(result.caret, caretAfterDigitIndex(result.formattedNational, 4));
  });

  it('caps national length at nine digits', () => {
    const result = applyBelarusNationalPhoneEdit(
      '',
      0,
      0,
      'insertFromPaste',
      '291234567890',
    );

    assert.equal(result.formattedNational, '29 123-45-67');
  });

  it('supports backspace twice after operator code then typing 29', () => {
    let formatted = '26 000-00-01';
    let caret = 2;

    let step = applyBelarusNationalPhoneEdit(
      formatted,
      caret,
      caret,
      'deleteContentBackward',
      null,
    );
    formatted = step.formattedNational;
    caret = step.caret;
    assert.equal(formatted, '20 000-00-1');

    step = applyBelarusNationalPhoneEdit(
      formatted,
      caret,
      caret,
      'deleteContentBackward',
      null,
    );
    formatted = step.formattedNational;
    caret = step.caret;
    assert.equal(formatted, '00 000-01');

    step = applyBelarusNationalPhoneEdit(formatted, caret, caret, 'insertText', '29');
    assert.equal(step.formattedNational, '29 000-00-01');
    assert.equal(step.caret, caretAfterDigitIndex(step.formattedNational, 2));
  });
});
