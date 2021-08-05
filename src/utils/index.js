export {
	currentISODate, toISODate, yearStartISODate, NDaysAgoISODate,
	dayStartISODate, dayEndISODate, duration,
	latestDayStartFromCalendar} from './date';

export { priceChangeFromSnapshot } from './format'; 

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}