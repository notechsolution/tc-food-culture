import moment from 'moment';
import _ from 'lodash';

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const MONTH_FORMAT = 'YYYYMM';

export function now() {
    return nowMoment().format(TIME_FORMAT);
}

export function formatTimeString(timeString:string) :string{
    return moment(timeString).format(TIME_FORMAT);
}

export function formatDateString(dateString:string) :string {
    return moment(dateString).format(DATE_FORMAT);
}

export function nowMoment() {
    return moment(moment.utc().toDate());
}

export function numberOfYearMonth(dateToTransform: Date): number {
    return Number(moment(dateToTransform).format('YYYYMM'));
}

export function useTableDateFormat(row: never, column: never, cellValue: Date) {
    if (_.isNull(cellValue)) {
        return '';
    }
    return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
}