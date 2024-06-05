import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, IconElement, Input, Layout, Text } from '@ui-kitten/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { axiosInstance } from '../axiosRequest';
import { AuthContext } from '../contexts/AuthContext';
import LogoSvgIcon from '../assets/icons/LogoSVG';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Loading from '../components/Loading';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import EyeSvgIcon from '../assets/icons/EyeSVG';
import EyeOffSvgIcon from '../assets/icons/EyeOffSVG';

interface Props extends NativeStackScreenProps<any, any> { }

export interface ILoginForm {
  username: string;
  password: string;
}

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'กรุณากรอกอักขระ 3 ตัวขึ้นไป')
    .max(30, 'กรุณากรอกอักขระไม่เกิน 30 ตัวอักษร')
    .required('กรุณากรอกชื่อผู้ใช้'),
  password: Yup.string()
    .min(8, 'กรุณากรอกอักขระ 8 ตัวขึ้นไป')
    .required('กรุณากรอกรหัสผ่าน'),
});

const LoginScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { saveUser } = useContext(AuthContext);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    } as ILoginForm,
    validationSchema: validationSchema,
    onSubmit: async (values: ILoginForm) => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post<{ token: string }>(
          '/users/login',
          values,
        );
        saveUser(response.data.token);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'เข้าสู่ระบบสำเร็จ',
          textBody: 'เริ่มใช้งานระบบได้เลย',
          autoClose: 3000,
          button: 'close',
          onHide: () => {
            return navigation.navigate('Home');
          },
        });
      } catch (e) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          textBody: 'กรุณาตรวจสอบชื่อผู้ใช้หรือรหัสผ่าน',
          autoClose: 3000,
          button: 'close',
        });
      }
      setIsLoading(false);
    },
  });

  const renderIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={() => {
      setSecureTextEntry(!secureTextEntry);
    }}>
      {
        secureTextEntry ?
          <EyeSvgIcon /> :
          <EyeOffSvgIcon />
      }
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <LogoSvgIcon size={300} />
            <Text category="h2">เข้าสู่ระบบ</Text>
            <View style={{ paddingTop: 25, width: 310 }}>
              <Input
                label="ชื่อผู้ใช้"
                placeholder="ชื่อผู้ใช้"
                status="primary"
                id="username"
                size="large"
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
            </View>
            <View style={{ paddingTop: 10, width: 310 }}>
              <Input
                label="รหัสผ่าน"
                placeholder="รหัสผ่าน"
                status="primary"
                id="password"
                size="large"
                accessoryRight={renderIcon}
                secureTextEntry={secureTextEntry}
                onChange={e =>
                  formik.setFieldValue('password', e.nativeEvent.text)
                }
                onBlur={() => formik.setFieldTouched('password')}
                value={formik.values.password}
                caption={
                  <Layout>
                    <Text category="p2" status="danger">
                      {formik.touched.password && formik.errors.password
                        ? formik.errors.password
                        : undefined}
                    </Text>
                  </Layout>
                }
              />
            </View>
            <View style={{ paddingTop: 25 }}>
              <Button
                size="large"
                style={{ width: 310 }}
                onPress={() => formik.handleSubmit()}>
                เข้าสู่ระบบ
              </Button>
            </View>
            <View
              style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ fontSize: 20 }}>สร้างบัญชีใหม่</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </Layout>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
});