import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import StoreSvgIcon from '../assets/icons/StoreSVG';
import CalSvgIcon from '../assets/icons/CalSVG';
import SettingSvgIcon from '../assets/icons/SettingSvg';
import CardMoneySvgIcon from '../assets/icons/CardMoneySVG';
import MapSvgIcon from '../assets/icons/MapSVG';
import {Layout, MenuItem, OverflowMenu, Text} from '@ui-kitten/components';
import LogoSvgIcon from '../assets/icons/LogoSVG';
import ImgTag from '../components/ImgTag';

const HomeScreen: React.FC<any> = ({navigation}) => {
  const {user, removeUser} = useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  return (
    <Layout style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <LogoSvgIcon size={120} />
        <OverflowMenu
          visible={visible}
          anchor={() => (
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <ImgTag imageUrl={user?.imagePath} size={70} />
            </TouchableOpacity>
          )}
          onBackdropPress={() => setVisible(false)}>
          <MenuItem
            title="โปรไฟล์"
            onPress={() => navigation.navigate('Profile')}
          />
          <MenuItem title="ออกจากระบบ" onPress={() => removeUser()} />
        </OverflowMenu>
      </View>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckListStores')}
            style={{
              opacity: 0.9,
              borderRadius: 20,
              backgroundColor: '#FF3D71',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
              width: 180,
              height: 180,
            }}>
            <StoreSvgIcon />
            <Text category="h6" style={{color: '#ffffff'}}>
              รายชื่อร้านค้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                user?.isOwner ? 'CalculateLockRent' : 'InvoiceBills',
              )
            }
            style={{
              opacity: 0.9,
              borderRadius: 20,
              backgroundColor: '#3366FF',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
              width: 180,
              height: 180,
            }}>
            <CalSvgIcon />
            <Text category="h6" style={{color: '#ffffff'}}>
              ค่าเช่า
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {user?.isOwner ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('PriceAllDetails')}
              style={{
                opacity: 0.9,
                borderRadius: 20,
                backgroundColor: '#00B383',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                width: 180,
                height: 180,
              }}>
              <SettingSvgIcon />
              <Text category="h6" style={{color: '#ffffff'}}>
                ราคา
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('ReceiptBills')}
              style={{
                opacity: 0.9,
                borderRadius: 20,
                backgroundColor: '#00B383',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                width: 180,
                height: 180,
              }}>
              <SettingSvgIcon />
              <Text category="h6" style={{color: '#ffffff'}}>
                ใบเสร็จ
              </Text>
            </TouchableOpacity>
          )}
          {user?.isOwner ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('PaymentList')}
              style={{
                opacity: 0.9,
                borderRadius: 20,
                backgroundColor: '#FFAA00',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                width: 180,
                height: 180,
              }}>
              <CardMoneySvgIcon />
              <Text category="h6" style={{color: '#ffffff'}}>
                ชำระเงิน
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('MapStore')}
              style={{
                opacity: 0.9,
                borderRadius: 20,
                backgroundColor: '#00D9EA',
                justifyContent: 'center',
                alignItems: 'center',
                width: 180,
                height: 180,
              }}>
              <MapSvgIcon />
              <Text category="h6" style={{color: '#ffffff'}}>
                ผัง
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            opacity: 0.9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginVertical: 5,
          }}>
          {user?.isOwner && (
            <TouchableOpacity
              onPress={() => navigation.navigate('MapStore')}
              style={{
                opacity: 0.9,
                borderRadius: 20,
                backgroundColor: '#00D9EA',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 180,
              }}>
              <MapSvgIcon />
              <Text category="h6" style={{color: '#ffffff'}}>
                ผัง
              </Text>
            </TouchableOpacity>
          )}
          <View style={{flex: 1}} />
        </View>
      </View>
    </Layout>
  );
};

export default HomeScreen;
