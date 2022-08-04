import React from 'react';
import { FormTextField, FormCountryField, FormDateField, FormBooleanField } from './';

export const FormField = ({field, type, placeholder, handler}) => {
	console.log("FormField: ", type);
	return (
		<>
			{type == "text" && <FormTextField {...{field, placeholder, handler}} />}
			{type == "boolean" && <FormCountryField {...{field, placeholder, handler}} />}
			{type == "date" && <FormDateField {...{field, placeholder, handler}} />}
			{type == "country" && <FormCountryField {...{field, placeholder, handler}} />}
		</>
	)
}


