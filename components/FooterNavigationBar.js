// components/NavigationBar.js
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import defaultStyles from '../styles';

export default function FooterNavigationBar({
  currentView,
  setCurrentView,
  styles = defaultStyles,
}) {
  
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'progress', label: 'Progress' },
    { key: 'settings', label: 'Settings' },
  ];

  useEffect(()=>{
    console.log("Current View in FooterNavigationBar:", currentView);
  })

  return (
    <View style={styles.FooterNavigationBar}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.navButton,
            currentView === item.key && styles.activeNavButton,
          ]}
          onPress={() => setCurrentView(item.key)}
        >
          <Text
            style={[styles.navText, currentView === item.key && styles.activeNavText]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
