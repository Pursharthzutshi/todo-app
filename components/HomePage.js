// components/.js
import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import TaskCard from './TaskCard.js';
import { SelectList } from 'react-native-dropdown-select-list';
import getVisibleTasks from './VisibleTasks.js';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export default function HomePage({
  styles,
  NAV_HEIGHT,
  showMenu, setShowMenu,
  activeFilter, setActiveFilter,
  newTask, setNewTask, addTask,
  filteredTasks = [],
  toggleTask,
  toggleImportant,
  toggleWishlist,
  title = 'Today',
  dateLabel,
  savedTodoTasks,
  selectedPriority,
  setSelectedPriority,
  searchAllTodoListItem,
  setSearchAllTodoListItem,
  setTasks
}) {
  const data = [
    { key: '1', value: 'High' },
    { key: '2', value: 'Medium' },
    { key: '3', value: 'Low' },
  ];

  useEffect(() => {
    console.log({ filteredTasks });
    console.log({ savedTodoTasks });
  }, [savedTodoTasks, filteredTasks]);

  const tasksToShow = useMemo(
    () => getVisibleTasks(filteredTasks, searchAllTodoListItem),
    [filteredTasks, searchAllTodoListItem]
  );

  return (
    <View style={styles.innerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(!showMenu)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
        <TouchableOpacity style={styles.searchButton} hitSlop={{ top: 10 }}>
          <Text style={styles.searchIcon}></Text>
        </TouchableOpacity>
        
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>{title}</Text>
        <Text style={styles.dateText}>{dateLabel || ''}</Text>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Today', 'Important', 'Planned'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter.toLowerCase() === filter.toLowerCase() && styles.activeFilter
            ]}
            onPress={() => setActiveFilter(filter.toLowerCase())}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[
              styles.filterText,
              activeFilter.toLowerCase() === filter.toLowerCase() && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.searchTodoInput}
        placeholder="Search Your Todo's"
        placeholderTextColor="#999"
        value={searchAllTodoListItem}
        onChangeText={setSearchAllTodoListItem}
        returnKeyType="search"
      />

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.addTaskInput}
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <SelectList
          setSelected={(val) => setSelectedPriority(val)}
          data={data}
          save="value"
        />
        <View>
          <TouchableOpacity style={styles.addTaskButton} onPress={addTask} hitSlop={{ top: 10 }}>
            <Text style={styles.addTaskIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.taskList}>
        
        {tasksToShow.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            setTasks={setTasks}
            onToggle={() => toggleTask(task.id)}
            onToggleImportant={() => toggleImportant(task.id)}
            onToggleWishlist={() => toggleWishlist(task.id)}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
}
