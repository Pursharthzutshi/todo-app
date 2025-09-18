// App.js
import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import TodayView from './components/TodayView';
import TodoListView from './components/TodoListView';
import TasksView from './components/TasksView';
import NavigationBar from './components/NavigationBar';
import styles from './styles';

const NAV_HEIGHT = 60;

export default function App() {
  const [currentView, setCurrentView] = useState('today'); // 'today'|'tasks'|'mytasks'|'todo'
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all'|'today'|'important'|'planned'
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Buy milk', completed: false, important: false, dueDate: 'Sep 18', time: '10:00' },
    { id: '2', title: 'Fix bug', completed: true, important: true, dueDate: 'Sep 17' },
    { id: '3', title: 'Call mom', completed: false, important: true },
  ]);

  function addTask() {
    const trimmed = (newTask || '').trim();
    if (!trimmed) return;
    const t = { id: String(Date.now()), title: trimmed, completed: false, important: false };
    setTasks(prev => [t, ...prev]);
    setNewTask('');
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function toggleImportant(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, important: !t.important } : t));
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
  };

  function renderCurrentView() {
    switch (currentView) {
      case 'today':
        return <TodayView {...commonProps} dateLabel={new Date().toDateString()} />;
      case 'mytasks':
        return <TodayView {...commonProps} title="My Tasks" dateLabel={new Date().toDateString()} />;
      case 'todo':
        return <TodoListView {...commonProps} />;
      case 'tasks':
        return <TasksView {...commonProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCurrentView={setCurrentView} />;
      default:
        return <TodayView {...commonProps} dateLabel={new Date().toDateString()} />;
    }
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      {renderCurrentView()}
      <NavigationBar styles={styles} currentView={currentView} setCurrentView={setCurrentView} NAV_HEIGHT={NAV_HEIGHT} />
    </SafeAreaView>
  );
}
