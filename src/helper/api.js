import {apiUrl, apiKey, apiSecret, dataUrl} from '../config';
import axios from 'axios';
import { Base64 } from 'js-base64';
import {processBars, processSnapshot} from './process'

//Get account ID from temporary storage (after successful login)
const account_id = '9703c0b1-67bf-492d-aeff-95c108299188';

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.common['Authorization'] = `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`;

export const getClock = async() => {
	return await axios.get('/v1/clock').then(r => r.data);
} 

export const getSnapshot = async(symbol) => {
	console.log("Fetching Snapshot");
	console.log(axios.defaults.headers.common['Authorization']);
	console.log(`${dataUrl}/v2/stocks/${symbol}/snapshot`);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/snapshot`).then(r => processSnapshot(r.data));
}

export const getHistoricalData = async(symbol, query = '') => {
	console.log("Fetching Daily Historical");
	console.log(`${dataUrl}/v2/stocks/${symbol}/bars`);
	console.log(query);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/bars?${query}`).then(r => processBars(r.data));
}

export const getIntradayData = async(symbol, query = '') => {
	console.log("Fetching Intraday Historical");
	console.log(`${dataUrl}/v2/stocks/${symbol}/bars`);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/bars?${query}`).then(r => processBars(r.data));
}

export const getStockPosition = async(symbol) => {
	console.log("Fetching Current Stock Position");
	console.log(`/v1/trading/accounts/${account_id}/positions/${symbol}`);
	return await axios.get(`/v1/trading/accounts/${account_id}/positions/${symbol}`).then(r => r.data);	
}

export const getStockPortfolio = async () => {
	console.log("Fetching Current Stock Portfolio");
	return await axios.get(`/v1/trading/accounts/${account_id}/positions`).then(r => r.data);
}

export const getTradingAccount = async () => {
	console.log("Fetching User Trading Account");
	return await axios.get(`/v1/trading/accounts/${account_id}/account`).then(r => r.data)
}

export const placeOrder = async(request) => {
	console.log("Placing Order");
	console.log(request);
	return await axios.post(`/v1/trading/accounts/${account_id}/orders`, request).then(r => r.data)
}