import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import avatarImg from '../../assets/avatar.png'
import { COLORS } from '../../theme';
import { styles } from './styles';

const AVATAR_DEFAULT = Image.resolveAssetSource(avatarImg).uri;

const SIZES = {
  small: {
    containerSize: 32,
    avatarSize: 28,
  },
  normal: {
    containerSize: 48,
    avatarSize: 42,
  },
}

type Props = {
  imageUri: string | undefined,
  size?: 'small' | 'normal',
}

export function UserPhoto({ imageUri, size = 'normal' }: Props) {
  const { avatarSize, containerSize } = SIZES[size];

  return (
    <LinearGradient
      colors={[ COLORS.PINK, COLORS.YELLOW ]}
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        }
      ]}
    >
      <Image
        source={{ uri: imageUri || AVATAR_DEFAULT }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          }
        ]}
      />
    </LinearGradient>
  );
}
