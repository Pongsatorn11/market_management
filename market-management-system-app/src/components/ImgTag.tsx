import React from 'react';
import {Layout} from '@ui-kitten/components';
import AccountCircleIcon from '../assets/icons/AccountCircleIconSVG';
import {Image} from 'react-native';
import { URL_SERVER } from '../constant';

interface Props {
  imageUrl?: string;
  size?: number;
  noBorderRadius?: boolean;
}

const ImgTag = (props: Props) => {
  return (
      <Layout
        style={{
          width: props.size,
          height: props.size,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: props.noBorderRadius ? undefined : 100,
        }}>
        {props.imageUrl ? (
          <Image
            src={`${URL_SERVER}/uploads?file=${props.imageUrl}`}
            alt="Uploaded"
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        ) : (
          <AccountCircleIcon size={props.size ?? 70} />
        )}
      </Layout>
  );
};

export default ImgTag;
