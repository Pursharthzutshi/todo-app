// components/NavigationBar.js
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles';

export default function NavigationBar({  currentView, setCurrentView }) {
  const items = [
    { key: 'today', label: 'Today' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'mytasks', label: 'My Tasks' },
    { key: 'todo', label: 'To-Do' },
  ];

  const [test, setTest] = React.useState(false);

  // useEffect(()=>{
  //   console.log(test)
  // },[test])

  return (
    <View style={styles.navigation}>
      {items.map((item) => (
          <div onClick={() => setCurrentView(item.key)}>
          <Text onClick={()=> setTest()} style={[styles.navText, currentView === item.key && styles.activeNavText]}>
            {item.label}
          </Text>
          </div>
      ))}
    </View>
  );
}
