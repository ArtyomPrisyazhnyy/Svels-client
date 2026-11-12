import * as Sentry from '@sentry/nextjs';
import { getSentryClientOptions } from '@/shared/monitoring/sentry-init';

const options = getSentryClientOptions();
if (options) {
  Sentry.init(options);
}
