import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import {AuthContext} from './contexts/AuthContext';
// import CheckListStoresScreen from './screens/CheckListStoresScreen';
// import EditStoreScreen from './screens/EditStoreScreen';
// import AddStoreScreen from './screens/AddStoreScreen';

import {StyleSheet, View} from 'react-native';
import ProfileScreen from './screens/ProfileScreen';
import CheckListStoresScreen from './screens/CheckListStoresScreen';
import {Spinner} from '@ui-kitten/components';
import StoreForm1 from './screens/Owner/FormStoreScreen/StoreForm1';
import StoreForm2 from './screens/Owner/FormStoreScreen/StoreForm2';
import MapStoreScreen from './screens/MapStoreScreen';

import InvoiceScreen from './screens/User/InvoiceScreen';
import InvoiceBillsScreen from './screens/User/InvoiceBillsScreen';
import ReceiptScreen from './screens/User/ReceiptScreen';
import ReceiptBillsScreen from './screens/User/ReceiptBillsScreen';


import RegisterScreen from './screens/RegisterScreen';
import PriceAllDetailsScreen from './screens/Owner/SettingsScreen/PriceAllDetailsScreen';
import ShopRentScreen from './screens/Owner/SettingsScreen/ShopRentScreen';
import WaterRentScreen from './screens/Owner/SettingsScreen/WaterRentScreen';
import ElectricRentScreen from './screens/Owner/SettingsScreen/ElectricRentScreen';
import StoreScreen from './screens/User/StoreScreen';
import CalculateLockRentScreen from './screens/Owner/CalculateLockRentScreen/CalculateLockRentScreen';
import CalculateLockRentForm from './screens/Owner/CalculateLockRentScreen/CalculateLockRentForm';
import PaymentListScreen from './screens/Owner/PaymentScreen/PaymentListScreen';
import PaymentDetailScreen from './screens/Owner/PaymentScreen/PaymentDetailScreen';
import DetailStoreScreen from './screens/DetailStoreScreen';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  const {user} = useContext(AuthContext);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAuthLoaded(true);
    }, 3000);
  }, []);

  if (!authLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.controlContainer}>
          <Spinner status="info" size="giant" />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="CheckListStores"
              component={CheckListStoresScreen}
            />
            <Stack.Screen
              name="PriceAllDetails"
              component={PriceAllDetailsScreen}
            />
             <Stack.Screen name="Store" component={StoreScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="DetailStore" component={DetailStoreScreen} />
            <Stack.Screen name="MapStore" component={MapStoreScreen} />
            {user.isOwner ? (
              <>
                <Stack.Screen name="ShopRent" component={ShopRentScreen} />
                <Stack.Screen name="WaterRent" component={WaterRentScreen} />
                <Stack.Screen
                  name="ElectricRent"
                  component={ElectricRentScreen}
                />
                <Stack.Screen
                  name="PaymentList"
                  component={PaymentListScreen}
                />
                <Stack.Screen
                  name="PaymentDetail"
                  component={PaymentDetailScreen}
                />
                <Stack.Screen name="StoreForm" component={StoreForm1} />
                <Stack.Screen name="StoreFormNext" component={StoreForm2} />
                <Stack.Screen
                  name="CalculateLockRent"
                  component={CalculateLockRentScreen}
                />
                <Stack.Screen
                  name="CalculateLockRentForm"
                  component={CalculateLockRentForm}
                />
              
               
              </>
            ) : (
              <>
                <Stack.Screen name="Invoice" component={InvoiceScreen} />
                <Stack.Screen
                  name="InvoiceBills"
                  component={InvoiceBillsScreen}
                />
                <Stack.Screen
                  name="ReceiptBills"
                  component={ReceiptBillsScreen}
                />
                <Stack.Screen name="Receipt" component={ReceiptScreen} />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlContainer: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#3366FF',
  },
});
