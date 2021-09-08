import React, {useState, useCallback} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import { AppView, ConfirmButton } from '../../components/common';
import { useTheme, HP, WP, StyledText } from '../../theme';

import Inquiry from 'react-native-persona';

console.log(Inquiry);

const KycButton = ({templateId = "tmpl_6Uj4QPGVn4hx7nQ9pNKwr65t", user}) => {
  
  const handleSuccess = useCallback((inquiryId, attributes) => {
     console.log("Inquiry #{inquiryId} succeeded with attributes #{attributes}");
  }, []);

  const handleCancelled = useCallback(() => {
    console.log("Inquiry was cancelled")
  }, []);

  const handleFailed = useCallback(inquiryId => {
    console.log("Inquiry #{inquiryId} failed.")
  }, []);

  const handleError = useCallback(error => {
    console.error(error);
  }, []);

  const handleBeginInquiry = useCallback(() => {
    Inquiry.fromTemplate(templateId)
      .environment('sandbox')
      .referenceId(user.email)
      .onSuccess(handleSuccess)
      .onCancelled(handleCancelled)
      .onFailed(handleFailed)
      .onError(handleError)
      .build()
      .start();
  }, [templateId])

  return (
    <ConfirmButton onClick={handleBeginInquiry} title="START KYC" />
  )
}

const StartKyc = (props) => {

  const {user} = props.route.params;

  console.log(user);
  console.log(user.email);

  //Get pending inquiry from Persona for user email 


	return (
		<AppView title="Start KYC" goBack={false} >
			<KycButton {...{user}}/>
		</AppView>
	)	
}

export default StartKyc;
