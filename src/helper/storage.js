import React from 'react';

import {useAuth} from './user';
import {useLoading} from './extra';
import {uploadDocumentInStorage} from './firebase';

export const useStorage = () => {
	
	const {isLoading, loadingFunc} = useLoading();
	const {currentUser} = useAuth();

	const uploadDocument = async (document, {folder='temp'} = {}) => await loadingFunc(
		async() => {
			const path = `/documents/${folder}/${currentUser?.email}/${document.name}`;				
			return await uploadDocumentInStorage(document, path);
		}
	)

	return {isLoading, uploadDocument}
}