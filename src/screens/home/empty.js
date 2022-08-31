import React from 'react';
import {AppView, SwipeButton, Icon} from '../../components/common';
import {useDimensions} from '../../theme';

const EmptyScreen = () => {
	const { HP, WP } = useDimensions();


	return (
		<AppView>
			<SwipeButton 
				icon={<CustomIcon iconName="arrow-forward" iconColor="white" iconSize={WP(8)}/>}
				title="Swipe to place order" 
				swipeTitle="Submitting order"
				/>	
		</AppView>
	)	
}

export default EmptyScreen;