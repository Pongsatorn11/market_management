import {View} from 'react-native';
import React, {useState, useEffect} from 'react';

import { Layout, List, ListItem, Text} from '@ui-kitten/components';
import StackHeader from '../../components/StackHeader';

import Loading from '../../components/Loading';
import {IBill,IStoreAndBill,Status} from '../../interfaces/bill.interface';

import {axiosInstance} from '../../axiosRequest';
import {useFocusEffect} from '@react-navigation/native';
import {IResponseFetchData} from '../../interfaces/responseApi.interface';
import { formatDateThai } from '../../utils/formatThaiDate';

interface InvoiceBillsProps {
  navigation: any;
}

const InvoiceBillsScreen = ({navigation}: InvoiceBillsProps) => {
  

  const [listBills, setListBills] = useState<IBill[]>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchBillsData = async () => {
    setIsLoading(true);
    const response = await axiosInstance.get<IResponseFetchData<IBill>>(
      '/bills',
      {
        params: {
          page: 1,
          perPage: 10,
          status: Status.PENDING,
        },
      },
    );
     
    setListBills(response.data.items);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBillsData();
    }, [navigation]),
  );

  const renderItem = ({item, index}: {item: IBill; index: number}) => (
    <ListItem
      style={{borderRadius: 10, marginBottom: 10}}
      title={() => <Text>{formatDateThai(item.createdAt)}</Text>}
      description={`ยอดรวม: ${item.total} บาท`}
      onPress={() => navigation.navigate('Invoice', item)}
    />
  );

  return (
    <Layout style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
      <StackHeader navigation={navigation} />
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
          <List
            style={{
              // backgroundColor: '#ffffff',
              backgroundColor: '#e8e8e8',
            }}
            data={listBills}
            renderItem={renderItem}
          />
        )}
        {/* {hasMoreBills && (
          <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
            <Button status="primary" onPress={loadMoreBills}>
              Load More
            </Button>
          </View>
        )} */}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginBottom: 20,
          marginTop: 20,
        }}>
        <Text style={{fontSize: 26}}>TOTAL:</Text>
        <Text style={{fontSize: 26, fontWeight: 'bold'}}>{listBills ? listBills?.reduce((acc, bill) => acc + bill.total, 0) : 0} ฿</Text>
      </View>
    </Layout>
  );
};

export default InvoiceBillsScreen;
