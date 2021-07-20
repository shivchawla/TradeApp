import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ShowJson = ({json}) => {
	return (
		<View>
			{
				Object.keys(json).map((key, index) => {
					return <Text key={index}>{key} : {JSON.stringify(json[key])}</Text>
				})
			}
		</View>
		)
}

const styles = StyleSheet.create({
});

export default ShowJson;