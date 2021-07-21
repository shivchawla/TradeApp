import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';

const ShowJson = ({json}) => {
	return (
		<ScrollView>
			{
				Object.keys(json).map((key, index) => {
					return <Text key={index}>{key} : {JSON.stringify(json[key])}</Text>
				})
			}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
});

export default ShowJson;