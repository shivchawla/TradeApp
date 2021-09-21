import React from 'react';
import * as Yup from 'yup';
import {CountrySchema} from '../../components/form'

export const IdentityMeta = {
	firstName: {title: 'First Name', type: 'text'},
	middleName:  {title: 'Middle Name', type: 'text'},
	lastName: {title: 'Last Name', type: 'text'},
	dateBirth: {title: 'Date of Birth', type: 'date'},
	birthCountry: {title: 'Country of Birth', type: 'country'},
	citizenCountry: {title: 'Country of Citizenshio', type: 'country'},
}

export const IdentitySchema = Yup.object().shape({
   firstName: Yup.string().required('First Name is required'),
   middleName: Yup.string(),
   lastName: Yup.string().required('Last Name is required'),
   dateBirth: Yup.string().required('Date of Birth '),
   birthCountry: CountrySchema,
   citizenCountry: CountrySchema
});


export const TaxInfoMeta = {
	idType: {title: 'Identification Type', type: 'text'},
	idNumber: {title: 'Identification Number', type: 'text'},
	idCountry: {title: 'Identification Country', type: 'text'},
	taxId: {title: 'Tax Id', type: 'text'},
	taxCountry: {title: 'Tax Country', type: 'text'},
	fundSource: {title: 'Fund Sources', type: 'text'},
}

export const TaxInfoSchema = Yup.object().shape({
	idType: Yup.string().required('Identification type is required'),
	idNumber: Yup.string().required('Identification number is required'),
	idCountry: CountrySchema,
			
	taxId: Yup.string().required('Tax ID is required'),
	taxCountry: CountrySchema,

	fundSource: Yup.string().required('Funding Source required')
});


export const ContactMeta = {
	addressLine1: {title: 'Address Line 1', type: 'text'},
	addressLine2: {title: 'Address Line 2', type: 'text'},
	city: {title: 'City', type: 'text'},
	state: {title: 'State', type: 'text'},
	postalCode: {title: 'Postal Code', type: 'text'},
	country: {title: 'Country', type: 'country'},
}

export const ContactSchema = Yup.object().shape({
	addressLine1: Yup.string().required('Address is required'),
	addressLine2: Yup.string(),
	city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	postalCode: Yup.string().required('Postal Code is required'),
	country: ContactSchema
});

export const DisclosureMeta = {
	isControlPerson: {title:'Are you a control person?', type: 'boolean'},
	isAffiliated: {title: 'Are you affiliated with FINRA?', type: 'boolean'},
	isPolitical: {title: 'Are you a politically exposed person', type: 'boolean'},
	isFamilyExposed: {title: 'Is anyone in your immediate family polically exposed?', type: 'boolean'}
}

export const DisclosureSchema = Yup.object().shape({
	isControlPerson: Yup.string().oneOf(["YES", "NO"]),
	isAffiliated: Yup.string().oneOf(["YES", "NO"]),
	isPolitical: Yup.string().oneOf(["YES", "NO"]),
	isFamilyExposed: Yup.string().oneOf(["YES", "NO"])
});

export const EmploymentMeta = {
	employmentStatus: {title: 'Employment ', type: 'text'},
	employerName: {title: 'Employer Name', type: 'text'},
	employmentPosition: {title: 'Employment Position', type: 'text'},

	employerAddress: {
		addressLine1: {title: 'Address Line 1', type: 'text'},
		city: {title: 'City', type: 'text'},
		state: {title: 'State', type: 'text'},
		postalCode: {title: 'Postal Code', type: 'text'},
		country: {title: 'Country', type: 'country'}
	}
}

export const EmploymentSchema = Yup.object().shape({
	employmentStatus: Yup.string().required('Employment Status is required'),
	employerName: Yup.string().required("Employer Name is requied"),
	employmentPosition: Yup.string().required("Employment Position is required"),

	employerAddress: Yup.object().shape({
		addressLine1: Yup.string().required('Address is required'),
		city: Yup.string().required('City is required'),
		state: Yup.string().required('State is required'),
		postalCode: Yup.string().required('Postal Code is required'),
		country: CountrySchema
	})
});

export const TrustedMeta = {
	firstName: {title: 'First Name', type: 'text'},
	lastName: {title: 'Last Name', type: 'text'},
	email: {title: 'Email', type: 'text'},
}


export const TrustedContactSchema = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last Name is required'),
	email: Yup.string().email().required('Email address is required')
});

export const EMPLOYMENT_POSITIONS = [
	{key:'unemployed', title: 'Unemployment' },
	{key:'employed', title: 'Employed' },
	{key:'student', title: 'Student' },
	{key:'retired', title: 'Retired' },
];

export const FUND_SOURCES = [
	{key: 'employment_income', title: 'Employment Income'},
	{key: 'investments', title: 'Investments'},
	{key: 'inheritance', title: 'Inheritance'},
	{key: 'business_income', title: 'Business Income'},
	{key: 'savings', title: 'Savings'},
	{key: 'family', title: 'Family'},
];

export const FormMeta = {
	'identity': {title: 'Identity', subTitle: "Share your basic idenity", meta: IdentityMeta},
	'taxInfo': {title: 'Tax Info', subTitle: "Share your basic tax details", meta: TaxInfoMeta },
	'contact': {title: 'Contact', subTitle: "Share your contact information", meta: ContactMeta  },
	'disclosure': {title: 'Disclosure', subTitle: "Some important disclosures", meta: DisclosureMeta},
	'employment': {title: 'Employment', subTitle:  "What's your employment status?", meta: EmploymentMeta},
	'trustedContact': {title: 'Trusted Contact', subTitle: "Share one emergency/trusted contact", meta: TrustedMeta},
	'customer_agreement': {title: 'Customer Agreement', subTitle: ""},
	'account_agreement': {title: 'Account Agreement', subTitle: ""},
	'margin_agreement': {title: 'Margin Agreement', subTitle: ""}
}; 


