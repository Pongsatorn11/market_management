import {StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Layout, List, ListItem, Text} from '@ui-kitten/components';


import {axiosInstance} from '../../../axiosRequest';
import StackHeader from '../../../components/StackHeader';

import Loading from '../../../components/Loading';
import {AuthContext} from '../../../contexts/AuthContext';
import { IStoreAndBill} from '../../../interfaces/bill.interface';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import Search from '../../../components/Search';
import Select from '../../../components/Select';
import { formatDateTimeThai } from '../../../utils/formatDateTimeThai';

interface CheckListStoresProps {
  navigation: any;
}

const CalculateLockRentScreen: React.FC<CheckListStoresProps> = ({
  navigation,
}) => {
  const {user} = useContext(AuthContext);

  const [listStoresAndBills, setListStoresAndBills] =
    useState<IStoreAndBill[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [listDateAll, setListDateAll] = useState<string[]>();
  const [date, setDate] = useState<string>();
  const [search, setSearch] = useState<string>();

  const fetchBillsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<IStoreAndBill[]>(
        '/bills/owner',
        {
          params: {
            date: date,
          },
        },
      );
      setListStoresAndBills(response.data);
      const responseDateAll = await axiosInstance.get<string[]>(
        '/bills/date-all',
      );
      setListDateAll(responseDateAll.data);
    } catch (e) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'เกิดข้อผิดพลาด',
        textBody: 'กรุณาลองใหม่อีกครั้ง',
        autoClose: 3000,
        button: 'close',
        onHide: () => {
          return navigation.navigate('CheckListStores');
        },
      });
    }
    setIsLoading(false);
  }, [date, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBillsData();
    }, [navigation]),
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: IStoreAndBill;
    index: number;
  }): React.ReactElement => {
    return (
      <ListItem
        style={{borderRadius: 10, marginBottom: 10}}
        onPress={() => navigation.navigate('CalculateLockRentForm', item)}
        title={() => <Text category="s1">{item.store.name}</Text>}
        description={() => (
          <Text category="p2">{item.store.area.toUpperCase()}</Text>
        )}
        accessoryRight={() => (
          <View
            key={index}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: item.bill.electricityUnit
                ? '#499617'
                : '#E91D63',
            }}>
            <Text category="s1" style={{color: '#ffffff'}}>
              {item.bill.electricityUnit ? 'คำนวนแล้ว' : 'รอคำนวน'}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <Layout
      style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
      <StackHeader navigation={navigation}>
        <Select<String>
          value={formatDateTimeThai(date ?? new Date().toISOString())}
          onSelect={value => {
            fetchBillsData();
            setDate(value as string);
          }}
          data={listDateAll}
          width={220}
          // label="เลือกวันที่"
        />
      </StackHeader>
      <Search value={search} onChange={setSearch} />
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
          paddingTop: 10,
          height: '80%',
          backgroundColor: '#e8e8e8',
          borderRadius: 10,
        }}>
        {isLoading ? (
          <Loading />
        ) : (
          <List
            style={{
              // backgroundColor: '#ffffff',
              backgroundColor: '#e8e8e8',
            }}
            data={
              listStoresAndBills
                ? listStoresAndBills.filter(item =>
                    item.store.name
                      .toLowerCase()
                      .includes(search?.toLowerCase() ?? ''),
                  )
                : undefined
            }
            renderItem={renderItem}
          />
        )}
      </View>
    </Layout>
  );
};

export default CalculateLockRentScreen;

const styles = StyleSheet.create({});
