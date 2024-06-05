import React, {useState} from 'react';
import {
  IndexPath,
  Layout,
  SelectItem,
  Select as SelectUiKitten,
  Text,
} from '@ui-kitten/components';
import { formatDateTimeThai } from '../utils/formatDateTimeThai';

interface Props<T> {
  value?: T;
  onSelect: (value: T | any) => void;
  data?: T[];
  width?: number;
  label?: string;
}

const Select = <T,>({value, onSelect, data, width = 120,label}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>();

  return (
    <SelectUiKitten
      style={{width: width}}
      label={label}
      status="primary"
      size="large"
      placeholder="เลือกพื้นที่"
      selectedIndex={selectedIndex}
      value={value?.toString()}
      onSelect={(index: any) => {
        setSelectedIndex(index);
        onSelect(data ? data[index?.row] : undefined);
      }}>
      {data?.map((item: T, index: number) => (
        <SelectItem title={formatDateTimeThai(item ?? new Date().toISOString() as any )} key={index} />
      ))}
    </SelectUiKitten>
  );
};

export default Select;
