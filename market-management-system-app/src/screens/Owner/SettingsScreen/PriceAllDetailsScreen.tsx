import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import {  Layout , Text} from '@ui-kitten/components';

import StackHeader from '../../../components/StackHeader';






interface PriceAllDetailsScreenProps {
  navigation: any;
  route: any;
}

const PriceAllDetailsScreen = ({ navigation}: PriceAllDetailsScreenProps) => {
 

  return (
    <Layout style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
      
        <>
         <StackHeader navigation={navigation} />
         <View style={{flex: 1, paddingHorizontal: 10}}>

    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        
            <Text category='h1'>รายละเอียดราคา</Text>
        
        <View style={{justifyContent: 'space-around', marginVertical: 10,width: '80%'}}>
        <TouchableOpacity onPress={() => navigation.navigate('ShopRent')}  style={{backgroundColor: '#FF3D71', justifyContent:'center', alignItems:'center', marginVertical: 10, height: 75, borderRadius: 40}}>
        {/* <CicleSvgIcon /> */}
        <Text style={styles.text}>ค่าเช่า</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('WaterRent')}  style={{backgroundColor: '#3366FF', justifyContent:'center', alignItems:'center', marginVertical: 10, height: 75, borderRadius: 40}}>
        {/* <CicleSVG /> */}
        <Text style={styles.text}>ค่าน้ำ</Text>
</TouchableOpacity>
<TouchableOpacity  onPress={() => navigation.navigate('ElectricRent')} style={{backgroundColor: '#00B383', justifyContent:'center', alignItems:'center', marginVertical: 10, height: 75, borderRadius: 40}}>
        {/* <CicleSVG /> */}
        <Text style={styles.text}>ค่าไฟฟ้า</Text>
</TouchableOpacity>
        </View>
    </View>
</View>
        </> 
        

     
    </Layout>
  );
};

export default PriceAllDetailsScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color:'#fff',
    paddingHorizontal: 5,
    fontWeight: 'bold'
  },
  box:{
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop:35,
    paddingHorizontal: 20,

  },
});
