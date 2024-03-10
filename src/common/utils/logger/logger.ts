import { createLogger, format } from 'winston';
import LokiTransport from 'winston-loki';

class Logger {
  options = {
    format: format.combine(
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new LokiTransport({
        labels: { App_Name: 'Trabill' },
        host: 'http://127.0.0.1:3100',
      }),
    ],
  };

  public logger = createLogger(this.options);
}
export default Logger;
