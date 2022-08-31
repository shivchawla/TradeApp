export {
	currentISODate, toISODate, yearStartISODate, startOfDayLocal, 
	NDaysAgoISODate, NWeeksAgoISODate, NMonthsAgoISODate, NYearsAgoISODate, 
	NDaysAfterISODate, NBusinessDaysAfterISODate, NBusinessDaysBeforeISODate, NWeeksAfterISODate,
	dayStartISODate, dayEndISODate, duration,
	latestDayStartFromCalendar, toTimeZoneDate, 
	currentTimeZoneDate, durationBetweenDates, getRoundedCurrentTime} from './date';

export { priceChangeFromSnapshot, priceChangeFromRealtime, 
	formatValue, formatPctValue, formatName } from './format'; 

Number.prototype.countDecimals = function () {
	if(this.valueOf()) {
	    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
	    return this.toString().split(".")[1].length || 0;
    } else {
    	return 0;
    } 
}

export const diffArray = (arr1, arr2) => {
	return arr1
	.filter(x => !arr2.includes(x))
	.concat(arr2.filter(x => !arr1.includes(x)));
}

export const removeArray = (arr, value, key) => {
	return arr.filter(item => {
		if (key) {
			return item[key] != value[key];
		} else {
			return item != value;
		}
	})
}

export const generateName = (names = [], keyword = 'Random') => {
	var found = false;
	var count = names.length || 1;

	console.log("Generate Name");
	console.log(names);

	const newName = () => {
		return keyword + '-' + count;
	}

	while(!found) {
		nName = newName();
		found = !names.includes(nName);
		count++;
	}

	return nName;	
}