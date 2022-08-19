import moment from 'moment-timezone';
import moment_bd from 'moment-business-days';


const tradingTimeZone = 'America/New_York';
const startHour = 9;
const startMinute = 30;

const endHour = 16;
const endMinute = 0;


export const startOfDayLocal = (d, fmt) => moment(d).local().hour(0).minute(0).second(0).utc().format(fmt);
export const currentISODate = (fmt) => moment.tz(tradingTimeZone).utc().format(fmt);
export const NDaysAgoISODate = (days, fmt) => moment.tz(tradingTimeZone).subtract(days, 'days').utc().format(fmt);
export const NWeeksAgoISODate = (wks, fmt) => moment.tz(tradingTimeZone).subtract(wks, 'weeks').utc().format(fmt);
export const NMonthsAgoISODate = (wks, fmt) => moment.tz(tradingTimeZone).subtract(wks, 'months').utc().format(fmt);
export const NYearsAgoISODate = (wks, fmt) => moment.tz(tradingTimeZone).subtract(wks, 'years').utc().format(fmt);

export const NDaysAfterISODate = (days, fmt) => moment.tz(tradingTimeZone).add(days, 'days').utc().format(fmt);
export const NBusinessDaysAfterISODate = (days, fmt) => moment_bd(moment.tz(tradingTimeZone)).businessAdd(days).utc().format(fmt);
export const NBusinessDaysBeforeISODate = (days, fmt) => moment_bd(moment.tz(tradingTimeZone)).businessSubtract(days).utc().format(fmt);
export const NWeeksAfterISODate = (wks, fmt) => moment.tz(tradingTimeZone).add(wks, 'weeks').utc().format(fmt);

export const currentTimeZoneDate = (fmt) => moment.tz().format(fmt);
export const toTimeZoneDate = (d, fmt) => moment.tz(d, tradingTimeZone).local().format(fmt);
export const toISODate = (d, fmt) => moment.tz(d, tradingTimeZone).utc().format(fmt);
export const yearStartISODate = () => moment.tz(tradingTimeZone).startOf('year').hour(startHour).minute(startMinute).utc().format();

//???THIS IS TRICKY AS MARKET NOT ALWAYS CLOSE AT SAME TIME (24th December or other corner cases)
export const dayStartISODate = (d) => moment(d).tz(tradingTimeZone).hour(startHour).minute(startMinute).second(0).utc().format();
export const dayEndISODate = (d) => {
	var d = moment.tz(tradingTimeZone).hour(endHour).minute(endMinute).second(0).utc();
	//Check if end is after current, if yes subtract one day
	if (d.isAfter(moment.tz(tradingTimeZone).utc())) {
		return d.subtract(1, 'days').format();
	}

	return d.format();
}

export const duration = (date, unit = 'milliseconds') => Math.abs(moment.duration(moment.tz(tradingTimeZone).diff(moment(date).tz(tradingTimeZone))).as(unit));
export const durationBetweenDates = (first, second, unit = 'milliseconds') => {
	return moment.duration(moment(second).tz(tradingTimeZone).diff(moment(first).tz(tradingTimeZone))).as(unit);
}	

/*
	Function gets the latest trading start datetime (today if market is open) 
*/
export const latestDayStartFromCalendar = (calendar, clock) => {
	
	var startDt;

	calendar.reverse().some(item => {
		startDt = moment(item.date).tz(tradingTimeZone).hour(startHour).minute(startMinute).second(0).utc();
		if (startDt.isBefore(moment(clock.next_open))) {
			return true;
		}
	});

	return startDt.format();		
}


//TRICKY as in FREE PLAN, only data is delayed by 15min
export const getRoundedCurrentTime = (round, fmt) => {
	if (round == '1Min') {
		return moment.tz(tradingTimeZone).subtract(15, 'minutes').startOf('minute').utc().format(fmt)
	} else if (round == '2Min') {
		const t = moment.tz(tradingTimeZone).subtract(15, 'minutes').startOf('minute');
		if (t.minute() % 2 != 0) {
			return t.subtract(1, 'minutes').utc().format(fmt)
		}	
	} else if (round == '5Min') {
		const t = moment.tz(tradingTimeZone).subtract(15, 'minutes').startOf('minute');
		const extraMinutes = t.minute() % 5;  
		if (extraMinutes != 0) {
			return t.subtract(extraMinutes, 'minutes').utc().format(fmt)
		}	
	}
}
