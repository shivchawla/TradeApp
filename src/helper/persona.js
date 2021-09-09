import React, {useState} from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const API_URL = 'https://withpersona.com/api/v1';
const API_KEY = 'persona_sandbox_d83b5bc0-a673-4620-9b28-675cc7a2b291';
const authHeader = {'Authorization': `Bearer ${API_KEY}`};

const fetchInquiries = async(refId) => {
	const url = `${API_URL}/inquiries/?filter[reference-id]=${refId}`;
	return await axios.get(url, {headers: authHeader}).then(r => r.data);
}

const fetchSession = async(inquiryId) => {
	console.log("Fetching Session: ", inquiryId);
	const url = `${API_URL}/inquiries/${inquiryId}/resume`;
	console.log("URL: ", url);

	return await axios.post(url, {}, {headers: authHeader}).then(r => r.data);	
}

export const usePersonaInquiry = (refId, params={}) => {
	const {isLoading, data: inquiries, refetch} = useQuery(['fetchInquiries', refId], () => fetchInquiries(refId), params);
	const getInquiries = () => refetch().then(r => r.data);

	return {isLoading, inquiries, getInquiries};
}


export const usePersonaSession = (inquiryId, params={}) => {
	const {isLoading, data: session, refetch} = useQuery(['fetchSession', inquiryId], () => fetchSession(inquiryId), params);
	const getSession = () => refetch().then(r => r.data);

	return {isLoading, session, getSession};
}
