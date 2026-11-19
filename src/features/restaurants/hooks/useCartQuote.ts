'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isAbortError } from '@/shared/api/api-client';
import type { CartLineItem } from '@/shared/types/cart';
import type { CartQuoteResponse } from '@/shared/types/pre-order';
import { toQuoteItems } from '@/shared/utils/order-price.util';
import { quotePreOrder } from '../api/pre-orders.api';

const QUOTE_DEBOUNCE_MS = 300;

export type CartQuotePhase = 'idle' | 'loading' | 'ready' | 'error';

interface CartQuoteState {
  phase: CartQuotePhase;
  quote: CartQuoteResponse | null;
}

function quoteSignature(items: CartLineItem[]): string {
  return JSON.stringify(toQuoteItems(items));
}

function isQuoteResponse(value: CartQuoteResponse): boolean {
  return (
    typeof value?.subtotal === 'number' &&
    typeof value?.total === 'number' &&
    Array.isArray(value?.lines) &&
    Array.isArray(value?.giftRewards)
  );
}

export function useCartQuote(
  restaurantId: string,
  items: CartLineItem[],
  token: string | null,
) {
  const inflight = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const signature = useMemo(() => quoteSignature(items), [items]);
  const [trackedSignature, setTrackedSignature] = useState(signature);
  const [state, setState] = useState<CartQuoteState>(() =>
    items.length > 0 ? { phase: 'loading', quote: null } : { phase: 'idle', quote: null },
  );

  if (trackedSignature !== signature) {
    setTrackedSignature(signature);
    setState((prev) => {
      if (items.length === 0) {
        return { phase: 'idle', quote: null };
      }
      const keepQuote = prev.quote != null && prev.phase !== 'error';
      return { phase: 'loading', quote: keepQuote ? prev.quote : null };
    });
  }

  const begin = useCallback(() => {
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;
    return controller;
  }, []);

  const requestQuote = useCallback(
    async (
      signal: AbortSignal,
      currentItems: CartLineItem[],
      currentToken: string | null,
    ): Promise<CartQuoteResponse | null> => {
      if (signal.aborted || currentItems.length === 0) {
        return null;
      }
      const id = ++generation.current;
      try {
        const quote = await quotePreOrder(
          restaurantId,
          { items: toQuoteItems(currentItems) },
          currentToken,
          signal,
        );
        if (signal.aborted || id !== generation.current) {
          return null;
        }
        if (!isQuoteResponse(quote)) {
          setState({ phase: 'error', quote: null });
          return null;
        }
        setState({ phase: 'ready', quote });
        return quote;
      } catch (error) {
        if (isAbortError(error) || signal.aborted || id !== generation.current) {
          return null;
        }
        setState({ phase: 'error', quote: null });
        return null;
      }
    },
    [restaurantId],
  );

  useEffect(() => {
    if (items.length === 0) {
      inflight.current?.abort();
      return;
    }
    const controller = begin();
    const timer = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        void requestQuote(controller.signal, items, token);
      }
    }, QUOTE_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [begin, items, requestQuote, signature, token]);

  const quoteNow = useCallback(() => {
    if (items.length === 0) {
      return Promise.resolve(null);
    }
    const controller = begin();
    return requestQuote(controller.signal, items, token);
  }, [begin, items, requestQuote, token]);

  const showSkeleton = state.phase === 'loading' && state.quote == null;

  return {
    phase: state.phase,
    quote: state.quote,
    showSkeleton,
    quoteNow,
    retry: quoteNow,
  };
}
