import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { useFormik } from 'formik';
import { View } from 'react-native';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

import StackHeader from '../../../components/StackHeader';
import { axiosInstance } from '../../../axiosRequest';
import Loading from '../../../components/Loading';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import EyeSvgIcon from '../../../assets/icons/EyeSVG';
import EyeOffSvgIcon from '../../../assets/icons/EyeOffSVG';

interface ICreateStoreForm {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  address: string;
  phoneNumber: string;
}

const StoreForm2: React.FC<Props> = ({ route, navigation }: any) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          `/users/store/${route.params.id}`,
        );
        formik.setValues({
          ...response.data[0],
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
      address: '',
      phoneNumber: '',
    } as ICreateStoreForm,
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'กรุณากรอกอักขระ 3 ตัวขึ้นไป')
        .max(30, 'กรุณากรอกอักขระไม่เกิน 30 ตัวอักษร')
        .required('กรุณากรอกชื่อผู้ใช้'),
      password: route.params.isUpdate
        ? Yup.string()
        : Yup.string()
          .min(8, 'กรุณากรอกอักขระ 8 ตัวขึ้นไป')
          .required('กรุณากรอกรหัสผ่าน'),
      // confirmPassword: Yup.string()
      //   .oneOf([Yup.ref('password'), null!], 'รหัสผ่านไม่ตรงกัน')
      //   .required('กรุณากรอกรหัสผ่านอีกครั้ง'),
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง')
        .required('กรุณากรอกเบอร์โทรศัพท์'),
      firstName: Yup.string()
        .min(2, 'กรุณากรอกอักขระ 2 ตัวขึ้นไป')
        .max(50, 'กรุณากรอกอักขระไม่เกิน 50 ตัวอักษร')
        .required('กรุณากรอกชื่อจริง'),
      lastName: Yup.string()
        .min(2, 'กรุณากรอกอักขระ 2 ตัวขึ้นไป')
        .max(50, 'กรุณากรอกอักขระไม่เกิน 50 ตัวอักษร')
        .required('กรุณากรอกนามสกุล'),
      email: Yup.string().email('กรุณากรอกอีเมล').required('กรุณากรอกอีเมล'),
      address: Yup.string().required('กรุณากรอกที่อยู่'),
    }),
    onSubmit: async (values: ICreateStoreForm) => {
      setIsLoading(true);
      try {
        await axiosInstance.request({
          method: route.params.isUpdate ? 'put' : 'post',
          url: route.params.isUpdate
            ? '/stores/update-store'
            : '/stores/create-store',
          data: {
            ...values,
            ...route.params,
          },
        });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'สร้างร้านค้าสำเร็จ',
          textBody: 'เริ่มใช้งานร้านค้าของคุณได้เลย',
          autoClose: 3000,
          button: 'close',
          onHide: () => {
            return navigation.navigate('CheckListStores');
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
            return navigation.navigate('CheckListStores');
          },
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
          <StackHeader navigation={navigation} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{ paddingTop: 30, width: 310 }}>
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
                placeholder="ชื่อจริง"
                status="primary"
                id="firstName"
                size="large"
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
                placeholder="นามสกุล"
                status="primary"
                id="lastName"
                size="large"
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
              {!route.params.isUpdate && (
                <>
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
                            รหัสผ่าน
                          </Text>
                          <Text category="label" status="danger">
                            *
                          </Text>
                        </View>
                      )
                    }}
                    placeholder="รหัสผ่าน"
                    status="primary"
                    id="password"
                    size="large"
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
                    accessoryRight={renderIcon}
                    secureTextEntry={secureTextEntry}
                  />
                </>
              )}
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
                placeholder="อีเมล"
                status="primary"
                id="email"
                size="large"
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
                        ที่อยู่
                      </Text>
                      <Text category="label" status="danger">
                        *
                      </Text>
                    </View>
                  )
                }}
                placeholder="ที่อยู่"
                status="primary"
                id="address"
                size="large"
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
                placeholder="เบอร์โทรศัพท์"
                status="primary"
                id="phoneNumber"
                size="large"
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
            </View>
            <View style={{ marginTop: 30 }}>
              <Button
                size="large"
                style={{ width: 310 }}
                onPress={() => formik.handleSubmit()}>
                {route.params.isUpdate ? 'แก้ไข' : 'สร้างร้านค้า'}
              </Button>
            </View>
          </View>
        </>
      )}
    </Layout>
  );
};

export default StoreForm2;
