'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/store/layout-store';

interface UseHotkeysOptions {
  onSave?: () => void;
  canSave?: boolean;
}

/**
 * Горячие клавиши редактора планировки (по аналогии с Restoplace):
 *   Ctrl+S — сохранить
 *   Ctrl+A — выделить все
 *   Ctrl+C / Ctrl+V — копировать/вставить decor
 *   Ctrl+D — дублировать
 *   Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z — undo/redo
 *   Delete / Backspace — удалить выделение
 *   Стрелки — переместить на 5px (Shift — на 10px)
 *   Ctrl+] / Ctrl+[ — слой выше/ниже
 *   ] / [ — наверх/вниз
 *   Escape — снять выделение / выйти из режима рисования
 *
 * Важно: буквенные хоткеи проверяются через `e.code` (например `KeyZ`),
 * а не `e.key`, т.к. на русской раскладке `e.key` для Z — это `'я'`,
 * для Y — `'н'` и т.д., что ломало Ctrl+Z/Ctrl+Y и остальные Ctrl-шорткаты.
 */
export function useHotkeys({ onSave, canSave }: UseHotkeysOptions): void {
  const selectAll = useLayoutStore((s) => s.selectAll);
  const clearSelection = useLayoutStore((s) => s.clearSelection);
  const deleteSelection = useLayoutStore((s) => s.deleteSelection);
  const copySelection = useLayoutStore((s) => s.copySelection);
  const pasteSelection = useLayoutStore((s) => s.pasteSelection);
  const duplicateSelection = useLayoutStore((s) => s.duplicateSelection);
  const undo = useLayoutStore((s) => s.undo);
  const redo = useLayoutStore((s) => s.redo);
  const moveSelected = useLayoutStore((s) => s.moveSelected);
  const bringForward = useLayoutStore((s) => s.bringForward);
  const sendBackward = useLayoutStore((s) => s.sendBackward);
  const bringToFront = useLayoutStore((s) => s.bringToFront);
  const sendToBack = useLayoutStore((s) => s.sendToBack);
  const selectedIds = useLayoutStore((s) => s.selectedIds);
  const setTool = useLayoutStore((s) => s.setTool);

  useEffect(() => {
    function isInputTarget(target: EventTarget | null): boolean {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    }

    function handler(e: KeyboardEvent) {
      if (isInputTarget(e.target)) return;
      const ctrl = e.ctrlKey || e.metaKey;
      const code = e.code;

      if (ctrl && code === 'KeyS') {
        e.preventDefault();
        if (canSave !== false) onSave?.();
        return;
      }
      if (ctrl && code === 'KeyA') {
        e.preventDefault();
        selectAll();
        return;
      }
      if (ctrl && code === 'KeyC') {
        copySelection();
        return;
      }
      if (ctrl && code === 'KeyV') {
        e.preventDefault();
        pasteSelection();
        return;
      }
      if (ctrl && code === 'KeyD') {
        e.preventDefault();
        duplicateSelection();
        return;
      }
      if (ctrl && !e.shiftKey && code === 'KeyZ') {
        e.preventDefault();
        undo();
        return;
      }
      if ((ctrl && code === 'KeyY') || (ctrl && e.shiftKey && code === 'KeyZ')) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          deleteSelection();
        }
        return;
      }
      if (e.key === 'Escape') {
        clearSelection();
        setTool('select');
        return;
      }
      if (ctrl && e.key === ']') {
        if (selectedIds.length === 1) bringForward(selectedIds[0]);
        return;
      }
      if (ctrl && e.key === '[') {
        if (selectedIds.length === 1) sendBackward(selectedIds[0]);
        return;
      }
      if (!ctrl && e.key === ']') {
        if (selectedIds.length === 1) bringToFront(selectedIds[0]);
        return;
      }
      if (!ctrl && e.key === '[') {
        if (selectedIds.length === 1) sendToBack(selectedIds[0]);
        return;
      }
      const step = e.shiftKey ? 10 : 5;
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveSelected(-step, 0); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveSelected(step, 0); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveSelected(0, -step); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSelected(0, step); return; }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    onSave, canSave, selectAll, clearSelection, deleteSelection, copySelection, pasteSelection,
    duplicateSelection, undo, redo, moveSelected, bringForward, sendBackward, bringToFront,
    sendToBack, selectedIds, setTool,
  ]);
}
