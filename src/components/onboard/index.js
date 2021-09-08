import React from 'react';

import { ContactForm } from './contact';
import { IdentityForm } from './identity';
import { TaxInfoForm } from './taxInfo';
import { TrustedContactForm } from './trustedContact';
import { DisclosureForm } from './disclosure';
import { EmploymentForm } from './employment';
import { Agreement } from './agreement';

export const AnyForm = React.forwardRef(({type, initialData, agreements, onSubmit}, ref) => {

	const isAgreement = ["customer_agreement", "account_agreement", "margin_agreement"].includes(type);
	
	return (
		<>
		{type == "identity" && <IdentityForm ref={ref} initialValues={initialData?.[type] || {}} onSubmit={onSubmit}/>}	
		{type == "contact" && <ContactForm ref={ref} initialValues={initialData?.[type] || {}} onSubmit={onSubmit}/>	}
		{type == "taxInfo" && <TaxInfoForm ref={ref} initialValues={initialData?.[type] || {}} onSubmit={onSubmit}/>	}
		{type == "disclosure" && <DisclosureForm ref={ref} initialValues={initialData?.[type] || {}} onSubmit={onSubmit}/>}	
		{type == "employment" && <EmploymentForm ref={ref} initialValues={initialData?.[type] || {}} onSubmit={onSubmit}/>}	
		{type == "trustedContact" && <TrustedContactForm ref={ref} initialValues={initialData?.[type] || {}} onSubmit={onSubmit}/>}	
		{isAgreement && <Agreement uri={agreements[type]} ref={ref} onAgree={onSubmit}/>}	
		</>
	)
})