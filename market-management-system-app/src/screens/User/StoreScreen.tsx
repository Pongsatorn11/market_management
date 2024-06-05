import {TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  Callback,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button, IndexPath, Input, Layout, Select, SelectItem, Text, Toggle} from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { axiosInstance } from '../../axiosRequest';
import ImgTag from '../../components/ImgTag';
import Loading from '../../components/Loading';
import StackHeader from '../../components/StackHeader';
import { AuthContext } from '../../contexts/AuthContext';
import { IStore } from '../../interfaces/store.interface';
import { areaSelect } from '../../constant';
import { IResponseFetchData } from '../../interfaces/responseApi.interface';


type Props = {
  navigation: any;
  route: any;
};




const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'กรุณากรอกอักขระ 3 ตัวขึ้นไป')
    .max(30, 'กรุณากรอกอักขระไม่เกิน 30 ตัวอักษร')
    .required('กรุณากรอกชื่อร้านค้า'),
    area: Yup.string().required('กรุณาเลือกพื้นที่'),
  
  details: Yup.string()
    .min(2, 'กรุณากรอกอักขระ 2 ตัวขึ้นไป')
    .max(50, 'กรุณากรอกอักขระไม่เกิน 50 ตัวอักษร'),
  
});

const StoreScreen = ({route,navigation}: Props) => {
  const {refreshSelf, user} = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>();
  const [listArea, setListArea] = useState<string[]>();
  
  useEffect(() => {
    const fetchArea = async () => {
      const response = await axiosInstance.get<IResponseFetchData<IStore>>('/stores/get-stores?page=1&perPage=42');
      console.log(response.data);
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

  const openImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async (response: Callback | any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.assets[0].uri;
        let formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
        try {
          const responseUploadImage = await axiosInstance.post(
            '/uploads',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          formik.setFieldValue('imagePath', responseUploadImage.data.filePath);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    
    
    try {
      const response = await axiosInstance.get(`/stores/${user?.storeId}`)
    formik.setValues(response.data[0]);
    
      // console.log(response.data[0])
      
    } catch (error) {
      console.log(error);
    }
    // formik.setValues(user!); 
    
    formik.setValues
    setIsLoading(false);
    
  };

  

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [navigation]),
  );

  const formik = useFormik({
    initialValues: {
      imagePath: '',
      name: '',
      details: '',
      area: '',
    } as unknown as IStore,
    validationSchema: validationSchema,
    onSubmit: async (values: IStore) => {
      setIsLoading(true);
      try {
        await axiosInstance.put('/stores/self', {
          imagePath: values.imagePath,
          name: values.name,
          area: values.area,
          details: values.details,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'แก้ไขร้านค้าสำเร็จ',
          textBody: 'แก้ไขร้านค้าของคุณได้รับการแก้ไขแล้ว',
          autoClose: 3000,
          button: 'close',
          onHide: () => {
            refreshSelf();
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
            refreshSelf();
          },
        });
      }
      setIsLoading(false);
    },
  });

  const handleSelect = (index: any) => {
    formik.setFieldValue('area', areaSelect[index?.row]);
  };

  return (
    <Layout style={{flex: 1, justifyContent: 'flex-start', paddingHorizontal: 10}}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <StackHeader navigation={navigation}>
            <Toggle
              style={{
                margin: 2,
              }}
              status="primary"
              checked={isEdit}
              onChange={() => setIsEdit(!isEdit)}>
              แก้ไขร้านค้า
              
            </Toggle>
          </StackHeader>
          <View style={{alignItems: 'center', flex: 1}}>
            <TouchableOpacity
              onPress={() => openImagePicker()}
              disabled={!isEdit}>
              <ImgTag imageUrl={formik.values.imagePath} size={100} />
            </TouchableOpacity>
            <View style={{paddingTop: 10}}>
              <Text category="h5">{isEdit ? 'แก้ไขร้านค้า' : 'ร้านค้า'}</Text>
              
            </View>
            <View style={{paddingTop: 10, width: 310}}>
              <Input
                label="ชื่อร้าน"
                disabled={!isEdit}
                placeholder="ชื่อร้าน"
                status="primary"
                id="name"
                size="large"
                style={
                  isEdit ? undefined : {borderColor: '#0495EE', borderWidth: 2}
                }
                textStyle={isEdit ? undefined : {color: '#000000'}}
                onChange={e =>
                  formik.setFieldValue('name', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('name')}
                value={formik.values.name}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
             
              <Input
                label="รายละเอียด"
                disabled={!isEdit}
                placeholder="รายละเอียด"
                status="primary"
                id="details"
                size="large"
                style={
                  isEdit ? undefined : {borderColor: '#0495EE', borderWidth: 2}
                }
                textStyle={isEdit ? undefined : {color: '#000000'}}
                onChange={e =>
                  formik.setFieldValue('details', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('details')}
                value={formik.values.details}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.details && formik.errors.details
                        ? formik.errors.details
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
              
            
            {isEdit && (
                <Button
                  size="large"
                  style={{width: 310, marginTop: 20}}
                  onPress={() => formik.handleSubmit()}>
                  บันทึก
                </Button>
              )}
  </View>
</View>
           
        </>
      )}
    </Layout>
  );
};

export default StoreScreen;
