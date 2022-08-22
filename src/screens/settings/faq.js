import React from 'react';
import { WebView } from 'react-native-webview';

import {AppView} from '../../components/common';
import {useDimensions} from '../../theme';

const FAQ = () => {

	const { HP, WP } = useDimensions();

	const INJECTED_JAVASCRIPT =  `(function() {
		document.getElementsByTagName("header")[0].style.display="none";
		document.getElementsByClassName("qubely-block-2da7fb")[0].style.display="none";
	})();`;
	  
	return (
		<AppView title="FAQ" scrollViewStyle={{flexGrow:1}}>
			<WebView
				injectedJavaScript={INJECTED_JAVASCRIPT}
				source={{ width: WP(100), uri: 'https://fincript.com/faq' }} 
			 	style={{borderColor: 1, borderWidth: 1}}
			/>
		</AppView>
	)
}
export default FAQ;
