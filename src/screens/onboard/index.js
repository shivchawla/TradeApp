import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { AppView, ConfirmButton, GobackIcon, TinyTextButton, Checkbox } from '../../components/common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

import { AnyForm, Welcome, OnboardHeader, OnboardSummary } from '../../components/onboard';

import { useOnboarding } from '../../helper';

const steps = ['identity', 'taxInfo', 'contact', 'disclosure', 'employment', 'trustedContact', 'customer_agreement', 'account_agreement', 'margin_agreement', 'form_status'];

const agreements = {
	'customer_agreement': 'https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf',
	'account_agreement': 'https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf',
	'margin_agreement': 'https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf'
}

const Onboard = (props) => {

	const {navigation} = props;
	const {step: forcedStep} = props?.route?.params ?? {};

	const [step, setStep] = useState(forcedStep);
	const {isLoading, onboardingData, getOnboarding, updateOnboarding} = useOnboarding({enabled: true});
	// const [showSummary, setShowSummary] = useState(false);

	const [agreeOne, setAgreeOne] = useState(false);
	const [agreeTwo, setAgreeTwo] = useState(false);

	React.useEffect(() => {

		console.log("Onboard useEffect is called");

		(async() => {
			if (onboardingData && !!!forcedStep) {
				const keys = Object.keys(onboardingData);

				if (keys.length == 0 ) {
					return;
				}

				if (onboardingData?.formStatus?.status == 'complete') {
					toKyc();
					return;
				}

				var count = 0;
				steps.every((step, index) => {
					const idx = keys.findIndex(it => it == step);
					if (idx == -1 ) {
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

				// if (count == steps.length) {
				// 	toSummary();
				// }
			}
		})()

	}, [onboardingData]);

	const submitOnboarding = async (key, values) => {

		// console.log("submitOnboarding: ", key);
		// console.log(values);

		//Save the information in storage
		//And the complete onboarding should be saved in firebase
		await updateOnboarding(key, values);
		toNextStep();
	}

	const toKyc = () => {
		navigation.navigate('StartKyc', {user: onboardingData});
	}

	const onConfirm = async() => {
		await updateOnboarding('formStatus', {status: 'complete', date: new Date().toISOString()})
		toKyc();
	}

	const toNextStep = async() => {
		setStep(steps[steps.findIndex(it => it == step) + 1])
	}

	const toPreviousStep = () => {
		setStep(steps[steps.findIndex(it => it == step) - 1])
	} 

	const Header = () => {
		return (
			<View style={{marginTop: HP(2), marginLeft: WP(2), flexDirection: 'row', alignItems: 'center'}}>
				{(!!step && step !='identity' && step != 'form_status') && <GobackIcon goBack={toPreviousStep} />}
				{(!!step && step != 'form_status') && <OnboardHeader {...{step}} style={{marginTop: HP(0)}}/>}
			</View>
		)
	}

	const {theme, styles} = useStyles();


	return (
		<AppView
			goBack={false} 
			header={step && <Header />}
			scrollViewStyle={{flexGrow:1}} 
			isLoading={isLoading} 
			>
			{step != 'form_status' ? 
				<>
					{!step && <Welcome onNext={() => {console.log("Next Pressed"); setStep('identity')}} />}
					{step && 
						<AnyForm 
							type={step} 
							initialData={onboardingData} 
							onSubmit={(values) => submitOnboarding(step, values)}
							{...{agreements}}
						/>
					}
				</>
				:
				<View style={styles.summaryContainer}>
					<StyledText style={styles.title}>Review and Submit your application</StyledText>
					{steps && steps.map((step , index) => {
						if (index <= 5) {
							return (
								<View key={index} style={styles.singleSummary}>
									<OnboardSummary type={step} data={onboardingData} />
									<View style={{alignItems: 'flex-end'}}>
										<TinyTextButton title="Edit" onPress={() => {setShowSummary(false); setStep(step)}} />
									</View>
								</View>
							)
						}
					})}

					<View style={styles.checkboxContainer}>
						<Checkbox value={agreeOne} onToggle={() => setAgreeOne(!agreeOne)} />
						<StyledText style={styles.checkboxText}> I have read all the agreements and agree to terms and conditions mentioned within</StyledText>
					</View>

					<View style={{flexDirection: 'row'}}>
						<Checkbox value={agreeTwo} onToggle={() => setAgreeTwo(!agreeTwo)} />
						<StyledText style={styles.checkboxText}>I have filled this application my self and all the information provided above is accurate to my best knowledge </StyledText>
					</View>

					<ConfirmButton 
						title="SUBMIT" 
						disabled={!agreeTwo || !agreeOne } 
						onClick={onConfirm} 
						buttonStyle={styles.confirmButton}
						buttonContainerStyle={styles.confirmButtonContainer}
					/>

				</View>
			}
		</AppView>
	);
}


const useStyles = () => {
	
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		summaryContainer: {
			marginTop: HP(2),
			justifyContent: 'center',
		},
		title: {
			fontSize: WP(5),
			textAlign: 'center'
		},
		checkboxContainer: {
			flexDirection: 'row',
			marginTop: HP(4),
			marginBottom: HP(2),
			paddingRight: WP(2)
		},
		checkboxText: {
			// fontSize: WP(4)
			marginLeft: WP(2)
		},
		confirmButtonContainer: {
			marginTop: HP(10),
			marginBottom: HP(10),
			// alignItems: 'center',
			justifyContent: 'center',
		},
		confirmButton: {
			width: '90%'
		}
	});

	return {theme, styles};

}

export default Onboard;
