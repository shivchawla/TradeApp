export {
	currentISODate, toISODate, yearStartISODate, 
	dayStartISODate, dayEndISODate, duration} from './date';


export { priceChangeFromSnapshot } from './format'; 

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}