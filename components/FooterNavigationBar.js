// components/NavigationBar.js
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { useEffect } from 'react';

export default function FooterNavigationBar({  currentView, setCurrentView }) {
  
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'progress', label: 'Progress' },
    { key: 'todo', label: 'Settings' },
  ];

  useEffect(()=>{
    console.log("Current View in FooterNavigationBar:", currentView);
  })

  return (
    <View style={styles.FooterNavigationBar}>
      {items.map((item) => (
          <TouchableOpacity onPress={() => setCurrentView(item.key)}>
          <Text style={[styles.navText, currentView === item.key && styles.activeNavText]}>
            {item.label}
          </Text>
          </TouchableOpacity>
      ))}
    </View>
  );
}
