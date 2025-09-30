import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from "react-native-vector-icons/MaterialIcons";

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
 savedTodoTasks
}) {

  const [completedTaskLength,setCompletedTaskLength] = React.useState(0);
  const [TotalTaskLength,setTaskTaskLength] = React.useState(0);


  useEffect(() => {
  if (savedTodoTasks && savedTodoTasks.length > 0) {
    // Count completed tasks
    const completedCount = savedTodoTasks.filter(task => { 
    if(task.completed === true){
      return true
    }
  } 
    ).length

    setCompletedTaskLength(completedCount);
  }
}, [savedTodoTasks]);


  useEffect(()=>{
    console.log(savedTodoTasks.length)
  },[completedTaskLength])

  return (
    <View style={styles.innerContainer}>
      
       <MaterialIcons name="arrow-back" size={24} color="black" />

      <View style={styles.progressBarBox}>

        {/* Circular Progress Bar */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <CircularProgressBar 
            progress={savedTodoTasks.length > 0 ? Math.round((completedTaskLength / savedTodoTasks.length) * 100) : 0} 
            size={130} 
            strokeWidth={12}
            color="black"
            backgroundColor="white"
          />
        </View>

        <View style={{display:"flex",flexDirection:"column", gap:10,alignItems:"center"}}>

        <View>
          <Text style={{fontSize:19,fontWeight:"900"}}>{completedTaskLength} / 10 Tasks Done</Text>
        </View>

          <View style={{display:"flex",flexDirection:"row", gap:12, alignItems:"center",justifyContent:"center"}}>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:10}}>
              {/* <Icon name="check" size={30} color="green" /> */}
              {/* <Text style={{ fontWeight:"300"}}>Pending</Text> */}
            </View>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center" , gap:10}}>
              {/* <Icon name="arrow-up" size={30} color="red" /> */}
              {/* <Text style={{fontWeight:"300"}}>Missed</Text> */}
            </View>
          </View>

        </View>
      
      </View>

      <View style={styles.tasksCompletionInformationParentBox}>

      <View  style={styles.tasksCompletionInformationBox}>
      <Text style={{color:"black"}}>{completedTaskLength}</Text>  
      <Text style={{color:"black"}}>Completed</Text>
      </View>

      <View  style={styles.tasksCompletionInformationBox}>
      <Text style={{color:"black"}}>{savedTodoTasks.length - completedTaskLength }</Text>  
      <Text style={{color:"black"}}>Pending</Text>
      </View>

      <View  style={styles.tasksCompletionInformationBox}>
      <Text style={{color:"black"}}>1</Text>  
      <Text style={{color:"black"}}>Missed</Text>
      </View>

      </View>

       <View style={styles.progressBarBox}>

       <View style={styles.bottomBarBoxes}>
        <Text style={{color:"white", textAlign:"center"}}>100 Tasks Completed</Text>
      </View>
      
       <View style={styles.bottomBarBoxes}>
        <Text style={{color:"white", textAlign:"center"}}>100 Tasks Completed</Text>
      </View>
      
      </View>
      
   

    </View>
  );
}