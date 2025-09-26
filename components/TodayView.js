// components/TodayView.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import TaskCard from './TaskCard.js';
import { SelectList } from 'react-native-dropdown-select-list'


export default function TodayView({
  styles,
  NAV_HEIGHT,
  showMenu, setShowMenu,
  activeFilter, setActiveFilter,
  newTask, setNewTask, addTask,
  filteredTasks = [], // default to empty array
  toggleTask, toggleImportant,
  title = 'Today',
  dateLabel,
  savedTodoTasks
}) {
  const [searchAllTodoListItem, setSearchAllTodoListItem] = React.useState("");
  const [selected, setSelected] = React.useState("");

  // normalize search string once
  const query = searchAllTodoListItem.trim().toLowerCase();

  // filter tasks (case-insensitive substring match on title)
  const visibleTasks = query.length === 0
    ? filteredTasks
    : filteredTasks.filter(task => {
        const t = (task.title || '').toLowerCase();
        return t.includes(query);
      });


  useEffect(() => {
    console.log({filteredTasks})
    console.log({savedTodoTasks})
  },[savedTodoTasks])

    

  return (
    <View style={styles.innerContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          {/* <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View> */}
        </TouchableOpacity>
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

         <Dropw
          style={styles.addTaskInput}
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        
   
        <View>

<View>
       <TouchableOpacity style={styles.addTaskButton} onPress={addTask} hitSlop={{ top: 10 }}>
          <Text style={styles.addTaskIcon}>+</Text>
        </TouchableOpacity>
</View>
        </View>
      </View>



      <ScrollView style={styles.taskList} >
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onToggleImportant={() => toggleImportant(task.id)}
            styles={styles}
          />
        ))}
      </ScrollView>

    </View>
  );
}
