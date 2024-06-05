import {
  Button,
  Card,
  Divider,

  Input,
  Layout,

  Text,
} from '@ui-kitten/components';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { useFormik } from 'formik';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

import StackHeader from '../../../components/StackHeader';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosRequest';

import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Loading from '../../../components/Loading';
import { useFocusEffect } from '@react-navigation/native';

interface ICalculateLockRentForm {
  waterUnit: number;
  electricityUnit: number;
}

const CalculateLockRentForm: React.FC<Props> = ({ route, navigation }: any) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isUpdate, setIsUpdate] = useState<Boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [waterUnitBefore, setWaterUnitBefore] = useState<number>(0);
  const [electricityUnitBefore, setElectricityUnitBefore] = useState<number>(0);

  const formik = useFormik({
    initialValues: {
      waterUnit: 0,
      electricityUnit: 0,
      rentPrice: 0,
    } as ICalculateLockRentForm,
    validationSchema: Yup.object({
      waterUnit: Yup.number()
        .min(
          ((waterUnitBefore) ?? 0) + 1,
          `จำนวนหน่วยน้ำต้องมากกว่า ${waterUnitBefore ?? 0}`,
        )
        .required('กรุณากรอกจำนวนหน่วยน้ำ'),
      electricityUnit: Yup.number()
        .min(
          (electricityUnitBefore ?? 0) + 1,
          `จำนวนหน่วยไฟฟ้าต้องมากกว่า ${electricityUnitBefore ?? 0
          }`,
        )
        .required('กรุณากรอกจำนวนหน่วยไฟฟ้า'),
    }),

    onSubmit: async (values: ICalculateLockRentForm) => {
      setIsLoading(true);
      try {
        await axiosInstance.put(
          `/bills/update-water-electricity-unit/${route.params.bill.id}`,
          {
            ...values,
          },
        );


        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'สำเร็จ',
          textBody: 'บันทึกข้อมูลสำเร็จ',
          autoClose: 3000,
          button: 'close',
          onHide: () => {

            navigation.navigate('CalculateLockRent');
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

            return navigation.navigate('CalculateLockRent');
          },
        });
      }
      setIsLoading(false);
    },
  });

  const fetchStoreData = async () => {
    setIsLoading(true);

    formik.setFieldValue('waterUnit', route.params.bill.waterUnit ?? 0);
    formik.setFieldValue('electricityUnit', route.params.bill.electricityUnit ?? 0);
    setIsUpdate(route.params.bill.waterUnit && route.params.bill.electricityUnit ? true : false)
    setWaterUnitBefore(route.params.bill.waterUnitBefore)
    setElectricityUnitBefore(route.params.bill.electricityUnitBefore)
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStoreData();
    }, [navigation]),
  );



  const Header = (props: any): React.ReactElement => (
    <View  {...props}  >
      <View >
        <Text category='h6'>รายละเอียดค่าเช่าร้าน</Text>
        <Text>รหัส: {route.params.store.id}</Text>
        <Text>ร้าน: {route.params.store.name}</Text>
        {/* <Text>ชื่อ: {route.params.users.firstName}</Text> */}
        <Text>โซน: {route.params.store.area.toLocaleUpperCase()}</Text>
      </View>
    </View>
  )

  const Footer = (props: any): React.ReactElement => (
    <View {...props} style={styles.footerContainer}>

      {(formik.dirty && formik.isValid) ? (
        <Button
          size="large"
          style={{ width: 310 }}

          onPress={() => formik.handleSubmit()}>
          ยืนยัน
        </Button>
      ) : (
        <>
        </>
      )}




    </View>
  )

  const calculateWaterPrice = () => {
    // หาค่าน้ำที่ใช้
    const waterUsed = formik.values.waterUnit - route.params.bill.waterUnitBefore;
    // คำนวณหน่วยละของค่าน้ำ
    const waterPriceUnit = route.params.bill.WaterPriceUnit;
    // คำนวณค่าน้ำทั้งหมด
    return waterUsed * waterPriceUnit;
  };

  const calculatElectricPrice = () => {
    // หาค่าน้ำที่ใช้
    const electricUsed = formik.values.electricityUnit - route.params.bill.electricityUnitBefore;
    // คำนวณหน่วยละของค่าน้ำ
    const electricPriceUnit = route.params.bill.electricityPriceUnit;
    // คำนวณค่าน้ำทั้งหมด
    return electricUsed * electricPriceUnit;
  };

  const AllcalculatedPrice = () => {
    const waterPrice = calculateWaterPrice();
    const electricPrice = calculatElectricPrice();
    const rentPrice = route.params.store.rentPrice
    return waterPrice + electricPrice + rentPrice;
  }



  return (
    <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <StackHeader navigation={navigation} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{ paddingTop: 10, width: 310 }}>
              <Card style={styles.card} header={Header} footer={Footer}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text category='h6'>ค่าเช่า</Text>
                  <Text>{route.params.store.rentPrice}</Text>
                  <Text>บาท</Text>
                </View>

                <Divider />

                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text category='h6'>ค่าน้ำ</Text>
                    <Text>{calculateWaterPrice()}</Text>
                    <Text>บาท</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>หน่วยละ</Text>
                    <Text> {route.params.bill.WaterPriceUnit}</Text>
                    <Text>บาท/หน่วย</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>หน่วยก่อน</Text>
                    <Text>{route.params.bill.waterUnitBefore}</Text>
                    <Text>หน่วย</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>หน่วยที่ใช้ไป</Text>
                    <Text>{formik.values.waterUnit - route.params.bill.waterUnitBefore}</Text>
                    <Text>หน่วย</Text>
                  </View>
                  <Input
                    disabled={isUpdate ? true : false}
                    keyboardType="numeric"
                    label={() => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Text category="p2"
                            style={{
                              marginRight: 5,
                            }}
                          >
                            หน่วยหลัง
                          </Text>
                          <Text category="label" status="danger">
                            *
                          </Text>
                        </View>
                      )
                    }}
                    accessoryRight={() => {
                      return (
                        <Text category="label">
                          หน่วย
                        </Text>
                      );
                    }}
                    placeholder="หน่วยน้ำ"
                    status="primary"
                    id="waterUnit"
                    size="large"
                    onChange={e =>
                      formik.setFieldValue(
                        'waterUnit',
                        Math.max(0, Number(e.nativeEvent.text) || 0),
                      )
                    }
                    onBlur={() => formik.setFieldTouched('waterUnit')}
                    value={formik.values.waterUnit.toString()}
                    caption={
                      <Layout>
                        <Text category="p2" status="danger">
                          {formik.touched.waterUnit && formik.errors.waterUnit
                            ? formik.errors.waterUnit
                            : undefined}
                        </Text>
                      </Layout>
                    }
                  />
                </View>
                <Divider />
                <View>
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text category='h6'>ค่าไฟฟ้า</Text>
                    <Text>{calculatElectricPrice()}</Text>
                    <Text>บาท</Text>
                  </View>
                  <View style={{ flexDirection: 'row', }}>
                    <Text>หน่วยละ</Text>

                    <Text style={{ marginLeft: 80 }}> {route.params.bill.electricityPriceUnit}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Text>หน่วยก่อน</Text>
                    <Text>{electricityUnitBefore}</Text>
                    <Text>บาท</Text>
                  </View> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text category='h6'>ค่าไฟฟ้า</Text>
                    <Text>{calculatElectricPrice()}</Text>
                    <Text>บาท</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>หน่วยละ</Text>
                    <Text> {route.params.bill.electricityPriceUnit}</Text>
                    <Text>บาท/หน่วย</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>หน่วยก่อน</Text>
                    <Text>{route.params.bill.electricityUnitBefore}</Text>
                    <Text>หน่วย</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>หน่วยที่ใช้ไป</Text>
                    <Text>{formik.values.electricityUnit - route.params.bill.electricityUnitBefore}</Text>
                    <Text>หน่วย</Text>
                  </View>
                  <Input
                    keyboardType="numeric"
                    disabled={isUpdate ? true : false}
                    label={() => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Text category="p2"
                            style={{
                              marginRight: 5,
                            }}
                          >
                            หน่วยหลัง
                          </Text>
                          <Text category="label" status="danger">
                            *
                          </Text>
                        </View>
                      )
                    }}
                    accessoryRight={() => {
                      return (
                        <Text category="label">
                          หน่วย
                        </Text>
                      );
                    }}
                    placeholder="หน่วยไฟฟ้า"
                    status="primary"
                    id="electricityUnit"
                    size="large"
                    onChange={e =>
                      formik.setFieldValue(
                        'electricityUnit',
                        Math.max(0, Number(e.nativeEvent.text) || 0),
                      )
                    }
                    onBlur={() => formik.setFieldTouched('electricityUnit')}
                    value={formik.values.electricityUnit.toString()}
                    caption={
                      <Layout>
                        <Text category="p2" status="danger">
                          {formik.touched.electricityUnit &&
                            formik.errors.electricityUnit
                            ? formik.errors.electricityUnit
                            : undefined}
                        </Text>
                      </Layout>
                    }
                  />
                </View>
                <Divider />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text category='h4'>รวม</Text>
                  <Text style={styles.text}>{AllcalculatedPrice()} บาท</Text>
                </View>
              </Card>
            </View>

          </View>
        </>
      )}
    </Layout>
  );
};

export default CalculateLockRentForm;
const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    alignItems: 'flex-start',
    textAlign: 'left',
    color: '#000',
    paddingHorizontal: 5,
  },
  card: {
    margin: 2,
    marginTop: 60
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 25,
    width: 150,
    marginBottom: 20,
    marginTop: 20

  },
});