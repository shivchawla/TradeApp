import React, {useState } from 'react';
import {View, StyleSheet } from 'react-native';

import {
  AppView,
  CalendarIcon,
  DatePickerModal,
  HorizontalButtonGroup,
} from '../../components/common';

import { DisplayActivityList } from '../../components/activity';

import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';
import { NBusinessDaysBeforeISODate, toISODate } from '../../utils';
import { useAccountActivity, useOrders } from '../../helper';

const lastTenDates =Object.fromEntries([...Array(10).keys()].map((i) => { 
  return [NBusinessDaysBeforeISODate(i, 'YYYY-MM-DD'), NBusinessDaysBeforeISODate(i, "Do MMM' YY")]
}));

console.log(lastTenDates);

const HorizontalFieldSelection = React.memo(({ onSelect }) => {
  const { styles } = useStyles();
  const activityTypes = { all: 'All', orders: 'Orders', trades: 'Trades', other: 'Other' };

  return (
    <HorizontalButtonGroup
      {...{onSelect}}
      firstSelected={true}
      undoSelection={false}
      items={activityTypes}
      buttonStyle={styles.fieldSelectionButton}
      buttonTextStyle={styles.fieldSelectionButtonText}
      selectedButtonStyle={styles.selectedFieldButton}
    />
  );
});

const HorizontalPeriodSelection = React.memo(({ onSelect }) => {
  const { styles } = useStyles();

  return (
    <HorizontalButtonGroup
      {...{onSelect}}
      scroll={true}
      items={lastTenDates}
      buttonStyle={styles.periodSelectionButton}
      buttonTextStyle={styles.periodSelectionButtonText}
      selectedButtonStyle={styles.selectedPeriodButton}
    />
  );
});

const ZeroActivityCount = () => {
  const { styles } = useStyles();
  return (
    <View style={styles.noActivityContainer}>
      <StyledText style={styles.noActivityTitle}>No Activities Found</StyledText>
    </View>
  );
};

//Current Logic filters
// 1. All Orders (inlcuding fills)
// 2. All Activities (including fills)
// 3. Display just filters the right content

//PROBLEM: If top 10 activiies have only one trade, then only one trade will
//show up in trades

//SOLUTION: Fetch separately for all cases;
const ShowHistory = ({ field, range, updateLoading }) => {
  const { styles } = useStyles();
  const [start, end] = range || [];

  const accountActivityQuery = React.useMemo(
    () => { return {activity_type: null, after: start, until: end}},
    [start, end]
  );

  const { isLoading: isLoadingActivity, accountActivity} = useAccountActivity(
    accountActivityQuery
  );

  const getOrderStatus = React.useCallback(
    (field) => {
      if (field == 'trades') {
        return 'filled';
      } else if (field == 'orders') {
        return 'all';
      } else {
        return 'all';
      }
    },
    [field]
  );

  const orderQuery = React.useMemo(() => {
    return {
      status: 'orders',
      ...(end && end != '' && { until: toISODate(end) }),
      ...(start && start != '' && { after: toISODate(start) }),
    };
  }, [start, end]);

  const { isLoading: isLoadingOrders, orders } = useOrders(orderQuery);

  const isLoading = isLoadingActivity || isLoadingOrders;

  React.useEffect(() => {

    // console.log('IsLoading: ', isLoading);
    // console.log('isLoadingActivity: ', isLoadingActivity);
    // console.log('isLoadingOrders: ', isLoadingOrders);
  
    updateLoading(isLoading);
  }, [isLoading]);

  const removeFillsFromActivities = (activities) => {
    return activities.filter((item) => item.activity_type != 'FILL');
  };

  const removeFillsFromOrders = (orders) => {
    return orders.filter((item) => item.status != 'filled');
  };

  const updateOrderActivity = (orders) => {
    return orders.map((item) => {
      return { ...item, activity_type: 'ORDER' };
    })
  };

  const getAllActivities = () => {
    if (!field || field == "all") {
      // console.log("Filtering All");
      return updateOrderActivity(orders || []).concat(removeFillsFromActivities(accountActivity || []));
    } else if (field == "orders") {
      console.log("Filtering Orders");
      return removeFillsFromOrders(updateOrderActivity(orders || [])); 
    } else if(field == "trades") {
      console.log("Filtering Trades");
      return updateOrderActivity(orders || []).filter((item) => item.status == 'filled');
    } else {
      // console.log("Filtering others");
      return (accountActivity || []).filter((item) => item.activity_type != 'FILL');
    }
  }

  const allActivities = React.useMemo(() => getAllActivities());

  return (
    <View style={{ flex: 1 }}>
      {!isLoading && (
        <>
          {!!allActivities && allActivities.length > 0 ? (
            <DisplayActivityList style={styles.activityFlatList} activityList={allActivities} />
          ) : (
            <ZeroActivityCount />
          )}
        </>
      )}
    </View>
  );
};

const History = (props) => {

  console.log("Rendering History");

  const [isModalVisible, setModalVisible] = useState(false);

  const [range, setRange] = useState(null);
  const [field, setField] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { HP, WP } = useDimensions();

  const handleFieldSelection = (field) => {
      console.log('Handle Field Selection: ', field);
      setField(field);
  }

  const handlePeriodSelection = (date) => {
      if (date){
        console.log('Handle Period Selection: ', date);
        //BUG: First date needs to one day before date
        setRange([date, date]);
      } else {setRange(null)}
  }

  return (
    <AppView
      isLoading={isLoading}
      scroll={false}
      title="History"
      headerRight={<CalendarIcon iconSize={WP(5)} onPress={() => setModalVisible(true)}/>}
    >
      <HorizontalFieldSelection onSelect={handleFieldSelection} />
      <HorizontalPeriodSelection onSelect={handlePeriodSelection} />

      <ShowHistory
        {...{ field, range }}
        updateLoading={(loading) => {
          console.log('Set Loading: ', loading);
          setLoading(loading);
        }}
      />

      <DatePickerModal
        isVisible={isModalVisible}
        onClose={React.useCallback(() => setModalVisible(false), [])}
        onSelectRange={React.useCallback((s, e) => setRange([s, e]), [])}
      />
    </AppView>
  );
};

const useStyles = () => {
      const { theme } = useTheme();
    const { HP, WP} = useDimensions();
    const {fontSize, fontWeight} = useTypography();

  const styles = StyleSheet.create({
    buttonGroupContainer: {
      flexDirection: 'row',
      marginTop: WP(3),
      width: '100%',
    },
    scrollButtonGroupContainer: {
      marginTop: WP(3),
      maxHeight: 30,
      alignItems: 'center',
    },
    fieldSelectionButton: {
      backgroundColor: theme.grey9,
      padding: WP(1),
      paddingLeft: WP(4),
      paddingRight: WP(4),
      marginRight: WP(4),
    },
    fieldSelectionButtonText: {},
    selectedFieldButton: {
      backgroundColor: theme.backArrow,
    },
    periodSelectionButton: {
      borderColor: theme.grey5,
      borderWidth: 1,
      padding: WP(1),
      paddingLeft: WP(3),
      paddingRight: WP(3),
      marginRight: WP(2),
    },
    periodSelectionButtonText: {},
    selectedPeriodButton: {
      borderColor: theme.backArrow,
    },
    noActivityContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noActivityTitle: {
      fontSize: WP(5),
    },
    activityFlatList: {
      marginTop: WP(5),
    },
  });

  return { theme, styles };
};

export default History;
