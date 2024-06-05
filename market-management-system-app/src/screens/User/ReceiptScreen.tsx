import { StyleSheet, Text, View, } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Layout, SelectItem, IndexPath, Button } from '@ui-kitten/components';
import StackHeader from '../../components/StackHeader';
import { billsMock } from '../../mock/bill';

import Loading from '../../components/Loading';
import { IBill, IStoreAndBill } from '../../interfaces/bill.interface';
import { useFocusEffect } from '@react-navigation/native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { downloadFile } from '../../utils/downloadFile';
import Pdf from 'react-native-pdf';
import { URL_SERVER } from '../../constant';
import { formatDateThai } from '../../utils/formatThaiDate';
import { axiosInstance } from '../../axiosRequest';
import { formatDateTimeThai } from '../../utils/formatDateTimeThai';
import Select from '../../components/Select';

interface ReceiptScreenProps {
  navigation: any;
  route: any;
}

const ReceiptScreen = ({ route, navigation }: ReceiptScreenProps) => {

  const [listDateAll, setListDateAll] = useState<string[]>();
  const [date, setDate] = useState<string>();
  const [billsList, setBillsList] = useState<{ date: string, id: number }[]>();
  const [bill, setBill] = useState<IBill>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBillData = async () => {
    setIsLoading(true);
    try {
      const responseDateAll = await axiosInstance.get<{ date: string, id: number }[]>(
        '/bills/date-all-store?status=success',
      );
      const dateArray = responseDateAll.data.map(item => item.date);
      setListDateAll(dateArray);
      setBillsList(responseDateAll.data);
    } catch (e) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'เกิดข้อผิดพลาด',
        textBody: 'กรุณาลองใหม่อีกครั้ง',
        autoClose: 3000,
        button: 'close',
        onHide: () => {
          return navigation.navigate('InvoiceBills');
        },
      });
    }


    setBill(route.params);
    setIsLoading(false);
  };

  const getBillByDate = async (date: string) => {
    setIsLoading(true);
    try {
      const findId = billsList?.find(item => item.date === date);
      const response = await axiosInstance.get<IBill>(
        `/bills/${findId?.id}`,
      );
      setBill(response.data);
    } catch (e) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'เกิดข้อผิดพลาด',
        textBody: 'กรุณาลองใหม่อีกครั้ง',
        autoClose: 3000,
        button: 'close',
        onHide: () => {
          return navigation.navigate('InvoiceBills');
        },
      });
    }
    setIsLoading(false);
  }

  const onLoadComplete = (numberOfPages: number, filePath: string) => {
    console.log(`number of pages: ${numberOfPages}`);
  };

  const onError = (error: any) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'เปิด PDF ไม่สำเร็จ',
      textBody: 'กรุณาตรวจสอบไฟล์ PDF อีกครั้ง',
      autoClose: 3000,
      button: 'close',
      onHide: () => {
        return navigation.navigate('Home');
      },
    });
  };

  const handleDownload = () => {
    try {
      downloadFile(
        bill!.ReceiptPdfPath!,
        `${formatDateThai(bill!.createdAt)}.pdf`,
      );
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'กำลังดาวน์โหลด PDF',
        textBody: 'กรุณารอสักครู่',
        autoClose: 3000,
        button: 'close',
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'ดาวน์โหลด PDF ไม่สำเร็จ',
        textBody: 'กรุณาตรวจสอบไฟล์ PDF อีกครั้ง',
        autoClose: 3000,
        button: 'close',
        onHide: () => {
          return navigation.navigate('Home');
        },
      });
    }
  };

  useEffect(() => {
    fetchBillData();
  }, [navigation]);

  return (
    <Layout
      style={{ flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <StackHeader navigation={navigation} >
            <Select
              value={formatDateTimeThai(date ?? new Date().toISOString())}
              onSelect={(value: string) => {
                setDate(value);
                getBillByDate(value)
              }}
              data={listDateAll}
              width={220}
            />
          </StackHeader>

          <View style={styles.container}>
            <Pdf
              trustAllCerts={false}
              source={{
                // uri: `http://192.168.1.45:3000/uploads?file=uploads\\test.pdf`,
                uri: `${URL_SERVER}/uploads?file=${bill!.ReceiptPdfPath}`,
                cache: true,
              }}
              onLoadComplete={onLoadComplete}
              onError={onError}
              style={styles.pdf}
            />
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              size="large"
              style={{ width: 310, marginTop: 5 }}
              onPress={handleDownload}>
              บันทึก
            </Button>
          </View>
        </>
      )}
    </Layout>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',

  },
});
