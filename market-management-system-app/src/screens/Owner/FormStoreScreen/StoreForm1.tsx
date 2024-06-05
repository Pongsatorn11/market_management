import {
  Button,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import {Props} from '@ui-kitten/components/devsupport/services/props/props.service';
import {useFormik} from 'formik';
import {TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';
import ImgTag from '../../../components/ImgTag';
import {
  Callback,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import StackHeader from '../../../components/StackHeader';
import {useEffect, useState} from 'react';
import {axiosInstance} from '../../../axiosRequest';
import {areaSelect} from '../../../constant';
import {IStore} from '../../../interfaces/store.interface';
import { IResponseFetchData } from '../../../interfaces/responseApi.interface';

interface ICreateStoreForm {
  imagePath: string;
  name: string;
  area: string;
  details: string;
}

const validationSchema = Yup.object({
  imagePath: Yup.string(),
  name: Yup.string()
    .min(3, 'กรุณากรอกอักขระ 3 ตัวขึ้นไป')
    .max(30, 'กรุณากรอกอักขระไม่เกิน 30 ตัวอักษร')
    .required('กรุณากรอกชื่อร้านค้า'),
  area: Yup.string().required('กรุณาเลือกพื้นที่'),
  details: Yup.string()
    .min(8, 'กรุณากรอกอักขระ 8 ตัวขึ้นไป')
    .required('กรุณากรอกรายละเอียด'),
});

const StoreForm1: React.FC<Props> = ({route, navigation}: any) => {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>();
  const [listArea, setListArea] = useState<string[]>();

  useEffect(() => {
    const fetchArea = async () => {
      const response = await axiosInstance.get<IResponseFetchData<IStore>>('/stores/get-stores?page=1&perPage=42');
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
      imagePath: '',
      name: '',
      area: '',
      details: '',
    } as ICreateStoreForm,
    validationSchema: validationSchema,
    onSubmit: async (values: ICreateStoreForm) => {
      navigation.navigate('StoreFormNext', {
        isUpdate: route.params ? true : false,
        ...route.params,
        ...values,
      });
    },
  });

  const handleSelect = (index: any) => {
    formik.setFieldValue('area', areaSelect[index?.row]);
  };

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
          const responseUploadImage = await axiosInstance.post('/uploads', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          formik.setFieldValue('imagePath', responseUploadImage.data.filePath);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  return (
    <Layout style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
      <StackHeader navigation={navigation} />
      <View style={{alignItems: 'center', flex: 1}}>
        <TouchableOpacity onPress={() => openImagePicker()}>
          <ImgTag imageUrl={formik.values.imagePath} size={100} />
        </TouchableOpacity>
        <Text category="h2">
          {route.params ? 'แก้ไขร้านค้า' : 'สร้างร้านค้า'}
        </Text>
        <View style={{paddingTop: 10, width: 310}}>
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
                    ชื่อร้านค้า
                  </Text>
                  <Text category="label" status="danger">
                    *
                  </Text>
                </View>
              )
            }}
            placeholder="ชื่อร้านค้า"
            status="primary"
            id="name"
            size="large"
            onChange={e => formik.setFieldValue('name', e.nativeEvent.text)}
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
          <Select
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
                    พื้นที่
                  </Text>
                  <Text category="label" status="danger">
                    *
                  </Text>
                </View>
              )
            }}
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
                disabled={listArea?.includes(area) ? true : false}
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
                    รายละเอียด
                  </Text>
                  <Text category="label" status="danger">
                    *
                  </Text>
                </View>
              )
            }}
            placeholder="รายละเอียด"
            status="primary"
            id="details"
            size="large"
            multiline={true}
            onChange={e => formik.setFieldValue('details', e.nativeEvent.text)}
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
        </View>
        <View style={{paddingTop: 5}}>
          <Button
            size="large"
            style={{width: 310}}
            onPress={() => formik.handleSubmit()}>
            ต่อไป
          </Button>
        </View>
      </View>
    </Layout>
  );
};

export default StoreForm1;
