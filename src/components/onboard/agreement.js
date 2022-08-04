import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import NetInfo from "@react-native-community/netinfo";
// import PDFView from 'react-native-view-pdf/lib/index';

import { ConfirmButton, Checkbox } from '../../components/common';

import { useTheme, WP, HP, StyledText } from '../../theme';

export const Agreement = React.forwardRef(({field, uri, title, onAgree, ...props}, ref) => {

	const {theme, styles} = useStyles();
	const [agree, setAgree] = useState(false);
	const [isLoading, setLoading] = useState(true);

	const onSubmit = async() => {
		const netState = await NetInfo.fetch();

		onAgree({
			signedAt: new Date().toISOString(),
			ipAddress: netState.details.ipAddress
		});
	}

	//Added this to get imperative ref to onSubmit
 	React.useImperativeHandle(ref, () => ({submitForm: onSubmit}), []);
	
	return (
		<>	

			<View style={{flex: 1 }}>
				<View
					fadeInDuration={250.0}
					style={{ flex: 0.9 }}
					resource={uri}
					resourceType="url"
					onLoad={() => {console.log("Loading Complete"); setLoading(false)}}
					onError={(error) => console.log('Cannot render PDF', error)}
		        />
				{!isLoading && 
					<TouchableOpacity style={styles.checkBoxContainer} onPress={() => setAgree(!agree)}>
						<Checkbox
					    	value={agree}
					    	onToggle={() => setAgree(!agree)}
					  	/>
					  <StyledText>I have made the deposit and uploaded the right document</StyledText>
					</TouchableOpacity>
				}  
			</View>			
			{agree && <ConfirmButton buttonContainerStyle={styles.buttonContainer} buttonStyle={{width: '90%'}} title="Next" onClick={onSubmit} />}
		</>
	)
})

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		checkBoxContainer: {
			flexDirection: 'row', 
			alignItems: 'center',
			marginTop: HP(2)
		},
		buttonContainer: {
			position: 'absolute',
			bottom: 10,
			alignSelf: 'center',
			// marginBottom: HP(2)
		}
	});

	return {theme, styles}
}