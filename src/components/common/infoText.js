import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { CustomIcon } from './iconButtons';

import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

export const InfoText = ({text, info, ...props}) => {

	const [isVisible, setModalVisible] = useState(false);
	const {theme, styles} = useStyles();

	const {HP, WP, deviceWidth, deviceHeight} = useDimensions();

	return (
		<TouchableOpacity onPress={() => setModalVisible(true)} style={styles.container}>
			<StyledText style={[styles.text, props.textStyle]}>{text}</StyledText>
			<CustomIcon iconName="information-circle-outline" iconSize={WP(4)}/>

			<Modal 
				isVisible={isVisible} 
				backdropOpacity={0.8}
				onBackdropPress={() => setModalVisible(false)}
				{...{deviceWidth, deviceHeight}}>
				<View style={styles.modalContent}>
					{text && <StyledText style={styles.modalText}>{text}</StyledText>}
					{info && <StyledText style={styles.modalInfo}>{info}</StyledText>}
				</View>
			</Modal>

		</TouchableOpacity>	
	)	
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	const styles = StyleSheet.create({
		container:{
			flexDirection: 'row',
			alignItems: 'center'
		},
		text: {
			marginRight: WP(1)
		},
		modalContent: {
			backgroundColor: theme.background,
			padding: WP(6)
		},
		modalText: {

		},
		modalInfo: {

		}
	});

	return {theme, styles};
}