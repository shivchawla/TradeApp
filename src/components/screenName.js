import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../theme';

const ScreenName = ({name}) => {
  return (
    <View style={styles.nameContainer}>
      <StyledText style={styles.screenName}>{name}</StyledText>
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