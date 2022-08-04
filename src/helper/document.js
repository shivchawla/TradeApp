import React, {useState, useEffect} from 'react';
import { useQuery} from 'react-query';
import { getDocuments, getDocument } from  './api'; 

import { currentISODate, toISODate, 
	yearStartISODate, dayStartISODate, 
	dayEndISODate} from '../utils';


export const useDocuments = ({start = yearStartISODate("YYYY-MM-DD"), end = currentISODate("YYYY-MM-DD"), type} = {}, params = {}) => {
	console.log("useDocuments");
	console.log({start, end, type})
	
	const queryKey = type ? ['useDocuments', start, end] : ['useDocuments', start, end, type]; 
	const {isLoading, isError, error, data: documents, refetch} = useQuery(queryKey, async() => getDocuments({start, end, type}), params)

	if (isError) {
		console.log("Error [useDocuments]: ", error);
	}

	return {documents, getDocuments: async() => refetch().then(r => r.data)}

}


export const useDownloadDocument = ({id, fileName}, params = {}) => {
	const {isLoading, error, isError, data: document, refetch} = useQuery(['downloadDocument', id], async() => getDocument(id, fileName), params)
	if (isError) {
		console.log("Error [useDownloadDocument]: ", error);
	}

	return {document, downloadDocument: async() => refetch().then(r => {console.log(r.data); return r.data})};
}

