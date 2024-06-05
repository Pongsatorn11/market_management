import React, { useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { axiosInstance } from '../axiosRequest';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import StackHeader from '../components/StackHeader';
import { IStore } from '../interfaces/store.interface';
import { areaA, areaB, areaC, areaD, areaE, areaF } from '../constant';
import Loading from '../components/Loading';
import { IResponseFetchData } from '../interfaces/responseApi.interface';

import PersonCircleIcon from '../assets/icons/PersonCircleIconSVG';
import { AuthContext } from '../contexts/AuthContext';

const MapStoreScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [listStores, setListStores] = useState<IStore[]>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const fetchStoreData = async () => {
    setIsLoading(true);
    const response = await axiosInstance.get<IResponseFetchData<IStore>>(
      '/stores/get-stores?page=1&perPage=42',
    );
    setListStores(response.data.items);
    setIsLoading(false);
  };

  const findStore = (value: string) => {
    return listStores?.find(store => store.area == value);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStoreData();
    }, [navigation]),
  );

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
      <StackHeader navigation={navigation} />
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Text category="h2">ผังตลาด</Text>
        <View style={{ paddingTop: 10, flex: 1, padding: 20, width: '100%' }}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <View style={styles.containerAF}>
                {areaA.map((area, index) => {
                  const store = findStore(area);
                  return (
                    <TouchableOpacity
                      onPress={() => store && navigation.navigate('DetailStore', store)}
                      key={index}
                      style={[
                        styles.blockStore,
                        { backgroundColor: '#CCF7FE' },
                        store && (store?.userId === user?.id ? { backgroundColor: '#FFA500' } : { backgroundColor: '#99E9FD' }),
                      ]}>
                      {store && <PersonCircleIcon size={50} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={[styles.containerWrapGroupBCDE, { flex: 4 }]}>
                <View style={styles.containerBCDE}>
                  {areaB.map((area, index) => {
                    const store = findStore(area);
                    return (
                      <TouchableOpacity
                        onPress={() => store &&
                          navigation.navigate('DetailStore', store)
                        }
                        key={index}
                        style={[
                          styles.blockStore,
                          { backgroundColor: '#40BBF4' },
                          store && (store?.userId === user?.id ? { backgroundColor: '#FFA500' } : { backgroundColor: '#0273CC' }),
                        ]}>
                        {store && <PersonCircleIcon size={50} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.containerBCDE}>
                  {areaC.map((area, index) => {
                    const store = findStore(area);
                    return (
                      <TouchableOpacity
                        onPress={() => store &&
                          navigation.navigate('DetailStore', store)
                        }
                        key={index}
                        style={[
                          styles.blockStore,
                          { backgroundColor: '#D7F7A6' },
                          store && (store?.userId === user?.id ? { backgroundColor: '#FFA500' } : { backgroundColor: '#60AF20' }),
                        ]}>
                        {store && <PersonCircleIcon size={50} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={[styles.containerWrapGroupBCDE, { flex: 4 }]}>
                <View style={styles.containerBCDE}>
                  {areaD.map((area, index) => {
                    const store = findStore(area);
                    return (
                      <TouchableOpacity
                        onPress={() => store &&
                          navigation.navigate('DetailStore', store)
                        }
                        key={index}
                        style={[
                          styles.blockStore,
                          { backgroundColor: '#F79E94' },
                          store && (store?.userId === user?.id ? { backgroundColor: '#FFA500' } : { backgroundColor: '#E75D5C' }),
                        ]}>
                        {store && <PersonCircleIcon size={50} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.containerBCDE}>
                  {areaE.map((area, index) => {
                    const store = findStore(area);
                    return (
                      <TouchableOpacity
                        onPress={() => store &&
                          navigation.navigate('DetailStore', store)
                        }
                        key={index}
                        style={[
                          styles.blockStore,
                          { backgroundColor: '#FFE49B' },
                          store && (store?.userId === user?.id ? { backgroundColor: '#FFA500' } : { backgroundColor: '#FFBE43' }),
                        ]}>
                        {store && <PersonCircleIcon size={50} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.containerAF}>
                {areaF.map((area, index) => {
                  const store = findStore(area);
                  return (
                    <TouchableOpacity
                      onPress={() => store && navigation.navigate('DetailStore', store)}
                      key={index}
                      style={[
                        styles.blockStore,
                        { backgroundColor: '#E8CBFE' },
                        store && (store?.userId === user?.id ? { backgroundColor: '#FFA500' } : { backgroundColor: '#AE63F9' }),
                      ]}>
                      {store && <PersonCircleIcon size={50} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  containerHeaderText: {
    padding: 5,
    width: 238,
    height: 61,
    borderRadius: 45,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
  },
  containerWrapGroupBCDE: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerBCDE: {
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  containerAF: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockStore: {
    width: 60,
    height: 60,
    margin: 4,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapStoreScreen;
