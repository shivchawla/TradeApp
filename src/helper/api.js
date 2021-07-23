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

export const getStocks = async() => {
	console.log("Getting Stocks");
	return await axios.get('/v1/assets', {params: {status: 'active'}}).then(r => r.data);
}

export const getSnapshot = async(symbol) => {
	console.log("Fetching Snapshot");
	console.log(axios.defaults.headers.common['Authorization']);
	console.log(`${dataUrl}/v2/stocks/${symbol}/snapshot`);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/snapshot`).then(r => processSnapshot(r.data));
}

export const getHistoricalData = async(symbol, params = {}) => {
	console.log("Fetching Daily Historical");
	console.log(`${dataUrl}/v2/stocks/${symbol}/bars`);
	console.log(params);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/bars`, {params}).then(r => processBars(r.data));
}

export const getIntradayData = async(symbol, params = {}) => {
	console.log("Fetching Intraday Historical");
	console.log(`${dataUrl}/v2/stocks/${symbol}/bars`);
	console.log(params);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/bars`, {params}).then(r => processBars(r.data));
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

export const updateOrder = async(order_id, request) => {
	console.log("Updating Order");
	console.log(request);
	return await axios.patch(`/v1/trading/accounts/${account_id}/orders/${order_id}`, request).then(r => r.data)
}

export const cancelOrder = async(order_id) => {
	console.log("Canceling Order: ", order_id);
	return await axios.delete(`/v1/trading/accounts/${account_id}/orders/${order_id}`).then(r => r.data)
}

export const getOrders = async(params = {}) => {
	console.log("Get Pending Orders")
	console.log("Params ", params);

	return await axios.get(`/v1/trading/accounts/${account_id}/orders`, {params}).then(r => r.data)	
}


export const getOrder = async(order_id) => {
	console.log("Get Orders: ", order_id)
	return await axios.get(`/v1/trading/accounts/${account_id}/orders/${order_id}`).then(r => r.data)	
}


