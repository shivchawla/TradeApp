import {apiUrl, apiKey, apiSecret, dataUrl} from '../config';
import axios from 'axios';
import { Base64 } from 'js-base64';
import {processBars, processSnapshot} from './processAlpaca'

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


