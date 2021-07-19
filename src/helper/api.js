import {apiUrl, apiKey, apiSecret} from '../config';
import axios from 'axios';
import { Base64 } from 'js-base64';

const authHeader = {headers: `Authorization: Basic ${Base64.encode(apiKey + ':' + apiSecret)}`};

export const getClock = async() => {
	return await axios.get('${apiUrl}/v1/clock', authHeader);
}; 