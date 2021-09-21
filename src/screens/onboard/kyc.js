import React, {useState, useCallback} from 'react';
import { View, TouchableOpacity, StyleSheet} from 'react-native';

import { AppView, ConfirmButton, AppIcon, TinyTextButton } from '../../components/common';
import { useTheme, HP, WP, StyledText } from '../../theme';

import { usePersonaSession, usePersonaInquiry, usePersonaInquiries,  
	useOnboarding, useCreateBrokerageAccount, 
	processOnboardingData, useAuth } from '../../helper';

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
				.birthdate(new Date(user?.identity?.birthDate))
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

	const {theme, styles} = useStyles();

	return (
		<ConfirmButton 
			onClick={handleBeginInquiry} 
			title="PROCEED TO KYC" 
			buttonStyle={styles.kycButton}
		/>
	)
}

const StartKyc = (props) => {

	const {user} = props.route.params;
	const {navigation} = props;

	const [inquiry, setInquiry] = useState(null);
	const [session, setSession] = useState(null);
	
	//Get pending inquiry from Persona for user email 
	//If none pending start a new one,
	const {inquiries, getInquiries} = usePersonaInquiries(user.email);
	const {getSession} = usePersonaSession(inquiry?.id, {enabled: false});
	const {getInquiry} = usePersonaInquiry(inquiry?.id, {enabled: false});
	
	const {updateOnboarding} = useOnboarding({enabled: false});
  	const {createBrokerageAccount} = useCreateBrokerageAccount();

  	const {updateUserAccount, signOut} = useAuth();

	React.useEffect(() => {

		console.log("[INQUIRIES] Start KYC Use Effect");

		(async() => {
			// console.log("Inquiries");
		  	// console.log(inquiries);

		  	if (inquiries?.data && inquiries?.data?.length > 0) {
				// console.log("Num Inquiries: ", inquiries?.data?.length);

				let foundInquiry = {};
			  	inquiries.data.every((inquiry, index) => {
					const status = inquiry?.attributes?.status;
					console.log("Inquiry Status: ", status);
					// console.log(inquiry);
					if (status != 'pending' || status != 'created') {
						foundInquiry = inquiry;
						return false;
				  	}

				 	return true
			  	})

			  	setInquiry(foundInquiry);
		  	} else {
		  		setInquiry({});
		  	}
		})()

  	}, [inquiries])


  	React.useEffect(() => {
  		console.log("[INQUIRY] Start KYC Use Effect");
  		console.log(inquiry);
  		console.log(inquiry && inquiry != {});

  		const status = inquiry?.attributes?.status;
	  	if (inquiry && inquiry != {} && status == 'pending') {
			console.log("Finding Session");
			// console.log(inquiry);

			getSession().then(s => {
			  // console.log("Session"); console.log(s); 
				setSession(s?.meta?.['session-token']);
			})
	  	} else if (inquiry && inquiry != {} && status == 'completed') {
	  		//Generally it should come here but do it anyways
	  		console.log("Creating Account")
	  		createAccount();
	  	} else {
			setSession({});
		}

	}, [inquiry])

	const createAccount = async() => {
		//Now create the brokerage account
		const inquiry = await getInquiry();
		// console.log("Files");
		// console.log(inquiry?.files);

		const pd = processOnboardingData({...user, documents: inquiry?.files});
		// console.log("Processed Data");
		// console.log(Object.keys(pd));

		
		// console.log(pd.documents.map(it => {console.log(Object.keys(it));}));
		// pd.documents.map(doc => {
		// 	Object.keys(doc).forEach(it => {
		// 		if( it == 'content') {
		// 			console.log(it + ": " + doc[it].slice(0, 5))
		// 		} else {
		// 			console.log(it + ": " + doc[it])
		// 		}
		// 	})
		// });

		// console.log(pd.documents.length);
		// console.log(pd.contact);
		// console.log(pd.identity);
		// console.log(pd.disclosures);
		// console.log(pd.agreements);
		// console.log(pd.trusted_contact);

	 	createBrokerageAccount(pd, {
	 		onSuccess: (res, input) => {
	 			updateUserAccount(res);	
	 		},
	 		onError: (err, input) => console.log(err)
	 	});
	}

  	const onSuccess = async(kycAttributes) => {
 		//Fetch the inquiry again to update verification Documents
	 
  		await updateOnboarding('kyc', {
	   		...user?.kyc ?? {}, 
   			inquiryId, 
	   		status: 'completed', 
	   		updatedAt: new Date(), 
	   		...kycAttributes
	 	});
	 	
  		createAccount();
  	}

	//Pass referenceId
  	//Pass InquiryId
  	//Save templateId in CONFIG
  	const isLoading = !inquiry || !session;

  	// console.log("IsLoading: ", isLoading);
  	// console.log("Inquiry");
  	// console.log(inquiry);
	
  	// console.log("Session");
  	// console.log(session);

  	const {theme, styles} = useStyles();

	return (
		<AppView isLoading={isLoading} goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle}>
			<AppIcon logoStyle={{height: 70}} logoContainerStyle={{marginTop: HP(5)}} />
			<View style={{width: '90%'}}>
				<StyledText style={[styles.title, {marginTop: HP(2)}]}>Thanks for uploading all the information!</StyledText>
				<StyledText style={[styles.text, {marginTop: HP(15)}]}>Next, we need to do an identity check before creating your account. In the next step, you will be asked to upload an identity document and to take a selfie.</StyledText>
				{/*<StyledText style={[styles.text, {marginTop: HP(10)}]}>In the next step, you will be asked to upload an identity document and to take a selfie</StyledText> */}
				<StyledText style={[styles.text, {marginTop: HP(15)}]}>Click PROCEED TO KYC to start</StyledText>
				<StyledText style={[styles.text, styles.instructionText]}>*KYC check is completed by third party</StyledText>
			</View>
			<View style={styles.bottomButtons}>
				<KycButton {...{inquiry, session, user}} onSuccess={onSuccess} />
				<TinyTextButton title="SIGN OUT" onPress={signOut} buttonStyle={{marginTop: HP(4)}}/>
			</View>
		</AppView>
	)	
}

const useStyles = () => {
	const {theme} = useTheme();
	const styles = StyleSheet.create({
		screenContentStyle: {
			alignItems: 'center',
			// justifyContent: 'center'
		},
		title: {
			textAlign: 'center', 
			fontSize: WP(5)
		},
		text: {
			textAlign: 'center', 
			fontSize: WP(4.5)
		},
		instructionText: {
			color: theme.grey5,
			fontSize: WP(4),
			marginTop: HP(0.5)
		},
		bottomButtons: {
			position: 'absolute', 
			bottom: 15,
			alignItems: 'center'
		},
		kycButton: {
			width: '90%'
		}

	})

	return {theme, styles};
}


export default StartKyc;
