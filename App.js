// App.js (only showing relevant parts / replacements)

import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import TodayView from './components/TodayView';
import ProgressPage from './components/ProgressPage';
import TasksView from './components/TasksView';
import FooterNavigationBar from './components/FooterNavigationBar';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAV_HEIGHT = 60;
const STORAGE_KEY = 'TASKS';

export default function App() {
  const [currentView, setCurrentView] = useState('today');
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [savedTodoTasks, setSavedTodoTasks] = useState([]); // keep this an array
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Buy milk', completed: false, important: false, dueDate: 'Sep 18', time: '10:00' },
    { id: '2', title: 'Fix bug', completed: true, important: true, dueDate: 'Sep 17' },
    { id: '3', title: 'Call mom', completed: false, important: true },
  ]);

  // load tasks from AsyncStorage when app mounts
  useEffect(() => {
    async function loadTasks() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setTasks(parsed);
            setSavedTodoTasks(parsed);
          } else {
            console.warn('Stored tasks is not an array, ignoring.');
          }
        }
      } catch (err) {
        console.error('Failed to load tasks from AsyncStorage', err);
      }
    }
    loadTasks();
  }, []);

  async function addTask() {
    try {
      const trimmed = (newTask || '').trim();
      if (!trimmed) return;

      const taskItem = { id: String(Date.now()), title: trimmed, completed: false, important: false };
      // update tasks state based on previous value and get new list
      setTasks(prev => {
        const newList = [taskItem, ...prev];
        // persist the new list
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => {
          console.error('Failed to save tasks to AsyncStorage', e);
        });
        // also update savedTodoTasks state
        setSavedTodoTasks(newList);
        return newList;
      });

      setNewTask('');
    } catch (err) {
      console.error('addTask error:', err);
    }
  }

  // Toggle and important handlers should also persist the updated list
  function toggleTask(id) {
    setTasks(prev => {
      const newList = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => console.error(e));
      setSavedTodoTasks(newList);
      return newList;
    });
  }

  function toggleImportant(id) {
    setTasks(prev => {
      const newList = prev.map(t => t.id === id ? { ...t, important: !t.important } : t);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => console.error(e));
      setSavedTodoTasks(newList);
      return newList;
    });
  } 

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // filter by activeFilter
    if (activeFilter === 'today') {
      // simple placeholder: treat dueDate presence as "today" if equals current day string (customize)
      const todayStr = new Date().toDateString();
      list = list.filter(t => t.dueDate && t.dueDate.includes(new Date().toLocaleString('en-US', { month: 'short' })));
    } else if (activeFilter === 'important') {
      list = list.filter(t => t.important);
    } else if (activeFilter === 'planned') {
      list = list.filter(t => !!t.dueDate);
    }

    // search filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }

    return list;
  }, [tasks, activeFilter, searchQuery]);

  const commonProps = {
    styles,
    NAV_HEIGHT,
    showMenu,
    setShowMenu,
    activeFilter,
    setActiveFilter,
    newTask,
    setNewTask,
    addTask,
    filteredTasks,
    toggleTask,
    toggleImportant,
    savedTodoTasks
  };

  function renderCurrentView() {
    switch (currentView) {
      case 'today':
        return <TodayView {...commonProps} dateLabel={new Date().toDateString()} />;
      case 'mytasks':
        return <TodayView {...commonProps} title="My Tasks" dateLabel={new Date().toDateString()} />;
      case 'progress':
        return <ProgressPage {...commonProps} />;
      case 'tasks':
        return <TasksView {...commonProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCurrentView={setCurrentView} />;
      default:
        return <TodayView {...commonProps} dateLabel={new Date().toDateString()} />;
    }
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      {renderCurrentView()}
      <FooterNavigationBar styles={styles} currentView={currentView} setCurrentView={setCurrentView} NAV_HEIGHT={NAV_HEIGHT} />
    </SafeAreaView>
  );
}
