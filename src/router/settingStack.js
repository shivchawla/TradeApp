import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import ShowContactInfo from '../screens/ShowContactInfo';
import ShowIdentityInfo from '../screens/ShowIdentityInfo';
import ShowDocumentUpload from '../screens/ShowDocumentUpload';
import ShowAgreementInfo from '../screens/ShowAgreementInfo';
import ShowDisclosureInfo from '../screens/ShowDisclosureInfo';
import ShowTrustedContactInfo from '../screens/ShowTrustedContactInfo';

import UpdateContactInfo from '../screens/updateContactInfo';
import UpdateIdentityInfo from '../screens/updateIdentityInfo';
import UpdateDocumentUpload from '../screens/updateDocumentUpload';
import UpdateAgreementInfo from '../screens/updateAgreementInfo';
import UpdateDisclosureInfo from '../screens/updateDisclosureInfo';
import UpdateTrustedContactInfo from '../screens/updateTrustedContactInfo';


const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ShowContact" component={ShowContactInfo} />
      <Stack.Screen name="UpdateContact" component={UpdateContactInfo} />
      <Stack.Screen name="ShowIdentity" component={ShowIdentityInfo} />
      <Stack.Screen name="UpdateIdentity" component={UpdateIdentityInfo} />
      <Stack.Screen name="ShowDocument" component={ShowDocumentUpload} />
      <Stack.Screen name="UpdateDocument" component={UpdateDocumentUpload} />
      <Stack.Screen name="ShowAgreement" component={ShowAgreementInfo} />
      <Stack.Screen name="UpdateAgreement" component={UpdateAgreementInfo} />
      <Stack.Screen name="ShowDisclosure" component={ShowDisclosureInfo} />
      <Stack.Screen name="UpdateDisclosure" component={UpdateDisclosureInfo} />
      <Stack.Screen name="ShowTrustedContact" component={ShowTrustedContactInfo} />
      <Stack.Screen name="UpdateTrustedContact" component={UpdateTrustedContactInfo} />
    </Stack.Navigator>
  );
};


export default SettingStack;