import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import TaskCard from './TaskCard.js';
import { SelectList } from 'react-native-dropdown-select-list';
import getVisibleTasks from './VisibleTasks.js';
import AllDays from '../AllDays.js';
import CalendarModal from './CalendarModal.js';

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
  setTasks,
  dayFilter,
  setDayFilter,
  Days,
  selectedDueDateKey,
  setSelectedDueDateKey,
  selectedDueDateLabel,
  dayCounts = {}
}) {
  const priorityOptions = [
    { key: '1', value: 'Urgent' },
    { key: '2', value: 'High' },
    { key: '3', value: 'Medium' },
    { key: '4', value: 'Low' },
    { key: '5', value: 'None' },
  ];

  const selectedDayDetails = useMemo(() => {
    if (dayFilter === 'all') return null;
    return Days.find(day => String(day.id) === String(dayFilter));
  }, [Days, dayFilter]);

  const pageTitle = useMemo(() => {
    switch (activeFilter) {
      case 'today':
        return 'Today';
      case 'important':
        return 'Important';
      case 'planned':
        return 'Planned';
      case 'all':
        return 'All';
      default:
        return title || 'Tasks';
    }
  }, [activeFilter, title]);

  const headerSubtitle = useMemo(() => {
    const name = selectedDayDetails?.fullName || selectedDayDetails?.name;

    if (activeFilter === 'planned') {
      if (dayFilter === 'all') return 'All planned tasks';
      return name ? `Planned tasks for ${name}` : 'Planned tasks';
    }

    if (activeFilter === 'important') {
      if (dayFilter === 'all') return 'All important tasks';
      return name ? `Important tasks for ${name}` : 'Important tasks';
    }

    if (activeFilter === 'all') {
      if (dayFilter === 'all') return 'All tasks';
      return name ? `Tasks for ${name}` : 'Tasks';
    }

    return dateLabel || '';
  }, [activeFilter, dayFilter, dateLabel, selectedDayDetails]);

  const handleFilterPress = (filterKey) => {
    setActiveFilter(filterKey);
  };


  // useEffect(() => {
  //   console.log({ filteredTasks });
  //   console.log({ savedTodoTasks });
  // }, [savedTodoTasks, filteredTasks]);

  const [isCalendarVisible, setCalendarVisible] = useState(false);

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
        <Text style={styles.mainTitle}>{pageTitle}</Text>
        <Text style={styles.dateText}>{headerSubtitle}</Text>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Today', 'Important', 'Planned'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter.toLowerCase() === filter.toLowerCase() && styles.activeFilter
            ]}
            onPress={() => handleFilterPress(filter.toLowerCase())}
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

      <AllDays
        Days={Days}
        dayFilter={dayFilter}
        setDayFilter={setDayFilter}
        dayCounts={dayCounts}
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
          setSelected={setSelectedPriority}
          data={priorityOptions}
          save="value"
          placeholder="Priority"
        />
        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          style={{
            marginTop: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ color: '#6b7280', fontWeight: '500' }}>Due date</Text>
          <Text style={{ color: '#4F46E5', fontWeight: '600' }}>
            {selectedDueDateLabel}
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity style={styles.addTaskButton} onPress={addTask} hitSlop={{ top: 10 }}>
            <Text style={styles.addTaskIcon}>Add a New Todo Task <Text style={styles.plusIcon}> +</Text></Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.taskList}>
        
      <TextInput
        style={styles.searchTodoInput}
        placeholder="Search Your Todo's"
        placeholderTextColor="#999"
        value={searchAllTodoListItem}
        onChangeText={setSearchAllTodoListItem}
        returnKeyType="search"
      />
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

      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelect={value => setSelectedDueDateKey(value)}
        selectedDateISO={selectedDueDateKey === 'none' ? null : selectedDueDateKey}
      />
    </View>
  );
}
