import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { AppView, ConfirmButton } from '../../components/common';
import { useTheme, HP, WP } from '../../theme';

import { AnyForm } from '../../components/onboard';

import { useOnboarding } from '../../helper';

const steps = ['identity', 'taxInfo', 'contact', 'disclosure', 'employment', 'trustedContact', 'customer_agreement', 'account_agreement', 'margin_agreement'];
const titles = {
	'identity': 'Add Identity Info',
	'taxInfo': 'Add Tax Info',
	'contact': 'Add Contact Info',
	'disclosure': 'Disclosures',
	'employment': 'Employment',
	'trustedContact': 'Add Trusted Contact', 
	'customerAgreement': 'Customer Agreement',
	'accountAgreement': 'Account Agreement',
	'marginAgreement': 'Margin Agreement',
}

const agreements = {
	'customerAgreement': 'https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf',
	'accountAgreement': 'https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf',
	'marginAgreement': 'https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf'
}


const Onboard = (props) => {

	const {navigation} = props;
	const [step, setStep] = useState(null);
	const {isLoading, onboardingData, getOnboarding, updateOnboarding} = useOnboarding({enabled: true});

	React.useEffect(() => {

		const handleOnboardingStep = async() => {
			if (!isLoading && onboardingData) {
				const keys = Object.keys(onboardingData);

				if (onboardingData?.formStatus?.status == 'complete') {
					toKyc();
					return;
				}

				var count = 0;
				steps.every((step, index) => {
					const idx = keys.findIndex(it => it == step);
					if (idx == -1) {
						// console.log("Not Found Step: ", step)
						setStep(step);
						return false;
					} else {
						count++;
						// console.log("Step: ", step);
						// console.log(count);
					}
					
					return true;
				})

				if (count == steps.length) {
					toKyc();
				}	
			}
		}

		handleOnboardingStep()

	}, [isLoading]);

	const submitOnboarding = async (key, values) => {

		// console.log("submitOnboarding: ", key);
		// console.log(values);

		//Save the information in storage
		//And the complete onboarding should be saved in firebase
		await updateOnboarding(key, values);
		toNextStep();
	}

	const Welcome = () => {
		return <ConfirmButton buttonContainerStyle={{bottom: 10}} buttonStyle={{width: '80%'}} title="NEXT" onClick={() => setStep('identity')} /> 
	}

	const toKyc = () => {
		navigation.navigate('StartKyc', {user: onboardingData});
	} 

	const toNextStep = async() => {
		//This is the last 
		if(step == 'margin_agreement') {
			//Move to
			await updateOnboarding('formStatus', {status: 'complete', date: new Date().toISOString()})
			toKyc();
		} else {
			setStep(steps[steps.findIndex(it => it == step) + 1])
		}
	}

	const toPreviousStep = () => {
		setStep(steps[steps.findIndex(it => it == step) - 1])
	} 

	console.log("Onboarding isLoading: ", isLoading);
	
	return (
		<AppView 
			scrollViewStyle={{flexGrow:1}} 
			isLoading={isLoading} 
			title={titles[step] || "Welcome"} 
			goBack={() => toPreviousStep()}
		>
			{!step && <Welcome />}
			{step && 
				<AnyForm 
					type={step} 
					initialData={onboardingData} 
					onSubmit={(values) => submitOnboarding(step, values)}
					{...{agreements}}
				/>
			}
		</AppView>
	);
}


const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	
	});

	return {theme, styles};

}

export default Onboard;
