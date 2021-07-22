import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';

const ShowJson = ({json, full = true}) => {
	return (
		<ScrollView>
			{ full ?
				Object.keys(json).map((key, index) => {
					return <Text key={index}>{key} : {JSON.stringify(json[key])}</Text>
				})

			  : <Text>{JSON.stringify(json)}</Text>
			  	
			}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
});

export default ShowJson;