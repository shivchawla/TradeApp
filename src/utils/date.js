import moment from 'moment-timezone';

const timeZone = 'America/New_York';
const startHour = 9;
const startMinute = 30;

const endHour = 16;
const endMinute = 0;

export const currentISODate = (fmt) => moment.tz(timeZone).utc().format(fmt);
export const NDaysAgoISODate = (days, fmt) => moment.tz(timeZone).subtract(days, 'days').utc().format(fmt);
export const NWeeksAgoISODate = (wks, fmt) => moment.tz(timeZone).subtract(wks, 'weeks').utc().format(fmt);
export const NDaysAfterISODate = (days, fmt) => moment.tz(timeZone).add(days, 'days').utc().format(fmt);
export const NWeeksAfterISODate = (wks, fmt) => moment.tz(timeZone).add(wks, 'weeks').utc().format(fmt);

export const currentTimeZoneDate = (fmt) => moment.tz(timeZone).format(fmt);
export const toTimeZoneDate = (d, fmt) => moment(d).tz(timeZone).format(fmt);
export const toISODate = (d, fmt) => moment(d).tz(timeZone).utc().format(fmt);
export const yearStartISODate = () => moment.tz(timeZone).startOf('year').hour(startHour).minute(startMinute).utc().format();


//???THIS IS TRICKY AS MARKET NOT ALWAYS CLOSE AT SAME TIME (24th December or other corner cases)
export const dayStartISODate = (d) => moment(d).tz(timeZone).hour(startHour).minute(startMinute).second(0).utc().format();
export const dayEndISODate = (d) => {
	var d = moment.tz(timeZone).hour(endHour).minute(endMinute).second(0).utc();
	//Check if end is after current, if yes subtract one day
	if (d.isAfter(moment.tz(timeZone).utc())) {
		return d.subtract(1, 'days').format();
	}

	return d.format();
}

export const duration = (date, unit = 'milliseconds') => Math.abs(moment.duration(moment.tz(timeZone).diff(moment(date).tz(timeZone))).as(unit));
export const durationBetweenDates = (first, second, unit = 'milliseconds') => {
	return moment.duration(moment(second).tz(timeZone).diff(moment(first).tz(timeZone))).as(unit);
}	

/*
	Function gets the latest trading start datetime (today if market is open) 
*/
export const latestDayStartFromCalendar = (calendar, clock) => {
	
	var startDt;

	calendar.reverse().some(item => {
		startDt = moment(item.date).tz(timeZone).hour(startHour).minute(startMinute).second(0).utc();
		if (startDt.isBefore(moment(clock.next_open))) {
			return true;
		}
	});

	return startDt.format();		
}
