import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input, Layout, Text, Button, Card} from '@ui-kitten/components';
import StackHeader from '../../../components/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {axiosInstance} from '../../../axiosRequest';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../../../components/Loading';
import {isNumber} from '../../../utils/isNumber';

interface WaterRentScreenProps {
  navigation: any;
  route: any;
}

interface IUpdateWaterPriceUnitForm {
  WaterPriceUnit: number;
}

const validationSchema = Yup.object({
  WaterPriceUnit: Yup.number()
    .min(1, 'กรุณากรอกข้อมูลที่มากกว่า 0')
    .required('กรุณากรอกข้อมูล'),
});

const WaterRentScreen = ({navigation}: WaterRentScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      WaterPriceUnit: 0,
    } as IUpdateWaterPriceUnitForm,
    validationSchema: validationSchema,
    onSubmit: async (values: IUpdateWaterPriceUnitForm) => {
      try {
        await axiosInstance.put('/lands', {
          WaterPriceUnit: values.WaterPriceUnit,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'อัพเดทสำเร็จ',
          textBody: 'อัพเดทราคาน้ำสำเร็จ',
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
      formik.setFieldValue('WaterPriceUnit', response.data.WaterPriceUnit);
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
      <Text category='h3'>ราคาค่าน้ำ</Text>
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
                          กรอกราคาน้ำต่อหน่วย
                        </Text>
                        <Text category="label" status="danger">
                          *
                        </Text>
                      </View>
                    )
                  }}
                  placeholder="ราคาน้ำต่อหน่วย"
                  status="primary"
                  id="WaterPriceUnit"
                  size="large"
                  onChange={e =>
                    formik.setFieldValue(
                      'WaterPriceUnit',
                      Math.max(0, Number(e.nativeEvent.text) || 0),
                    )
                  }
                  onBlur={() => formik.setFieldTouched('WaterPriceUnit')}
                  value={formik.values.WaterPriceUnit.toString()}
                  caption={
                    <Layout>
                      
                        {formik.touched.WaterPriceUnit &&
                        formik.errors.WaterPriceUnit
                          ? formik.errors.WaterPriceUnit
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

export default WaterRentScreen;

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