import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import countries from 'i18n-iso-countries';

import { getCurrentUser, setStorageData } from './store'

const ONBOARDING_KEY = "onboarding";

export const processOnboardingData = (user) => {
	var pd = {
		contact: {
			email_address: user?.email, // 'shivchawla2001@gmail.com', //
			phone_number: user?.phoneNumber, //'+50240428803', //
			street_address: (user?.contact?.addressLine1 + ' ' +  user?.contact?.addressLine2).trim(),
			city: user?.contact?.city,
			state: user?.contact?.state,
			postal_code: user?.contact?.postalCode,
			country: user?.contact?.country
		},
		identity: {
			given_name: (user?.identity?.firstName + '' + user?.identity?.middleName).trim(),
			family_name: user?.identity?.lastName,
			date_of_birth: new Date(user?.identity?.dateBirth), ///HAS A PROBLEM/// CHECK //new Date("1985-07-04"), //
			tax_id: user?.taxInfo?.taxId,
			tax_id_type: user?.taxInfo?.taxIdType,
			country_of_citizenship: countries.getAlpha3Code(user?.identity?.citizenCountry, "en"),
			country_of_birth: countries.getAlpha3Code(user?.identity?.birthCountry, "en"),
			country_of_tax_residence: countries.getAlpha3Code(user?.taxInfo?.taxCountry, "en"),
			funding_source: [user?.taxInfo?.fundSource]
		},
		disclosures: {
			is_control_person: user?.disclosure?.isControlPerson == "YES",
			is_affiliated_exchange_or_finra: user?.disclosure?.isAffiliated == "YES",
			is_politically_exposed: user?.disclosure?.isPolitical == "YES",
			immediate_family_exposed: user?.disclosure?.isFamilyExposed == "YES",
			employment_status: user?.employment?.employmentStatus,
			employer_name: user?.employment?.employerName,
			employer_address: Object.values(user?.employment?.employerAddress).join(', '),
			employment_position: user?.employment?.employmentPosition
		},
		agreements: [{
			agreement: "margin_agreement",
			signed_at: user?.margin_agreement?.signedAt,
			ip_address: user?.margin_agreement?.ipAddress,
		},
		{
			agreement: "account_agreement",
			signed_at: user?.account_agreement?.signedAt,
			ip_address: user?.account_agreement?.ipAddress,
		},
		{
			agreement: "customer_agreement",
			signed_at: user?.customer_agreement?.signedAt,
			ip_address: user?.customer_agreement?.ipAddress,
		}],
		trusted_contact: {
			given_name: user?.trustedContact?.firstName,
    		family_name: user?.trustedContact?.lastName,
    		email_address: user?.trustedContact?.email,
		}
	};

	const documents = [];
	const dsinContent = [];
	Object.keys(user.documents).forEach(docType => {
		var sides = ['front', 'back'];
		if (docType == 'document/government-id') {
			sides.forEach(side => {
				const sideContent = user.documents[docType][side];
				if (sideContent) {
					documents.push({
						document_type: 'identity_verification',
						document_sub_type: 'government-id-'+side,
						content: sideContent,
						mime_type: 'image/jpeg'
					})

					dsinContent.push({
						document_type: 'identity_verification',
						document_sub_type: 'government-id-'+side,
						mime_type: 'image/jpeg'
					})
				}
			})
		}
	})

	console.log("Documents Processing ")
	console.log(documents.map(item => console.log(Object.keys(item))));

	console.log(pd);
	console.log(dsinContent);

	pd['documents'] = documents;

	return pd;
}

const updateOnboardingData = async (key, obj) => {
	
	const currentUser = await getCurrentUser(); 
	const email = currentUser?.email;

	try {
		//Update in firestore
		await firestore().collection('Onboarding')
		.where('email','==', email)
		.limit(1)
		.get()
		.then(querySnapshot => { 
			if (querySnapshot.size < 1) {
				firestore().collection('Onboarding').add({email, [key]: obj})	
			} else {
	    		const doc = querySnapshot.docs[0];
	    		//doc.ref saves the day
		    	doc.ref.update({[key]: obj});
	    	}
		})
	} catch(err) {
		console.log(err);
	}
}
 
const getOnboardingData = async () => {

	const currentUser = await getCurrentUser(); 
	const email = currentUser?.email;

	try {
		//Update in firestore
		return firestore().collection('Onboarding')
		.where('email','==', email)
		.limit(1)
		.get()
		.then(querySnapshot => { 
			if (querySnapshot.size < 1) {
				return null;	
			}

	    	return querySnapshot.docs[0].data();
		})
	} catch (err) {
		console.log("Error fetching onboarding data");
		return null;
	}
}


export const useOnboarding = (params = {}) => {
	
	const [onboardingData, setData] = useState(null);

	const [isLoading, setLoading] = useState(true);

	const getDataDb = async() => {
		const obAPIdata = await getOnboardingData();
		if (obAPIdata) {
			await setStorageData(ONBOARDING_KEY, JSON.stringify(obAPIdata));
		}

		//backtop with empty object to start onboard (set loading false)
		setData(obAPIdata || {});
	}

	React.useEffect(() => {
		if (params?.enabled){
			getDataDb();
		}
	}, []);

	React.useEffect(() => {
		if (onboardingData) {
			setLoading(false);
		}
	}, [onboardingData])

	const updateOnboarding = async (key, obj) => {
		await setStorageData(ONBOARDING_KEY, JSON.stringify({...onboardingData, key: obj}), () => updateOnboardingData(key, obj))
	}

	const getOnboarding = async () => {
		const localOnboarding = await getStorageData(ONBOARDING_KEY);
		if (!!localOnboarding) {
			return localOnboarding;
		} else {
			getDataDb()
		}  
	}
	
	return { isLoading, onboardingData, getOnboarding, updateOnboarding };
}
