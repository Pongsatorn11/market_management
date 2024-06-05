import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Card,
  Divider,
  Layout,
  Text,
} from '@ui-kitten/components';

import StackHeader from '../components/StackHeader';
import {IStore} from '../interfaces/store.interface';
import {IUser} from '../interfaces/user.interface';
import {axiosInstance} from '../axiosRequest';
import Loading from '../components/Loading';
import ImgTag from '../components/ImgTag';
import { formatDateThai } from '../utils/formatThaiDate';

interface DetailStoreScreenProps {
  navigation: any;
  route: any;
}

const DetailStoreScreen = ({route, navigation}: DetailStoreScreenProps) => {
  
  const [store, setStore] = useState<IStore>();
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  


  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      try {
        
        setStore(route.params);
        const response = await axiosInstance.get<IUser[]>(
          `/users/${route.params.userId}`,
        );
        setUser(response.data[0]);

      
       
        
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    };
    fetchStoreData();
  }, []);

  const Header = (props: any): React.ReactElement => (
    <View  {...props}  style={{height:100, }}>
      <View style={{flexDirection:'row', marginLeft:20,alignItems:'center' }}>
        <View style={{alignItems:'center',marginTop:10}}>
      <ImgTag imageUrl={store?.imagePath} size={70} />
      </View>
     <View style={{marginLeft:10}}>
     <Text  category="h4">
                 {store?.name!}
              </Text>
              <Text style={styles.text}>
                  โซน  {store?.area!}
              
                </Text>
     </View>
      </View>
    </View>
    )

  return (
    <Layout style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <StackHeader navigation={navigation} />
       
          <Card header={Header} style={{marginTop:30}}>
            <View>
            <View style={styles.box}>
                <Text style={styles.text}>วันที่เริ่มเช่า</Text>
              <Text style={styles.text} >
                 {formatDateThai(store?.createdAt!)}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
              <Text style={styles.text}>ชื่อจริง</Text>
              <Text style={styles.text} >
                 {user?.firstName!}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
              <Text style={styles.text}>รายละเอียด</Text>
              <Text style={styles.text} >
                 {store?.details!}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
                <Text style={styles.text}>นามสกุล</Text>
              <Text style={styles.text} >
                 {user?.lastName!}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
                <Text style={styles.text}>ชื่อผู้ใช้</Text>
              <Text style={styles.text} >
                 {user?.username!}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
                <Text style={styles.text}>อีเมล</Text>
              <Text style={styles.text} >
                 {user?.email!}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
              <Text style={styles.text}>ที่อยู่</Text>
              <Text style={styles.text} >
                 {user?.address!}
              </Text>
              </View>
              <Divider />

              <View style={styles.box}>
              <Text style={styles.text}>โทรศัพท์</Text>
              <Text style={styles.text} >
                 {user?.phoneNumber!}
              </Text>
              </View>
              <Divider />
            </View>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default DetailStoreScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    alignItems: 'flex-start',
    color:'#000',
    paddingHorizontal: 5,
  },
  box:{
    justifyContent:'space-between',
    marginHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop:35,
    paddingHorizontal: 20, 
    
  },
  divider: {
    backgroundColor:'white'
  }
});
