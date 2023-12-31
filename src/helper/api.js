import {apiUrl, apiKey, apiSecret, dataUrl, newsApiUrl} from '../config';
import axios from 'axios';
import { Base64 } from 'js-base64';
import {processBars, processSnapshot} from './process'

import * as RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util'


//Get account ID from temporary storage (after successful login)
const account_id = '9703c0b1-67bf-492d-aeff-95c108299188';

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.common['Authorization'] = `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`;

export const getClock = async() => {
	return await axios.get('/v1/clock').then(r => r.data);
} 

export const getCalendar = async(query) => {
	return await axios.get('/v1/calendar',{params: query}).then(r => r.data);
} 

export const getStocks = async() => {
	console.log("Fetching Stocks");
	return await axios.get('/v1/assets', {params: {status: 'active'}}).then(r => r.data);
}

export const getAssetData = async (symbol) => {
	// console.log("Fetching Asset Data");
	return await axios.get(`/v1/assets/${symbol}`).then(r => r.data);	
}

export const getSnapshot = async(symbol) => {
	// console.log("Fetching Snapshot");
	// console.log(axios.defaults.headers.common['Authorization']);
	// console.log(`${dataUrl}/v2/stocks/${symbol}/snapshot`);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/snapshot`).then(r => processSnapshot(r.data));
}

export const getHistoricalData = async(symbol, params = {}) => {
	console.log("Fetching Daily Historical");
	console.log(`${dataUrl}/v2/stocks/${symbol}/bars`);
	console.log(params);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/bars`, {params}).then(r => processBars(r.data));
}

export const getStockPosition = async(symbol) => {
	// console.log("Fetching Current Stock Position");
	// console.log(`/v1/trading/accounts/${account_id}/positions/${symbol}`);
	return await axios.get(`/v1/trading/accounts/${account_id}/positions/${symbol}`).then(r => r.data);	
}

export const getStockPortfolio = async () => {
	console.log("Fetching Current Stock Portfolio");
	return await axios.get(`/v1/trading/accounts/${account_id}/positions`).then(r => r.data);
}

export const getPortfolioHistory = async (params = {}) => {
	// console.log("Fetching Portfolio History");
	return await axios.get(`/v1/trading/accounts/${account_id}/account/portfolio/history`, {params}).then(r => r.data)
}

export const getTradingAccount = async () => {
	console.log("Fetching User Trading Account");
	console.log(`/v1/trading/accounts/${account_id}/account`);
	return await axios.get(`/v1/trading/accounts/${account_id}/account`).then(r => r.data)
}

export const getAccountActivity = async ({activity_type = null, date = '', until = '', after = ''} = {}) => {
	console.log("Fetching Account Activity");
	const url = '/v1/accounts/activities' + (!!activity_type ? `/${activity_type}` : '');
	console.log(url);

	var params = {account_id, ...date!='' && {date}, ...until!='' && {until}, ...after!='' && {after}};
	console.log("Params");
	console.log(params);

	return await axios.get(url, {params}).then(r => r.data)
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

export const cancelAllOrders = async() => {
	console.log("Canceling All Order: ");
	return await axios.delete(`/v1/trading/accounts/${account_id}/orders`).then(r => r.data)
}


export const getOrders = async(params = {}) => {
	console.log("Get Pending Orders")
	console.log("Params ", params);
	return await axios.get(`/v1/trading/accounts/${account_id}/orders`, {params}).then(r => r.data)	
}


export const getOrder = async(order_id) => {
	console.log("Get Order: ", order_id)
	return await axios.get(`/v1/trading/accounts/${account_id}/orders/${order_id}`).then(r => r.data)	
}

export const createBrokerageAccount = async(accountParams) => {
	console.log("Create Account");
	console.log(accountParams);

	return await axios.post(`/v1/accounts`, accountParams).then(r => r.data)	
} 


export const getBrokerageAccount = async(account_id) => {
	console.log("Get Brokerage Account");
	return await axios.get(`/v1/accounts/${account_id}`).then(r => r.data)	
} 

export const getAllWatchlist = async() => {
	console.log("Get All Watchlists");
	return await axios.get(`/v1/trading/accounts/${account_id}/watchlists`).then(r => r.data)	
}

export const getWatchlist = async(watchlist_id) => {
	console.log("Get Watchlist: ", watchlist_id);
	return await axios.get(`/v1/trading/accounts/${account_id}/watchlists/${watchlist_id}`).then(r => r.data)	
}


export const createWatchlist = async(watchlistParams) => {
	console.log("Creating Watchlist");
	console.log(watchlistParams);
	return await axios.post(`/v1/trading/accounts/${account_id}/watchlists`, watchlistParams).then(r => r.data)	
}


export const updateWatchlist = async(watchlist_id, watchlistParams) => {
	console.log("Updating Watchlist");
	console.log(watchlistParams);
	return await axios.put(`/v1/trading/accounts/${account_id}/watchlists/${watchlist_id}`, watchlistParams).then(r => r.data)	
}

export const addAssetToWatchlist = async(watchlist_id, symbol) => {
	console.log("Adding Asset to Watchlist: ", watchlist_id);
	console.log("Symbol: ", symbol);
	return await axios.post(`/v1/trading/accounts/${account_id}/watchlists/${watchlist_id}`, symbol).then(r => r.data)	
}

export const removeAssetToWatchlist = async(watchlist_id, symbol) => {
	console.log("Adding Asset to Watchlist: ", watchlist_id);
	console.log("Symbol: ", symbol);
	return await axios.delete(`/v1/trading/accounts/${account_id}/watchlists/${watchlist_id}/${symbol}`).then(r => r.data)	
}

export const deleteWatchlist = async(watchlist_id) => {
	console.log("Deleting Watchlist: ", watchlist_id);
	return await axios.delete(`/v1/trading/accounts/${account_id}/watchlists/${watchlist_id}`).then(r => r.data)	
}

export const getSeekingAlphaNews = async (symbol) => {
	console.log("Getting News from Seeking Alpha");
	console.log(symbol);
	console.log("News URL");
	console.log(`${newsApiUrl}/${symbol}/news`)
	return await axios.get(`${newsApiUrl}/${symbol}/news`).then(r => r.data);
}

export const getDocuments = async ({start, end, type} = {}) => {
		
	console.log("Get Documents - API");	
	const params = {...start && {start}, ...end && {end}, ...type && {type}};
	console.log(params);

	return await axios.get(`/v1/accounts/${account_id}/documents`, {params}).then(r => r.data);
}

// export const getDocument = async (document_id) => {
// 	console.log("Get Document: ", document_id);	
// 	return await axios.get(`/v1/accounts/${account_id}/documents/${document_id}/download`, {responseType: 'blob'}).then(r => r.data);
// }


export const getDocument = async (document_id, fileName) => {
	ReactNativeBlobUtil
	.config({
  		// response data will be saved to this path if it has access right.
  		path : fileName
	})
	.fetch('GET', `${apiUrl}/v1/accounts/${account_id}/documents/${document_id}/download`, {
		'Authorization': `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`
	})
	.then(res => {
    	// the temp file path with file extension `png`
    	console.log('The file saved to ', res.path())
	})
}


// export const getDocument = async (document_id, fileName) => {
// 	console.log("Get Document: ", document_id);	
// 	// return await (`/v1/accounts/${account_id}/documents/${document_id}/download`).then(r => r.data);
// 	// common['Authorization'] = `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`;

// 	return await RNFS.downloadFile({
// 		fromUrl: `${apiUrl}/v1/accounts/${account_id}/documents/${document_id}/download`, 
// 		toFile: fileName,
// 		headers: {'Authorization': `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`}
// 	}).promise
// }

export const getTradeConfig = async() => {
	console.log("Get Trade Configuration")
	return await axios.get(`/v1/trading/accounts/${account_id}/account/configurations`).then(r => r.data);
}


export const updateTradeConfig = async(params) => {
	console.log("Updating Trade Configuration")
	console.log(params);
	return await axios.patch(`/v1/trading/accounts/${account_id}/account/configurations`, params).then(r => r.data);
}

