import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card, Divider, Input, Layout, Text} from '@ui-kitten/components';
import Loading from '../../../components/Loading';
import StackHeader from '../../../components/StackHeader';

import {axiosInstance} from '../../../axiosRequest';

import * as Yup from 'yup';
import {useFormik} from 'formik';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {useFocusEffect} from '@react-navigation/native';
import {isNumber} from '../../../utils/isNumber';

interface ElectricRentScreenProps {
  navigation: any;
}

interface IUpdateElectricRentPriceUnitForm {
  electricityPriceUnit: number;
}

const validationSchema = Yup.object({
  electricityPriceUnit: Yup.number()
    .min(1, 'กรุณากรอกข้อมูลที่มากกว่า 0')
    .required('กรุณากรอกข้อมูล'),
});

const ElectricRentScreen = ({navigation}: ElectricRentScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      electricityPriceUnit: 0,
    } as IUpdateElectricRentPriceUnitForm,
    validationSchema: validationSchema,
    onSubmit: async (values: IUpdateElectricRentPriceUnitForm) => {
      try {
        await axiosInstance.put('/lands', {
          electricityPriceUnit: values.electricityPriceUnit,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'อัพเดทสำเร็จ',
          textBody: 'อัพเดทราคาไฟฟ้าสำเร็จ',
          autoClose: 3000,
          button: 'close',
          onHide: () => {
            return navigation.navigate('PriceAllDetails');
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
            return navigation.navigate('PriceAllDetails');
          },
        });
      }
      setIsLoading(false);
    },
  });

  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/lands');
      formik.setFieldValue('electricityPriceUnit', response.data.electricityPriceUnit);
    } catch (e) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'เกิดข้อผิดพลาด',
        textBody: 'กรุณาลองใหม่อีกครั้ง',
        autoClose: 3000,
        button: 'close',
        onHide: () => {
          return navigation.navigate('PriceAllDetails');
        },
      });
    }
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStoreData();
    }, [navigation]),
  );

  const Header = (props: any): React.ReactElement => (
    <View  {...props}  >
      <View >
      <Text category='h3'>ราคาค่าไฟฟ้า</Text>
      </View>
    </View>
    )

    const Footer = (props: any): React.ReactElement => (
      <View {...props} style={styles.footerContainer}>
        
         <Button
                    size="large"
                    style={styles.footerControl}
                    onPress={() => formik.handleSubmit()}>
                    แก้ไข
                  </Button>
                 
      </View>
      )

  return (
    <Layout style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <StackHeader navigation={navigation} />

          <Card style={styles.card} header={Header} footer={Footer}>
          <Input
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
                        กรอกราคาไฟฟ้าต่อหน่วย
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                 placeholder="ราคาไฟฟ้าต่อหน่วย"
                 status="primary"
                 id="electricityPriceUnit"
                 size="large"
                 onChange={e =>
                  formik.setFieldValue(
                    'electricityPriceUnit',
                    Math.max(0, Number(e.nativeEvent.text) || 0),
                  )
                }
                 onBlur={() => formik.setFieldTouched('electricityPriceUnit')}
                 value={formik.values.electricityPriceUnit.toString()}
                 caption={
                   <Layout>
                   
                       {formik.touched.electricityPriceUnit &&
                       formik.errors.electricityPriceUnit
                         ? formik.errors.electricityPriceUnit
                         : undefined}
                    
                   </Layout>
                 }
               />
          </Card>
         
        </>
      )}
    </Layout>
  );
};

export default ElectricRentScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    alignItems: 'flex-start',
    textAlign: 'left',
    color: '#fff',
    paddingHorizontal: 5,
  },
  card: {
    margin: 2,
    marginTop:60
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 25,
    width:150,
    marginBottom:20,
    marginTop:20
   
  },
});