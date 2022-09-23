import React, {useState} from 'react';

export const useLoading = (loading) => {
	const [isLoading, setLoading] = useState(loading);

	const loadingFunc = React.useCallback(async(func, {keep = false} = {}) => {
		setLoading(true);
		// console.log("Calling Function - out");
		// console.log(func)

		try{
			// console.log("Calling Function");
			const value = await func();
			// console.log("Ending Function Call: ", keep);
			if (!keep) {
				// console.log("Updating Loading to FALSE");
				setLoading(false);
			}
			
			return value;

		} catch(err) {
			// console.log("Updating Loading to FALSE");
			setLoading(false);
			// console.log("Caught Error");
			// console.log(err);
			throw(err);
		}
	}, [])

	const updateLoading = React.useCallback((loading) => {
		setLoading(loading);
	}, [])

	return {isLoading, updateLoading, loadingFunc};
}