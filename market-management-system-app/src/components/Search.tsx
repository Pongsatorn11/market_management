import React from 'react';
import {Input} from '@ui-kitten/components';
import {View} from 'react-native';
import SearchSvgIcon from '../assets/icons/SearchSVG';

interface Props {
  value?: string;
  onChange: (text: string) => void;
}

const Search = ({value = '', onChange}: Props) => {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 5,
      }}>
      <Input
        size="large"
        accessoryRight={<SearchSvgIcon />}
        status="basic"
        placeholder="ค้นหา ชื่อร้าน"
        value={value}
        onChangeText={nextValue => onChange(nextValue)}
      />
    </View>
  );
};

export default Search;
