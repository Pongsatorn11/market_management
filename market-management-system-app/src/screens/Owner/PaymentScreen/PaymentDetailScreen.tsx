import {StyleSheet, View, ViewProps} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Card, Layout, Text} from '@ui-kitten/components';
import {IStoreAndBill, Status} from '../../../interfaces/bill.interface';
import {axiosInstance} from '../../../axiosRequest';
import StackHeader from '../../../components/StackHeader';
import Loading from '../../../components/Loading';
import { IUser } from '../../../interfaces/user.interface';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

interface PaymentDetailScreenProps {
  navigation: any;
  route: any;
}

interface IStoreAndBillAndUser extends IStoreAndBill {
  user: IUser;
}

const PaymentDetailScreen: React.FC<PaymentDetailScreenProps> = ({
  route,
  navigation,
}: PaymentDetailScreenProps) => {
  const [storeAndBillAndUser, setStoreAndBillAndUser] = useState<IStoreAndBillAndUser>();
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchStoreAndBillData = async () => {
    setIsLoading(true);
    try{
     const reponse = await axiosInstance.get<IUser[]>(`/users/${route.params?.store.userId}`) 
      setStoreAndBillAndUser({...route.params,user: reponse.data[0]});
    } catch (e) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'เกิดข้อผิดพลาด',
        textBody: 'กรุณาลองใหม่อีกครั้ง',
        autoClose: 3000,
        button: 'close',
        onHide: () => {
          return navigation.navigate('Home');
        },
      });
    }
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStoreAndBillData();
    }, [navigation]),
  );

const handleConfirm = async() => {
  setIsLoading(true);
  try {
    await axiosInstance.get(`/bills/confirm/${storeAndBillAndUser!.bill.id}`);
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: `รหัส: ${storeAndBillAndUser!.bill.id} ชำระเงินเรียบร้อยแล้ว`,
      textBody: 'กรุณาตรวจสอบใบเสร็จ',
      autoClose: 3000,
      button: 'close',
      onHide: () => {
        return navigation.navigate('PaymentList');
      },
    });
  } catch (e) {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'เกิดข้อผิดพลาด',
      textBody: 'กรุณาลองใหม่อีกครั้ง',
      autoClose: 3000,
      button: 'close',
      onHide: () => {
        return navigation.navigate('PaymentList');
      },
    });
  }
  setIsLoading(false);
}

  const Header = (props: any): React.ReactElement => (
    <View {...props}>
      <Text category="h5">รายละเอียดค่าเช่าร้าน</Text>
      <Text category="s1">รหัส: {storeAndBillAndUser!.bill.id}</Text>
      <Text category="s1">ร้าน: {storeAndBillAndUser!.store.name}</Text>
      <Text category="s1">ชื่อ: {storeAndBillAndUser!.user.firstName}</Text>
      <Text category="s1">โซน: {storeAndBillAndUser!.store.area.toLocaleUpperCase()}</Text>
    </View>
  );

  const Footer = (props: any): React.ReactElement => (
    <View
      {...props}
      style={[props.style, styles.footerContainer]}>
      {/* ชำระเงินแล้ว */}
      {storeAndBillAndUser!.bill.status === Status.SUCCESS ? (
        <Button
          style={styles.footerControl}
          size="small"
          status="success"
          disabled={true}>
          ชำระเงินแล้ว
        </Button>
      ) : (
        <Button
          style={styles.footerControl}
          size="small"
          onPress={handleConfirm}>
          ชำระเงิน
        </Button>
      )}
    </View>
  );

  return (
    <Layout
      style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
      <StackHeader navigation={navigation} />
      {isLoading ? (
        <Loading />
      ) : (
        <Card style={styles.card} header={Header} footer={Footer}>
          <Text category="h5">รายละเอียดค่าใช้จ่าย</Text>
          <Text category="s1">ค่าเช่า: {storeAndBillAndUser!.bill.rentPrice} บาท</Text>
          <Text category="s1">ค่าน้ำ: {storeAndBillAndUser!.bill.waterBill} บาท</Text>
          <Text category="p1">หน่วยที่ใช้: {storeAndBillAndUser!.bill.waterUnit - storeAndBillAndUser!.bill.waterUnitBefore} หน่วย</Text>
          <Text category="s1">ค่าไฟ: {storeAndBillAndUser!.bill.electricityBill} บาท</Text>
          <Text category="p1">หน่วยที่ใช้: {storeAndBillAndUser!.bill.electricityUnit - storeAndBillAndUser!.bill.electricityUnitBefore} หน่วย</Text>
          <Text category="h6">รวมทั้งหมด: {storeAndBillAndUser!.bill.total} บาท</Text>
        </Card>
      )}
    </Layout>
  );
};

export default PaymentDetailScreen;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
});
