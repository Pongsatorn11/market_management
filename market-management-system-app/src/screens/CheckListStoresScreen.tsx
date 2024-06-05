import {StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Layout, List, ListItem, Text} from '@ui-kitten/components';

import {IStore} from '../interfaces/store.interface';
import {axiosInstance} from '../axiosRequest';
import StackHeader from '../components/StackHeader';
import ImgTag from '../components/ImgTag';
import Loading from '../components/Loading';
import {AuthContext} from '../contexts/AuthContext';
import Search from '../components/Search';

interface CheckListStoresProps {
  navigation: any;
  route: any;
 
}

const CheckListStores: React.FC<CheckListStoresProps> = ({route,navigation}) => {
  const {user} = useContext(AuthContext);
  const [listStores, setListStores] = useState<IStore[]>();
  const [search, setSearch] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  

 

  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/stores/get-stores?page=1&perPage=42');
      const storeItems = response.data.items;
  
      const index = storeItems.findIndex((itemStore: { id: number | null | undefined; }) => itemStore.id === user?.storeId);
      if (index > -1) {
        const item = storeItems.splice(index, 1)[0];
        storeItems.unshift(item);
      }
   
      setListStores(storeItems);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false); 
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchStoreData();
    }, [navigation]),
  );



  const renderItem = ({
    item,
    index,
  }: {
    item: IStore;
    index: number;
  }): React.ReactElement => {
 

    
    return (
      <ListItem
        style={{
          borderRadius: 10,
          marginBottom: 10,
          backgroundColor: user && item.id === user.storeId ? '#FFA500' : '#FFFFFF',

        }}
        onPress={() => navigation.navigate('DetailStore', item)}
        title={() => <Text category="s1">{item.name}</Text>}
        description={() => <Text category="p2">{item.area.toUpperCase()}</Text>}
        accessoryLeft={() => (
          <View style={{marginRight: 10}}>
            <ImgTag key={index} size={50} imageUrl={item?.imagePath} />
          </View>
        )}
        accessoryRight={() =>
          user?.isOwner ? (
            <Button
              key={index}
              size="small"
              onPress={() => navigation.navigate('StoreForm', {...item})}>
              แก้ไข
            </Button>
          ) : (
            <></>
          )
        }
      />
    );
  };
  return (
    <Layout style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
      <StackHeader navigation={navigation}>
      </StackHeader>
      <Search value={search} onChange={setSearch} />
      <View
        style={{
          flex: 9,
          paddingHorizontal: 10,
          marginTop: 10,
          paddingTop: 10,
          maxHeight: 600,
          backgroundColor: '#e8e8e8',
          borderRadius: 10,
        }}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
          <List
            style={{
              
              backgroundColor: '#e8e8e8',
            }}
            
            data={
              
              listStores
                ? listStores.filter(item =>
                    item.name
                      .toLowerCase()
                      .includes(search?.toLowerCase() ?? ''),
                  )
                : undefined
            }
            renderItem={renderItem}
          />
          
          
         
         
          </>
        )}
      </View>
      
      <View style={{flex: 1, alignItems: 'center', marginTop: 50}}>
        {user?.isOwner ? (
          <Button
            size="large"
            style={{width: 310}}
            onPress={() => navigation.navigate('StoreForm')}>
            สร้างร้านค้าใหม่
          </Button>
        ) : (
          <></>
        )}
      </View>
    </Layout>
  );
};

export default CheckListStores;

const styles = StyleSheet.create({});
