import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

type EnumValue<T> = {
  value: T;
};

type Props<T> = {
  value: T;
  enumValues: EnumValue<T>[] | any;
  onChange: (value: T) => void;
};

const PickerComponents = <T extends string>(props: Props<T>) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectValue = (value: T) => {
    setModalVisible(false);
    props.onChange(value);
  };

  const renderItem = ({item}: {item: EnumValue<T>}) => (
    <TouchableOpacity
      onPress={() => handleSelectValue(item.value)}
      style={styles.option}>
      <Text>{item.value?.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.selectedValue}>{props.value?.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={props.enumValues}
              renderItem={renderItem}
              keyExtractor={item => item.value}
            />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default PickerComponents;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedValue: {
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 24,
    backgroundColor: '#D9D9D9',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
    width: '80%',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
  },
});
