import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import {IBill, IStoreAndBill, Status} from '../../../interfaces/bill.interface';
import {axiosInstance} from '../../../axiosRequest';
import {IStore} from '../../../interfaces/store.interface';
import StackHeader from '../../../components/StackHeader';
import Loading from '../../../components/Loading';
import ImgTag from '../../../components/ImgTag';
import Search from '../../../components/Search';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Select from '../../../components/Select';
import { formatDateTimeThai } from '../../../utils/formatDateTimeThai';

interface CheckListStoresProps {
  navigation: any;
}

const PaymentListScreen: React.FC<CheckListStoresProps> = ({navigation}) => {
  const [listBills, setListBills] = useState<IStoreAndBill[]>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string>();
  const [date, setDate] = useState<string>();
  const [listDateAll, setListDateAll] = useState<string[]>();


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
      setListBills(response.data);
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
        onPress={() => item.bill.electricityUnit && navigation.navigate('PaymentDetail', item)}
        title={() => <Text category="s1">{item.store.name}</Text>}
        description={() => (
          <Text category="p2">{item.store.area.toUpperCase()}</Text>
        )}
        accessoryLeft={() => (
          <View style={{marginRight: 10}}>
            <ImgTag key={index} size={50} imageUrl={item?.store.imagePath} />
          </View>
        )}
        accessoryRight={() => (
          <View
            key={index}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor:
                item.bill.status === Status.SUCCESS
                  ? '#499617'
                  : item.bill.electricityUnit
                  ? '#E91D63'
                  : '#FF9F05',
            }}>
            <Text category="s1" style={{color: '#ffffff'}}>
              {item.bill.status === Status.SUCCESS
                ? 'ชำระเงินแล้ว'
                : item.bill.electricityUnit
                ? 'รอการชำระเงิน'
                : 'รอคำนวน'}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <Layout style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
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
          height: "90%",
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
           
          data={ listBills? listBills.filter(item =>item.store.name.toLowerCase().includes(search?.toLowerCase() ?? ''), ): undefined
            }
            renderItem={renderItem}
          />
        )}
      </View>
    </Layout>
  );
};

export default PaymentListScreen;

const styles = StyleSheet.create({});
