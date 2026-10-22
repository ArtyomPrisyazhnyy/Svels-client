import * as Sentry from '@sentry/nextjs';
import { getSentryServerOptions } from '@/shared/monitoring/sentry-init';

const options = getSentryServerOptions();
if (options) {
  Sentry.init(options);
}
