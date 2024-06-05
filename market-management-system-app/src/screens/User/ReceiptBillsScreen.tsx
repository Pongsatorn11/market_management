import {View} from 'react-native';
import React, {useState} from 'react';

import {Button, Layout, List, ListItem, Text} from '@ui-kitten/components';
import StackHeader from '../../components/StackHeader';

import Loading from '../../components/Loading';
import {IBill, Status} from '../../interfaces/bill.interface';

import {useFocusEffect} from '@react-navigation/native';
import {axiosInstance} from '../../axiosRequest';
import {IResponseFetchData} from '../../interfaces/responseApi.interface';
import { formatDateThai } from '../../utils/formatThaiDate';

interface ReceiptBillsProps {
  navigation: any;
}

const ReceiptBillScreen = ({navigation}: ReceiptBillsProps) => {
 

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
          status: Status.SUCCESS,
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
      description={`ชำระเมื่อ: ${formatDateThai(item.updatedAt)}`}
      onPress={() => navigation.navigate('Receipt', item)}
    />
  );

  return (
    <Layout style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
      <StackHeader navigation={navigation} />
      <View
        style={{
          flex: 1,
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
    </Layout>
  );
};

export default ReceiptBillScreen;
