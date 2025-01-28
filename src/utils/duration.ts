import { Duration } from 'dayjs/plugin/duration';
import { dayjs } from './dayjs';

function formatDuration(duration: Duration) {
  return duration.format('mm:ss');
}

function getDuration(start: Date, end: Date) {
  return dayjs.duration(dayjs(start).diff(dayjs(end)));
}

export { formatDuration, getDuration };
