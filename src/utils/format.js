export const priceChangeFromSnapshot = ({dailyBar, prevDailyBar}) => {
	const {closePrice: prevClose} = prevDailyBar;
	const {closePrice: currentClose} = dailyBar;

	return {price: currentClose, changeValue: (currentClose - prevClose).toFixed(2), changePct: (!!prevClose ? (currentClose/prevClose - 1)*100 : 0).toFixed(2)}
}