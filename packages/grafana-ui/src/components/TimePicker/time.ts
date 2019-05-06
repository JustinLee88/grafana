import moment, { Moment } from 'moment';
import { TimeOption, TimeRange, RawTimeRange, TIME_FORMAT } from '@grafana/ui';

import * as dateMath from '../../utils/datemath';
import { describeTimeRange } from '../../utils/rangeutil';

export const mapTimeOptionToTimeRange = (
  timeOption: TimeOption,
  isTimezoneUtc: boolean,
  timezone?: dateMath.Timezone
): TimeRange => {
  const fromMoment = stringToMoment(timeOption.from, isTimezoneUtc, false, timezone);
  const toMoment = stringToMoment(timeOption.to, isTimezoneUtc, true, timezone);

  return { from: fromMoment, to: toMoment, raw: { from: timeOption.from, to: timeOption.to } };
};

export const stringToMoment = (
  value: string,
  isTimezoneUtc: boolean,
  roundUp?: boolean,
  timezone?: dateMath.Timezone
): Moment => {
  if (value.indexOf('now') !== -1) {
    if (!dateMath.isValid(value)) {
      return moment();
    }

    const parsed = dateMath.parse(value, roundUp, timezone);
    return parsed || moment();
  }

  if (isTimezoneUtc) {
    return moment.utc(value, TIME_FORMAT);
  }

  return moment(value, TIME_FORMAT);
};

export const mapTimeRangeToRangeString = (timeRange: RawTimeRange): string => {
  return describeTimeRange(timeRange);
};

export const isValidTimeString = (text: string) => dateMath.isValid(text);
