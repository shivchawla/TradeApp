import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';

import {StyledText} from './styled';

const ShowJson = ({json, full = true}) => {

	return (
		<ScrollView contentContainerStyle={{color: 'white' }}>
			{ full ?
				Object.keys(json).map((key, index) => {
					return <StyledText key={index}>{key} : {JSON.stringify(json[key])}</StyledText>
				})

			  : <StyledText>{JSON.stringify(json)}</StyledText>
			  	
			}
		</ScrollView>
	);
}

const styles = StyleSheet.create({

});

export default ShowJson;