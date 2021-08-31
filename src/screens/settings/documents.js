import React, {useState} from 'react';
import { TouchableOpacity, StyleSheet, View, Image, PermissionsAndroid } from "react-native";
import { useTranslation } from 'react-i18next';
import * as RNFS from 'react-native-fs';

import { AppView, CalendarIcon, 
	DatePickerModal, ShowJson, DownloadIcon } from '../../components/common';
import { useTheme, WP, HP, StyledText } from '../../theme';
import { useDocuments, useDownloadDocument } from '../../helper';
import { NMonthsAgoISODate, currentISODate, toTimeZoneDate} from '../../utils';

const ZeroDocumentCount = () => {
	return(
		<StyledText>Zero Documents</StyledText>
	)
}

const ShowDocument = ({document, type}) => {
	const {styles} = useStyles();

	const fName = type == 'trade_confirmation' ? 
		`Trade-Confirmation-${document.date}`
		: `Account-Statement-${document.date}`;

	const directoryFileName = RNFS.DownloadDirectoryPath + '/' + fName + '.pdf'; 

	const {downloadDocument} = useDownloadDocument(
			{id:document?.id, fileName:directoryFileName} , 
			{enabled: false});

	
	// const downloadDocument = async () => {
	// 	const granted = await PermissionsAndroid.request(
	// 		PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
	// 		{
	// 	        title: "Download File Permissions",
	// 	        message: "Your app needs permission.",
	// 	        buttonNegative: "Cancel",
	// 	        buttonPositive: "OK"
	// 	      }
	//     );

	//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	// 		getDocumentLink().then(data => {
	// 			const blob = new Blob([data], { type: 'application/pdf' });
	// 			console.log(blob);

	// 			RNFS.writeFile(directoryFileName, blob)
	// 			.then(response => {
	// 				console.log("Response");
	// 				console.log(response);
	// 			})
	// 			.catch(err => {console.log("Error"); console.log(err)})
	// 		})
	//     } else {
	// 		console.log("Permission denied");
	// 		return false;
	//     }
	// }

	return (
		<View style={styles.documentRow}>
			<StyledText>{toTimeZoneDate(document.date, "Do MMM YYYY")}</StyledText>
			<DownloadIcon onPress={downloadDocument} />	
		</View>
	)	
}

const ShowDocumentList = ({start, end, type}) => {
	console.log("ShowDocumentList");
	const {styles} = useStyles();

	const {documents} = useDocuments({start, end, type});
	
	return (
		<>
		{documents && documents.length > 0 ? 
			<View style={styles.documentList}>
				{documents && documents.reverse().map((item, index) => {
					return (
						<ShowDocument key={`document-${index}`} document={item} {...{type}}/>
					)	
				})}
			</View>
		:
		<ZeroDocumentCount />
		}
		</>
	)
}

const DownloadDocument = (props) => {

	const {type} = props.route.params;

	const [isModalVisible, setModalVisible] = useState(false);
	const [range, setRange] = useState([NMonthsAgoISODate(1, "YYYY-MM-DD"), currentISODate("YYYY-MM-DD")]);
	const [start, end] = range;

	const heading  = type == 'trade_confirmation' ? "Trade Confirmations" : "Account Statements";

	return (
		<AppView title={heading} headerRight={<CalendarIcon onPress={() => setModalVisible(true)} />} >
			
			<ShowDocumentList {...{start, end, type}} />

			<DatePickerModal 
				isVisible={isModalVisible}
				onClose={() => setModalVisible(false)}
				onSelectRange={(s,e) => setRange([s,e])}
			/>
		</AppView>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		documentList: {
			marginTop: HP(10)
		},
		documentRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			height: 40,
			borderBottomWidth: 0.5,
			borderColor: theme.grey9,
			marginBottom: HP(2)
		}
	})

	return {theme, styles};
}


export default DownloadDocument;

