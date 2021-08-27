import { Dimensions } from 'react-native';

export {
	currentISODate, toISODate, yearStartISODate, 
	NDaysAgoISODate, NWeeksAgoISODate, NMonthsAgoISODate, NYearsAgoISODate, 
	NDaysAfterISODate, NWeeksAfterISODate,
	dayStartISODate, dayEndISODate, duration,
	latestDayStartFromCalendar, toTimeZoneDate, 
	currentTimeZoneDate, durationBetweenDates, getRoundedCurrentTime} from './date';

export { priceChangeFromSnapshot, priceChangeFromRealtime, 
	formatValue, formatPctValue, formatName } from './format'; 

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
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

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );



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