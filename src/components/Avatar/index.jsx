import React from 'react';
import styles from "./avatar.module.less";
import { classnames } from '../utils';
import imageUrl from '../../assets/images/avatar.png';
import imageUrl2 from '../../assets/images/avatar-dark.png';
import { useGlobal } from '../../chat/context';

export const Avatar = (props) => {
  const { src, altText, className, size, circle } = props;
  const { options } = useGlobal();
  const defaultImage = options.general.theme !== 'light' ? imageUrl : imageUrl2;

  return (
    <div className={classnames(styles.avatar, circle && styles.circle, className)} style={{ width: size, height: size }}>
      <img src={src ? src : defaultImage} alt={altText} />
    </div>
  );
};

Avatar.defaultProps = {
  src: null,
  altText: 'User Avatar',
  circle: true,
};
