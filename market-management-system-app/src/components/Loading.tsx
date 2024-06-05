import React from 'react';
import {Spinner} from '@ui-kitten/components';
import {View} from 'react-native';

const Loading = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        width:"100%",
        height:"100%"
      }}>
      <Spinner status="info" size="giant" />
    </View>
  );
};

export default Loading;
