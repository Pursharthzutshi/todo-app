import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg, { Circle } from 'react-native-svg';

const CircularProgressBar = ({ progress = 75, size = 120, strokeWidth = 8, color = "#4CAF50", backgroundColor = "#E0E0E0" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Progress Text */}
      <View style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
        }}>
          {progress}%
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
          marginTop: 2,
        }}>
          Complete
        </Text>
      </View>
    </View>
  );
};

export default function ProgressPage({
  styles,
}) {
  return (
    <View style={styles.innerContainer}>

      <View style={styles.progressBarBox}>

        {/* Circular Progress Bar */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <CircularProgressBar 
            progress={75} 
            size={110} 
            strokeWidth={12}
            color="#2F80ED"
            backgroundColor="white"
          />
        </View>

        <View style={{display:"flex",flexDirection:"column", gap:10,alignItems:"center"}}>

        <View>
          <Text style={{fontWeight:"900"}}>6 / 10 Tasks Done</Text>
        </View>

          <View style={{display:"flex",flexDirection:"row", gap:12, alignItems:"center",justifyContent:"center"}}>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:10}}>
              <Icon name="check" size={30} color="green" />
              <Text style={{ fontWeight:"300"}}>Pending</Text>
            </View>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center" , gap:10}}>
              <Icon name="arrow-up" size={30} color="red" />
              <Text style={{fontWeight:"300"}}>Missed</Text>
            </View>
          </View>

        </View>
      
      </View>
      
      <View style={styles.progressBarBox}>

      <View  style={styles.totalTasksCompleteBox}>
      <Text style={{fontWeight:"300"}}>1</Text>  
      <Text style={{fontWeight:"300"}}>Completed</Text>
      </View>

      <View  style={styles.totalTasksCompleteBox}>
      <Text style={{fontWeight:"300"}}>3</Text>  
      <Text style={{fontWeight:"300"}}>Pending</Text>
      </View>

      <View  style={styles.totalTasksCompleteBox}>
      <Text style={{fontWeight:"300"}}>1</Text>  
      <Text style={{fontWeight:"300"}}>Missed</Text>
      </View>

      
      </View>

       <View style={styles.progressBarBox}>


       <View style={styles.totalTasksCompleteBox}>
              <Icon name="check" size={30} color="green" />
        
        <Text style={styles.totalTasksCompleteBoxTitle}>5 Day Streak</Text>
      
      </View>

       <View style={styles.totalTasksCompleteBox}>
                      <Icon name="check" size={30} color="green" />

        <Text style={styles.totalTasksCompleteBoxTitle}>100 Tasks Completed</Text>
      
      </View>
      
      </View>

    </View>
  );
}