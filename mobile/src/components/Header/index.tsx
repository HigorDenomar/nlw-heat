import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import LogoImg from '../../assets/logo.svg';
import { useAuth } from '../../contexts/auth';
import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <LogoImg />

      {user && (
        <View style={styles.logOutButton}>
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.logOutText}>Sair</Text>
          </TouchableOpacity>
        
          <UserPhoto
            imageUri={user?.avatar_url}
          />
        </View>
      )}
    </View>
  );
}
