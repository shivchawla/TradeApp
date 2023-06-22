import {apiUrl, apiKey, apiSecret, dataUrl, newsApiUrl} from '../config';
import axios from 'axios';
import { Base64 } from 'js-base64';
import {processBars, processSnapshot} from './process'
import { getAlpacaAccount } from './store';

import * as RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util'

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.common['Authorization'] = `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`;

//Get account ID from temporary storage (after successful login)
// const account_id = '9703c0b1-67bf-492d-aeff-95c108299188';

const getAccountId = async() => {
	return '9703c0b1-67bf-492d-aeff-95c108299188';	
	// const alpacaAccount = await getAlpacaAccount();
	// return alpacaAccount?.account?.id;
}

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
	// console.log(`/v1/trading/accounts/${await getAccountId()}/positions/${symbol}`);
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/positions/${symbol}`).then(r => r.data);	
}

export const getStockPortfolio = async () => {
	console.log("Fetching Current Stock Portfolio");
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/positions`).then(r => r.data);
}

export const getPortfolioHistory = async (params = {}) => {
	// console.log("Fetching Portfolio History");
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/account/portfolio/history`, {params}).then(r => r.data)
}

export const getTradingAccount = async () => {
	console.log("Fetching User Trading Account");
	// console.log(`/v1/trading/accounts/${await getAccountId()}/account`);
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/account`).then(r => r.data)
}

export const getAccountActivity = async ({activity_type = null, date = '', until = '', after = ''} = {}) => {
	console.log("Fetching Account Activity");
	const url = '/v1/accounts/activities' + (!!activity_type ? `/${activity_type}` : '');
	console.log(url);

	var params = {account_id: await getAccountId(), ...date!='' && {date}, ...until!='' && {until}, ...after!='' && {after}};
	console.log("Params");
	console.log(params);

	return await axios.get(url, {params}).then(r => r.data)
}

export const placeOrder = async(request) => {
	console.log("Placing Order");
	console.log(request);
	return await axios.post(`/v1/trading/accounts/${await getAccountId()}/orders`, request).then(r => r.data)
}

export const updateOrder = async(order_id, request) => {
	console.log("Updating Order");
	console.log(request);
	return await axios.patch(`/v1/trading/accounts/${await getAccountId()}/orders/${order_id}`, request).then(r => r.data)
}

export const cancelOrder = async(order_id) => {
	console.log("Canceling Order: ", order_id);
	return await axios.delete(`/v1/trading/accounts/${await getAccountId()}/orders/${order_id}`).then(r => r.data)
}

export const cancelAllOrders = async() => {
	console.log("Canceling All Order: ");
	return await axios.delete(`/v1/trading/accounts/${await getAccountId()}/orders`).then(r => r.data)
}


export const getOrders = async(params = {}) => {
	console.log("Get Pending Orders")
	console.log("Params ", params);
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/orders`, {params}).then(r => r.data)	
}


export const getOrder = async(order_id) => {
	console.log("Get Order: ", order_id)
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/orders/${order_id}`).then(r => r.data)	
}

export const createBrokerageAccount = async(accountParams) => {
	// console.log("Create Account");
	// console.log(accountParams);
	try {
		return await axios.post(`/v1/accounts`, accountParams).then(r => r.data)
	} catch(err) {
		console.log(err.response.data.message);
		// console.log(err.request);
		// console.log(err.message);
		throw(err);
	}	
} 


export const getBrokerageAccount = async() => {
	console.log("Get Brokerage Account");
	return await axios.get(`/v1/accounts/${await getAccountId()}`).then(r => r.data)	
} 

export const getAllWatchlist = async(populate = false) => {
	// console.log("Get All Watchlists");
	// console.log("Populate: ", populate);
	
	const allWatchlists = await axios.get(`/v1/trading/accounts/${await getAccountId()}/watchlists`).then(r => r.data)	
	if (!populate) {
		return allWatchlists
	} else {
		// console.log("Poulating All watchlists")
		return await Promise.all(allWatchlists.map(async (watchlist) => {
		    var wl = await getWatchlist(watchlist.id);
		    // console.log(wl);
		    return wl;
	  	}));
	}
}

export const getWatchlist = async(watchlist_id) => {
	console.log("Get Watchlist: ", watchlist_id);
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/watchlists/${watchlist_id}`).then(r => r.data)	
}


export const createWatchlist = async(watchlistParams) => {
	console.log("Creating Watchlist");
	console.log(watchlistParams);
	return await axios.post(`/v1/trading/accounts/${await getAccountId()}/watchlists`, watchlistParams).then(r => r.data)	
}


export const updateWatchlist = async(watchlist_id, watchlistParams) => {
	console.log("Updating Watchlist");
	console.log(watchlistParams);
	return await axios.put(`/v1/trading/accounts/${await getAccountId()}/watchlists/${watchlist_id}`, watchlistParams).then(r => r.data)	
}

export const addAssetToWatchlist = async(watchlist_id, symbol) => {
	console.log("Adding Asset to Watchlist: ", watchlist_id);
	console.log("Symbol: ", symbol);
	return await axios.post(`/v1/trading/accounts/${await getAccountId()}/watchlists/${watchlist_id}`, symbol).then(r => r.data)	
}

export const removeAssetToWatchlist = async(watchlist_id, symbol) => {
	console.log("Adding Asset to Watchlist: ", watchlist_id);
	console.log("Symbol: ", symbol);
	return await axios.delete(`/v1/trading/accounts/${await getAccountId()}/watchlists/${watchlist_id}/${symbol}`).then(r => r.data)	
}

export const deleteWatchlist = async(watchlist_id) => {
	console.log("Deleting Watchlist: ", watchlist_id);
	return await axios.delete(`/v1/trading/accounts/${await getAccountId()}/watchlists/${watchlist_id}`).then(r => r.data)	
}

export const getSeekingAlphaNews = async (symbol) => {
	// console.log("Getting News from Seeking Alpha");
	// console.log(symbol);
	// console.log("News URL");
	// console.log(`${newsApiUrl}/${symbol}/news`)
	return await axios.get(`${newsApiUrl}/${symbol}/news`).then(r => r.data);
}

export const getDocuments = async ({start, end, type} = {}) => {
		
	console.log("Get Documents - API");	
	const params = {...start && {start}, ...end && {end}, ...type && {type}};
	console.log(params);

	return await axios.get(`/v1/accounts/${await getAccountId()}/documents`, {params}).then(r => r.data);
}

// export const getDocument = async (document_id) => {
// 	console.log("Get Document: ", document_id);	
// 	return await axios.get(`/v1/accounts/${await getAccountId()}/documents/${document_id}/download`, {responseType: 'blob'}).then(r => r.data);
// }


export const getDocument = async (document_id, fileName) => {
	ReactNativeBlobUtil
	.config({
  		// response data will be saved to this path if it has access right.
  		path : fileName
	})
	.fetch('GET', `${apiUrl}/v1/accounts/${await getAccountId()}/documents/${document_id}/download`, {
		'Authorization': `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`
	})
	.then(res => {
    	// the temp file path with file extension `png`
    	console.log('The file saved to ', res.path())
	})
}


// export const getDocument = async (document_id, fileName) => {
// 	console.log("Get Document: ", document_id);	
// 	// return await (`/v1/accounts/${await getAccountId()}/documents/${document_id}/download`).then(r => r.data);
// 	// common['Authorization'] = `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`;

// 	return await RNFS.downloadFile({
// 		fromUrl: `${apiUrl}/v1/accounts/${await getAccountId()}/documents/${document_id}/download`, 
// 		toFile: fileName,
// 		headers: {'Authorization': `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`}
// 	}).promise
// }

export const getTradeConfig = async() => {
	console.log("Get Trade Configuration")
	return await axios.get(`/v1/trading/accounts/${await getAccountId()}/account/configurations`).then(r => r.data);
}


export const updateTradeConfig = async(params) => {
	console.log("Updating Trade Configuration")
	console.log(params);
	return await axios.patch(`/v1/trading/accounts/${await getAccountId()}/account/configurations`, params).then(r => r.data);
}

