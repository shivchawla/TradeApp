import React, {useState} from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {encode} from 'base64-arraybuffer';

const API_URL = 'https://withpersona.com/api/v1';
const API_KEY = 'persona_sandbox_d83b5bc0-a673-4620-9b28-675cc7a2b291';
const authHeader = {'Authorization': `Bearer ${API_KEY}`};

const fetchInquiries = async(refId) => {
	const url = `${API_URL}/inquiries/?filter[reference-id]=${refId}`;
	return await axios.get(url, {headers: authHeader}).then(r => r.data);
}

const fetchInquiry = async(inqId) => {
	const url = `${API_URL}/inquiries/${inqId}`;
	const inquiry = await axios.get(url, {headers: authHeader}).then(r => r.data);
	
	console.log("Inquiry Fetched");
	console.log(Object.keys(inquiry));
	console.log("Fetch Inquiry Status: ", inquiry?.data?.attributes?.status);

	if (inquiry?.data?.attributes?.status == "completed") {

		console.log("Now Get Documents");

		//Now get documents;
		const documents = (inquiry?.data?.relationships?.documents?.data ?? [])
		
		// console.log("Document Ids");
		// console.log(documentIds);

		const files = {};

		await Promise.all(
			documents.map(async(doc) => {
				
				const docId = doc?.id;
				console.log("Document Type: ", doc?.type);

				files[doc?.type] = {front: null, back: null}

				const document = await fetchDocument(docId);
				const fileFront = document?.data?.attributes?.['front-photo'];
				const fileFrontName = fileFront?.filename;
				const fileFrontUrl = fileFront?.url;
				const fileFrontId = fileFrontUrl.split("files/")?.[1]?.split("/persona_camera")?.[0];

				if (fileFrontId && fileFrontName) {
					files[doc?.type]['front'] = await fetchFile(fileFrontId, fileFrontName);
				} 

				const fileBack = document?.data?.attributes?.['back-photo']
				const fileBackName = fileBack?.filename;
				const fileBackUrl = fileBack?.url;
				const fileBackId = fileBackUrl.split("files/")?.[1]?.split("/persona_camera")?.[0];

				if (fileFrontId && fileFrontName) {
					files[doc?.type]['back'] = await fetchFile(fileBackId, fileBackName);
				}

			})
		)

		return {...inquiry, files};
	}

	return inquiry 

}

const fetchFile = async(fileId, fileName) => {
	// console.log("Fetching File");
	// console.log(fileId);
	// console.log(fileName);

	const url = `${API_URL}/files/${fileId}/${fileName}`;
	return await axios.get(url, {headers: authHeader, responseType: 'arraybuffer'})
	.then(r => encode(r.data))
}

const fetchDocument = async(docId) => {
	const url = `${API_URL}/documents/${docId}`;
	return await axios.get(url, {headers: authHeader}).then(r => r.data);
}

const fetchSession = async(inquiryId) => {
	console.log("Fetching Session: ", inquiryId);
	const url = `${API_URL}/inquiries/${inquiryId}/resume`;
	console.log("URL: ", url);

	return await axios.post(url, {}, {headers: authHeader}).then(r => r.data);	
}

export const usePersonaInquiries = (refId, params={}) => {
	const {isLoading, data: inquiries, refetch} = useQuery(['fetchInquiries', refId], () => fetchInquiries(refId), params);
	const getInquiries = () => refetch().then(r => r.data);

	return {isLoading, inquiries, getInquiries};
}

export const usePersonaInquiry = (inqId, params={}) => {
	const {isLoading, data: inquiry, refetch} = useQuery(['fetchInquiry', inqId], () => fetchInquiry(inqId), params);
	const getInquiry = () => refetch().then(r => r.data);

	return {isLoading, inquiry, getInquiry};
}

export const usePersonaDocument = (docId, params={}) => {
	const {isLoading, data: document, refetch} = useQuery(['fetchDocument', docId], () => fetchDocument(docId), params);
	const getDocument = () => refetch().then(r => r.data);

	return {isLoading, document, getDocument};
}

export const usePersonaSession = (inquiryId, params={}) => {
	const {isLoading, data: session, refetch} = useQuery(['fetchSession', inquiryId], () => fetchSession(inquiryId), params);
	const getSession = () => refetch().then(r => r.data);

	return {isLoading, session, getSession};
}

