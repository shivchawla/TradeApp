export {
	currentISODate, toISODate, yearStartISODate, 
	NDaysAgoISODate, NWeeksAgoISODate,
	dayStartISODate, dayEndISODate, duration,
	latestDayStartFromCalendar, toTimeZoneDate} from './date';

export { priceChangeFromSnapshot, priceChangeFromRealtime } from './format'; 

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}