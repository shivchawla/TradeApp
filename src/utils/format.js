import { titleCase as toTitleCase } from "title-case";

export const priceChangeFromSnapshot = ({dailyBar = {}, prevDailyBar = {}} = {}) => {
	const {closePrice: prevClose} = prevDailyBar;
	const {closePrice: currentClose} = dailyBar;

	return {price: currentClose, changeValue: (currentClose - prevClose), changePct: (!!prevClose ? (currentClose/prevClose - 1)*100 : 0)}
}

export const priceChangeFromRealtime = ({p} = {}, {prevDailyBar = {}} = {}) => {
	
	const changeValue = !!p && !!prevDailyBar?.closePrice ? p - prevDailyBar.closePrice : 0;
	const changePct = !!p && !!prevDailyBar?.closePrice ? (p/prevDailyBar.closePrice - 1)*100 : 0;
	
	return {price: p, ...changeValue && {changeValue}, ...changePct && {changePct}};  	
}


export const formatValue = (value, {upperCase = true, titleCase = false, lowerCase = false} = {}) => {
	var output = value;

	if (value) {
		try {
			output = parseFloat(value);
			var decimals = output.countDecimals();
			if(decimals == 0) {
				return value;
			} else {
				return output.toFixed(2);
			}
		} catch (e) { console.log(e); }

		if (upperCase) {
			return value.toUpperCase();
		}

		if (titleCase) {
			return toTitleCase(value);
		}

		if (lowerCase) {
			return value.toLowerCase();
		}
	} else {
		return '--';
	}
}


export const formatPctValue = (changeValue) => {
	return (changeValue*100).toFixed(2) + '%'
}

