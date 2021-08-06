export const priceChangeFromSnapshot = ({dailyBar = {}, prevDailyBar = {}} = {}) => {
	const {closePrice: prevClose} = prevDailyBar;
	const {closePrice: currentClose} = dailyBar;

	return {price: currentClose, changeValue: (currentClose - prevClose), changePct: (!!prevClose ? (currentClose/prevClose - 1)*100 : 0)}
}

export const priceChangeFromRealtime = ({p} = {}, {prevDailyBar = {}} = {}) => {
	
	// console.log("priceChangeFromRealtime");
	// console.log(prevDailyBar);
	// console.log(p);

	const changeValue = !!p && !!prevDailyBar?.closePrice ? p - prevDailyBar.closePrice : 0;
	const changePct = !!p && !!prevDailyBar?.closePrice ? (p/prevDailyBar.closePrice - 1)*100 : 0;
	
	return {price: p, ...changeValue && {changeValue}, ...changePct && {changePct}};  	
}

