
export const QuickAction = () => {
	const theme = useTheme();
	const styles = useStyles();

	const [isModalVisible, setModalVisible] = useState(false);
	
	return (
		<>
			<TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quickActionButton}>
				<Ionicons style={{zIndex:3}} name="menu" color={theme.backArrow} size={WP(7)}/>
			</TouchableOpacity>
			
			<Modal 
				animationType="slide" 
				backdropOpacity={1.0}
				isVisible={isModalVisible} 
				{...{deviceWidth, deviceHeight}}>
				<View style={{flex:1, justfyContent: 'center', alignItems: 'center'}}>
					<StyledText>QUICK ACTION</StyledText>
				</View>
			</Modal>

		</>
	)
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		quickActionButton: {
			left: (deviceWidth - 30)/2,
			backgroundColor: 'white',
			// position:'absolute',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 2
		}
	});

	return styles;
} 
