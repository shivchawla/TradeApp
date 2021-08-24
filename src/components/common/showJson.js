import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../../theme';

export const ShowJson = ({json, full = true}) => {

	return (
		<View style={{flex:1, color: 'white' }}>
			{ full ?
				Object.keys(json).map((key, index) => {
					return <StyledText key={index}>{key} : {JSON.stringify(json[key])}</StyledText>
				})

			  : <StyledText>{JSON.stringify(json)}</StyledText>
			  	
			}
		</View>
	);
}

const styles = StyleSheet.create({

});
