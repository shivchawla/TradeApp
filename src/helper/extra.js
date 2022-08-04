import React, {useState} from 'react';

export const useLoading = (loading) => {
	const [isLoading, setLoading] = useState(loading);

	const loadingFunc = async(func, {keep = false} = {}) => {
		setLoading(true);

		try{
			// console.log("Calling Function");
			const value = await func();
			// console.log("Ending Function Call: ", keep);
			if (!keep) {
				setLoading(false);
			}
			return value;

		} catch(err) {
			setLoading(false);
			// console.log("Caught Error");
			// console.log(err);
			throw(err);
		}
	}

	const updateLoading = (loading) => {
		setLoading(loading);
	}

	return {isLoading, updateLoading, loadingFunc};
}