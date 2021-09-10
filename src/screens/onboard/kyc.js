import React, {useState, useCallback} from 'react';
import { View, TouchableOpacity, StyleSheet} from 'react-native';

import { AppView, ConfirmButton } from '../../components/common';
import { useTheme, HP, WP, StyledText } from '../../theme';

import { usePersonaSession, usePersonaInquiry, 
	useOnboarding, useCreateBrokerageAccount, 
	processOnboardingData } from '../../helper';

import Inquiry, {Fields, Environment} from 'react-native-persona';

const KycButton = ({templateId = "tmpl_6Uj4QPGVn4hx7nQ9pNKwr65t", inquiry, session, user, onSuccess}) => {
  
  	const handleSuccess = useCallback((inquiryId, attributes) => {
	 	console.log("Inquiry #{inquiryId} succeeded with attributes #{attributes}");
	 	onSuccess(attributes);
  	}, []);

	const handleCancelled = useCallback(() => {
		console.log("Inquiry was cancelled")
	}, []);

	const handleFailed = useCallback(inquiryId => {
		console.log("Inquiry #{inquiryId} failed.")
	}, []);

	const handleError = useCallback(error => {
		console.error(error);
	}, []);

	const handleBeginInquiry = useCallback(async() => {

		const inquiryId = inquiry?.id;

		if (inquiryId && session) {
			console.log("Inquiry from inquiryID: ", inquiryId);
			Inquiry.fromInquiry(inquiryId)
			.accessToken(session)
			.onSuccess(handleSuccess)
			.onCancelled(handleCancelled)
			.onFailed(handleFailed)
			.onError(handleError)
			.build()
			.start();
		} else {
			console.log("Inquiry from template ID: ", templateId);
			Inquiry.fromTemplate(templateId).referenceId(user.email)
			.environment(Environment.SANDBOX)
			.fields(
		  		Fields.builder()
				.name({
					'first': user?.identity?.firstName ?? '',
					'middle': user?.idetity?.middleName ?? '',
					'last': user?.identity?.lastName ?? ''})
				.birthdate(new Date("1985-07-04")) //user?.identity?.birthDate
				.address({
					'street1': user?.contact?.addressLine1 ?? '',
					'street2': user?.contact?.addressLine2 ?? '',
					'city': user?.contact?.city ?? '',
					'subdivision': user?.contact?.state ?? '',
					'postalCode': user?.contact?.postalCode ?? '',
					'country': user?.contact?.country ?? ''})
				.build()
			)
			.onSuccess(handleSuccess)
			.onCancelled(handleCancelled)
			.onFailed(handleFailed)
			.onError(handleError)
			.build()
			.start();
		}
	
	}, [])

	return (
		<ConfirmButton onClick={handleBeginInquiry} title="START KYC" />
	)
}

const StartKyc = (props) => {

	const {user} = props.route.params;
	const {navigation} = props;

	const [inquiry, setInquiry] = useState(null);
	const [session, setSession] = useState(null);

	//Get pending inquiry from Persona for user email 
	//If none pending start a new one,
	const {inquiries, getInquiries} = usePersonaInquiry(user.email);
	const {getSession} = usePersonaSession(inquiry?.id, {enabled: false});

	const {updateOnboarding} = useOnboarding({enabled: false});
  	const {createBrokerageAccount} = useCreateBrokerageAccount();

	React.useEffect(() => {
		const getActiveInquiry = () => {
			// console.log("Inquiries");
		  	// console.log(inquiries);

		  	if (inquiries?.data && inquiries?.data?.length > 0) {
				// console.log("Num Inquiries: ", inquiries?.data?.length);

				let foundInquiry = {};
			  	inquiries.data.every((inquiry, index) => {
					const status = inquiry?.attributes?.status;
					// console.log("Inquiry");
					// console.log(inquiry);
					if (status != 'expired') {
						foundInquiry = inquiry;
						return false;
				  	}

				 	return true
			  	})

			  	setInquiry(foundInquiry);
		  	}
		}

		getActiveInquiry();

  	}, [inquiries])


  	React.useEffect(() => {
	  	if (inquiry && inquiry != {}) {
			// console.log("Finding Session");
			// console.log(inquiry);

			getSession().then(s => {
			  // console.log("Session"); console.log(s); 
				setSession(s?.meta?.['session-token']);
			})
	  	} else {
			setSession({});
		}

	}, [inquiry])

  	const onSuccess = async(kycAttributes) => {
  		await updateOnboarding('kyc', {
	   		...user?.kyc ?? {}, 
   			inquiryId, 
	   		status: 'completed', 
	   		updatedAt: new Date(), 
	   		...kycAttributes
	 	});

	 	//Now create the brokerage account
	 	createBrokerageAccount(processAccountParams(user), {
	 		onSuccess: (res, input) => console.log(res),
	 		onError: (err, input) => console.log(err)
	 	});
  	}

	//Pass referenceId
  	//Pass InquiryId
  	//Save templateId in CONFIG
  	const isLoading = !inquiry || !session;

	return (
		<AppView isLoading={isLoading} title="Start KYC" goBack={false} >
			<KycButton {...{inquiry, session, user}} onSuccess={onSuccess} />
		</AppView>
	)	
}

export default StartKyc;
