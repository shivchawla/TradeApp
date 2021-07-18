import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import AddContactInfo from '../screens/contactInfo';
import AddIdentityInfo from '../screens/identityInfo';
import AddDocumentUpload from '../screens/documentUpload';
import AddAgreementInfo from '../screens/agreementInfo';
import AddDisclosureInfo from '../screens/disclosureInfo';
import AddTrustedContactInfo from '../screens/trustedContactInfo';

//Now, this information might need to be saved on user device 
//To avoid re-doing all of it again in case of shutdown

const OnboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AddContact" component={AddContactInfo} />
      <Stack.Screen name="AddIdentity" component={AddIdentityInfo} />
      <Stack.Screen name="AddDocument" component={AddDocumentUpload} />
      <Stack.Screen name="AddAgreement" component={AddAgreementInfo} />
      <Stack.Screen name="AddDisclosure" component={AddDisclosureInfo} />
      <Stack.Screen name="AddTrustedContact" component={AddTrustedContactInfo} />
    </Stack.Navigator>
  );
};


export default OnboardStack;