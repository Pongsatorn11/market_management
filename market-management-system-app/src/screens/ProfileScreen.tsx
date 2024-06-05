import { TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Callback,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Button, Input, Layout, Text, Toggle } from '@ui-kitten/components';

import { AuthContext } from '../contexts/AuthContext';
import { axiosInstance } from '../axiosRequest';
import ImgTag from '../components/ImgTag';
import StackHeader from '../components/StackHeader';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Loading from '../components/Loading';
import { useFocusEffect } from '@react-navigation/native';


type Props = {
  navigation: any;
};

interface IUserForm {
  imagePath?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'กรุณากรอกอักขระ 3 ตัวขึ้นไป')
    .max(30, 'กรุณากรอกอักขระไม่เกิน 30 ตัวอักษร')
    .required('กรุณากรอกชื่อผู้ใช้'),
  firstName: Yup.string()
    .min(2, 'กรุณากรอกอักขระ 2 ตัวขึ้นไป')
    .max(50, 'กรุณากรอกอักขระไม่เกิน 50 ตัวอักษร')
    .required('กรุณากรอกชื่อจริง'),
  lastName: Yup.string()
    .min(2, 'กรุณากรอกอักขระ 2 ตัวขึ้นไป')
    .max(50, 'กรุณากรอกอักขระไม่เกิน 50 ตัวอักษร')
    .required('กรุณากรอกนามสกุล'),
  email: Yup.string().email('กรุณากรอกอีเมล')
    .required('กรุณากรอกอีเมล'),
  phoneNumber: Yup.string().matches(
    /^\d{10}$/,
    'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง',
  ).required('กรุณากรอกเบอร์โทรศัพท์'),
  address: Yup.string().required('กรุณากรอกที่อยู่'),
});

const ProfileScreen = ({ navigation }: Props) => {
  const { refreshSelf, user } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);


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
    formik.setValues(user!);
    try {
      const response = await axiosInstance.get(`/stores/${user?.storeId}`)
      // console.log(response.data[0])
    } catch (error) {

    }
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
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
    } as IUserForm,
    validationSchema: validationSchema,
    onSubmit: async (values: IUserForm) => {
      setIsLoading(true);
      try {
        await axiosInstance.put('/users/self', {
          imagePath: values.imagePath,
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          address: values.address,
          phoneNumber: values.phoneNumber,
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'แก้ไขโปรไฟล์สำเร็จ',
          textBody: 'โปรไฟล์ของคุณได้รับการแก้ไขแล้ว',
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

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <StackHeader navigation={navigation}>
            {/* <Text category="h5">โปรไฟล์</Text> */}
          </StackHeader>
          <View style={{ alignItems: 'flex-end', paddingRight: 10 }}>
            <Toggle
              style={{
                margin: 2,
              }}
              status="primary"
              checked={isEdit}
              onChange={() => setIsEdit(!isEdit)}>
              แก้ไขโปรไฟล์
            </Toggle>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              onPress={() => openImagePicker()}
              disabled={!isEdit}>
              <ImgTag imageUrl={formik.values.imagePath} size={100} />
            </TouchableOpacity>
            <View style={{ paddingTop: 10 }}>
              <Text category="h5">{isEdit ? 'แก้ไขโปรไฟล์' : 'โปรไฟล์'}</Text>
            </View>
            <View style={{ paddingTop: 10, width: 310 }}>
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
                        ชื่อผู้ใช้
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                disabled={!isEdit}
                placeholder="ชื่อผู้ใช้"
                status="primary"
                id="username"
                size="large"
                style={
                  isEdit ? undefined : { borderColor: '#0495EE', borderWidth: 2 }
                }
                textStyle={isEdit ? undefined : { color: '#000000' }}
                onChange={e =>
                  formik.setFieldValue('username', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('username')}
                value={formik.values.username}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.username && formik.errors.username
                        ? formik.errors.username
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
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
                        ชื่อจริง
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                disabled={!isEdit}
                placeholder="ชื่อจริง"
                status="primary"
                id="firstName"
                size="large"
                style={
                  isEdit ? undefined : { borderColor: '#0495EE', borderWidth: 2 }
                }
                textStyle={isEdit ? undefined : { color: '#000000' }}
                onChange={e =>
                  formik.setFieldValue('firstName', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('firstName')}
                value={formik.values.firstName}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.firstName && formik.errors.firstName
                        ? formik.errors.firstName
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
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
                        นามสกุล
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                disabled={!isEdit}
                placeholder="นามสกุล"
                status="primary"
                id="lastName"
                size="large"
                style={
                  isEdit ? undefined : { borderColor: '#0495EE', borderWidth: 2 }
                }
                textStyle={isEdit ? undefined : { color: '#000000' }}
                onChange={e =>
                  formik.setFieldValue('lastName', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('lastName')}
                value={formik.values.lastName}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.lastName && formik.errors.lastName
                        ? formik.errors.lastName
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
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
                        อีเมล
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                disabled={!isEdit}
                placeholder="อีเมล"
                status="primary"
                id="email"
                size="large"
                style={
                  isEdit ? undefined : { borderColor: '#0495EE', borderWidth: 2 }
                }
                textStyle={isEdit ? undefined : { color: '#000000' }}
                onChange={e =>
                  formik.setFieldValue('email', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('email')}
                value={formik.values.email}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.email && formik.errors.email
                        ? formik.errors.email
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
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
                        เบอร์โทรศัพท์
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                disabled={!isEdit}
                placeholder="เบอร์โทรศัพท์"
                status="primary"
                id="phoneNumber"
                size="large"
                style={
                  isEdit ? undefined : { borderColor: '#0495EE', borderWidth: 2 }
                }
                textStyle={isEdit ? undefined : { color: '#000000' }}
                onChange={e =>
                  formik.setFieldValue('phoneNumber', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('phoneNumber')}
                value={formik.values.phoneNumber}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? formik.errors.phoneNumber
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
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
                        ที่อยู่
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                disabled={!isEdit}
                placeholder="ที่อยู่"
                status="primary"
                id="address"
                size="large"
                style={
                  isEdit ? undefined : { borderColor: '#0495EE', borderWidth: 2 }
                }
                textStyle={isEdit ? undefined : { color: '#000000' }}
                onChange={e =>
                  formik.setFieldValue('address', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('address')}
                value={formik.values.address}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.address && formik.errors.address
                        ? formik.errors.address
                        : undefined}
                    </Text>
                  </Layout>
                }
              />

              {isEdit ? (
                <Button
                  size="large"
                  style={{ width: 310, marginTop: 20 }}
                  onPress={() => formik.handleSubmit()}>
                  บันทึก
                </Button>
              ) : (
                !user?.isOwner && (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button onPress={() => navigation.navigate('Store')}
                      style={{ backgroundColor: '#33CC99' }}>
                      แก้ไขร้านค้า
                    </Button>
                  </View>
                )
              )}
            </View>
          </View>

        </>
      )}
    </Layout>
  );
};

export default ProfileScreen;
