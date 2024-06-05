import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';

import StackHeader from '../../../components/StackHeader';


import { axiosInstance } from '../../../axiosRequest';
import { Area, IStore } from '../../../interfaces/store.interface';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IResponseFetchData } from '../../../interfaces/responseApi.interface';

import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { areaSelect } from '../../../constant';
import { isNumber } from '../../../utils/isNumber';

type Props = {
  navigation: any;
  route: any;
};

interface IUpdateShopPriceForm {
  rentPrice: number;
  area?: Area;
  storeId: number;
}

const validationSchema = Yup.object({
  area: Yup.string().required('กรุณาเลือกพื้นที่'),
  rentPrice: Yup.number()
    .min(1, 'กรุณากรอกข้อมูลที่มากกว่า 0')
    .required('กรุณากรอกข้อมูล'),
});

const ShopRentScreen = ({ route, navigation }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>();
  const [listArea, setListArea] = useState<string[]>();
  const [storeList, setStoreList] = useState<IStore[]>();

  useEffect(() => {
    const fetchArea = async () => {
      const response = await axiosInstance.get<IResponseFetchData<IStore>>(
        '/stores/get-stores?page=1&perPage=42',
      );
      setStoreList(response.data.items);
      const area = response.data.items.reduce((acc, store) => {
        acc.push(store.area);
        return acc;
      }, [] as string[]);
      setListArea(area);

    };

    formik.setValues({
      ...route.params,
    });
    fetchArea();
  }, []);

  const formik = useFormik({
    initialValues: {
      storeId: 0,
      area: undefined,
      rentPrice: 0,
    } as IUpdateShopPriceForm,
    validationSchema: validationSchema,
    onSubmit: async (values: IUpdateShopPriceForm) => {

      try {
        await axiosInstance.put(`/stores/update-rent-price`, null, {

          params: {
            storeId: values.storeId,
            rentPrice: values.rentPrice,
          },

        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'อัพเดตราคาสำเร็จ',
          textBody: 'ราคาของคุณได้รับการอัพเดตแล้ว',
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
    },
  });

  const handleSelect = (index: any) => {
    const area: Area = areaSelect[index?.row];

    const store: IStore | undefined = storeList?.find(
      store => store.area === area,
    );

    formik.setFieldValue('area', area);
    formik.setFieldValue('rentPrice', store?.rentPrice);
    formik.setFieldValue('storeId', store?.id);
  };

  const Header = (props: any): React.ReactElement => (
    <View  {...props}  >
      <View >
        <Text category='h3'>ราคาค่าเช่า</Text>
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
    <Layout
      style={{ flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10 }}>
      <StackHeader navigation={navigation} />
      <View style={{ marginVertical: 'auto', paddingHorizontal: 'auto' }}>

        <Card style={styles.card} header={Header} footer={Footer}>
          <Select
            label="พื้นที่"
            status="primary"
            size="large"
            placeholder="เลือกพื้นที่"
            selectedIndex={selectedIndex}
            value={formik.values.area?.toUpperCase()}
            onSelect={index => {
              setSelectedIndex(index);
              handleSelect(index);
            }}
            onBlur={() => formik.setFieldTouched('area')}
            caption={
              <Layout>
                <Text category="p2" status="danger">
                  {formik.touched.area && formik.errors.area
                    ? formik.errors.area
                    : undefined}
                </Text>
              </Layout>
            }>
            {areaSelect.map((area, index: number) => (
              <SelectItem
                title={area?.toUpperCase()}
                key={index}
                disabled={listArea?.includes(area) ? false : true}
              />
            ))}
          </Select>

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
                    ราคา
                  </Text>
                  <Text category="label" status="danger">
                    *
                  </Text>
                </View>
              )
            }}
            placeholder="ราคา"
            status="primary"
            id="rentPrice"
            size="large"
            style={{ borderColor: '#0495EE', borderWidth: 2 }}
            textStyle={{ color: '#000000' }}
            onChange={e =>
              formik.setFieldValue(
                'rentPrice',
                Math.max(0, Number(e.nativeEvent.text) || 0),
              )
            }
            onBlur={() => formik.setFieldTouched('rentPrice')}
            value={`${formik.values.rentPrice ?? '0'}`}
            caption={
              <Layout>
                <Text category="p2" status="danger">
                  {formik.touched.rentPrice && formik.errors.rentPrice
                    ? formik.errors.rentPrice
                    : undefined}
                </Text>
              </Layout>
            }
          />
        </Card>

      </View>
      <View style={{ alignItems: 'center', margin: 50, justifyContent: 'flex-end' }}>

      </View>

    </Layout>
  );
};

export default ShopRentScreen;

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