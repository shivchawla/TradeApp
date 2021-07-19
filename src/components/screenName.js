import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ScreenName = ({name}) => {
  return (
    <View style={styles.nameContainer}>
      <Text style={styles.screenName}>{name}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  nameContainer:{
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  screenName:{
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  }
});

export default ScreenName;