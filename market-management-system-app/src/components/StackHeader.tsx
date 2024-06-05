import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {TouchableOpacity, View} from 'react-native';
import ArrowLeftSvgIcon from '../assets/icons/ArrowLeftSVG';

interface Props {
  navigation: any;
  titleBack?: string;
  children?: JSX.Element;
}

const StackHeader = ({navigation, titleBack = 'ย้อนกลับ', children}: Props) => {
  return (
    <Layout
      style={{
        flexDirection: 'row',
        width: '100%',
        paddingTop: 15,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <ArrowLeftSvgIcon />
        {/* <Text category="h5">{titleBack}</Text> */}
      </TouchableOpacity>
      <View>
        {children}
      </View>
    </Layout>
  );
};

export default StackHeader;
