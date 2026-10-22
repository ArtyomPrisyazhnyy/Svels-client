import * as Sentry from '@sentry/nextjs';
import { getSentryEdgeOptions } from '@/shared/monitoring/sentry-init';

const options = getSentryEdgeOptions();
if (options) {
  Sentry.init(options);
}
