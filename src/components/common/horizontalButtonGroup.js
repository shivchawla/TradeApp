import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme, WP, HP, StyledText } from '../../theme';

const HorizontalButton = React.memo(({isSelected, item, onPress, ...props}) => (
    <TouchableOpacity 
      style={[props.buttonStyle, { ...(isSelected && props.selectedButtonStyle) }]}
      {...{onPress}}
    >
      <StyledText
        style={[
          props.buttonTextStyle,
          { ...(isSelected && props.selectedButtonTextStyle) },
        ]}
      >
        {item}
      </StyledText>
    </TouchableOpacity>
));


export const HorizontalButtonGroup = ({
  items,
  firstSelected = false,
  undoSelection = true,
  onSelect,
  scroll = false,
  ...props
}) => {
  const { styles } = useStyles();
  const [selected, setSelected] = useState(firstSelected ? 0 : -1)

  React.useEffect(() => {
    if (selected != null && selected != -1) {
      onSelect(Object.keys(items)[selected])
    } else {
      onSelect();
    }
  }, [selected]);

  const onPress = (index, key) => {
    if (index !== selected) {
      setSelected(index);
    } else if(undoSelection) {
      setSelected(-1)
    }
  };

  const renderItems = () => {
    return Object.keys(items).map((key, index) =>
      <HorizontalButton {...{key}}
        isSelected={index == selected} 
        item={items[key]} 
        onPress={() => onPress(index, key)}
        {...props} 
      />
    )
  };

  return (
    <>
      {!scroll ? (
        <View style={styles.buttonGroupContainer}>{renderItems()}</View>
      ) : (
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonGroupContainer}
          >
            {renderItems()}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    buttonGroupContainer: {
      flexDirection: 'row',
      marginTop: WP(3),
    },
  });

  return { theme, styles };
};
