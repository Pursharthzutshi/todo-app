// App.js

import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import HomePage from './components/HomePage';
import ProgressPage from './components/ProgressPage';
import WishlistPage from './components/WishlistPage';
import SettingsPage from './components/SettingsPage';

// Navigation
import FooterNavigationBar from './components/FooterNavigationBar';

// Styles
import styles from './styles';

// Constants
const NAV_HEIGHT = 60;
const STORAGE_KEY = 'TASKS';

export default function App() {
  const [currentView, setCurrentView] = useState('today');
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchAllTodoListItem, setSearchAllTodoListItem] = useState('');
  const [savedTodoTasks, setSavedTodoTasks] = useState([]);
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Buy milk', completed: false, important: false, dueDate: 'Sep 18', time: '10:00' },
    { id: '2', title: 'Fix bug', completed: true, important: true, dueDate: 'Sep 17' },
    { id: '3', title: 'Call mom', completed: false, important: true },
  ]);

  // Load tasks from AsyncStorage when app mounts
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

  // Add new task
  async function addTask() {
    try {
      const trimmed = (newTask || '').trim();
      if (!trimmed) return;

      const taskItem = {
        id: String(Date.now()),
        title: trimmed,
        completed: false,
        important: false,
        wishlist: false,
        priority: selectedPriority,
      };

      setTasks(prev => {
        const newList = [taskItem, ...prev];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => {
          console.error('Failed to save tasks to AsyncStorage', e);
        });
        setSavedTodoTasks(newList);
        return newList;
      });

      setNewTask('');
    } catch (err) {
      console.error('addTask error:', err);
    }
  }

  // Toggle completion
  function toggleTask(id) {
    setTasks(prev => {
      const newList = prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => console.error(e));
      setSavedTodoTasks(newList);
      return newList;
    });
  }

  // Toggle wishlist
  function toggleWishlist(id) {
    setTasks(prev => {
      const newList = prev.map(t => (t.id === id ? { ...t, wishlist: !t.wishlist } : t));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => console.error(e));
      setSavedTodoTasks(newList);
      return newList;
    });
  }

  // Toggle important
  function toggleImportant(id) {
    setTasks(prev => {
      const newList = prev.map(t => (t.id === id ? { ...t, important: !t.important } : t));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => console.error(e));
      setSavedTodoTasks(newList);
      return newList;
    });
  }

  // Filter tasks based on activeFilter and search
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Filter by type
    if (activeFilter === 'today') {
      const todayStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric' });
      list = list.filter(t => t.dueDate && t.dueDate.includes(todayStr));
    } else if (activeFilter === 'important') {
      list = list.filter(t => t.important);
    } else if (activeFilter === 'planned') {
      list = list.filter(t => !!t.dueDate);
    }

    // Filter by search query (TasksView search)
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }

    return list;
  }, [tasks, activeFilter, searchQuery]);

  // Common props shared across all pages
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
    toggleWishlist,
    savedTodoTasks,
    selectedPriority,
    setSelectedPriority,
    searchAllTodoListItem,
    setSearchAllTodoListItem,
    setTasks,
  };

  // Render based on current view
  function renderCurrentView() {
    switch (currentView) {
      case 'today':
        return <HomePage {...commonProps} dateLabel={new Date().toDateString()} />;
      case 'wishlist':
        return <WishlistPage {...commonProps} />;
      case 'progress':
        return <ProgressPage {...commonProps} />;
      case 'settings':
        return <SettingsPage {...commonProps}  />;
      default:
        return <HomePage {...commonProps} dateLabel={new Date().toDateString()} />;
    }
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      {renderCurrentView()}
      <FooterNavigationBar
        styles={styles}
        currentView={currentView}
        setCurrentView={setCurrentView}
        NAV_HEIGHT={NAV_HEIGHT}
      />
    </SafeAreaView>
  );
}
