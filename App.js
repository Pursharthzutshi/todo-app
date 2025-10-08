import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
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
  // App settings
  const [theme, setTheme] = useState('Light');
  const [fontSize, setFontSize] = useState('Medium');
  
  // Force re-render when theme or font size changes
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const Days = [
    { id: 0, name: 'Sun' },
    { id: 1, name: 'Mon' },
    { id: 2, name: 'Tue' },
    { id: 3, name: 'Wed' },
    { id: 4, name: 'Thu' },
    { id: 5, name: 'Fri' },
    { id: 6, name: 'Sat' },
  ];

  // Fixed: Use getDay() instead of getDate() to get day of week (0-6)
  const [currentDay, setCurrentDay] = useState(() => new Date().getDay());

  console.log("currentDay", currentDay);

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

  // Load tasks and settings from AsyncStorage when app mounts
  useEffect(() => {
    async function loadData() {
      try {
        // Load tasks
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
        
        // Load settings
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        
        if (savedTheme) setTheme(savedTheme);
        if (savedFontSize) setFontSize(savedFontSize);
      } catch (err) {
        console.error('Failed to load data from AsyncStorage', err);
      }
    }
    loadData();
  }, []);

  console.log("day", new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  // Add new task
  async function addTask() {
    try {
      const trimmed = (newTask || '').trim();
      if (!trimmed) return;
      
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const taskItem = {
        id: String(Date.now()),
        title: trimmed,
        completed: false,
        important: false,
        wishlist: false,
        priority: selectedPriority,
        currentDate: new Date().getDay(),  
        currentDay: days[new Date().getDay()]
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
    }else {
    // When 'all' filter is active, filter by currentDay
    list = list.filter(t => t.currentDate === currentDay);
  }
  //  console.log(currentDay)
   
    // Filter by search query (TasksView search)
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }

    return list;
  }, [tasks, activeFilter, searchQuery,currentDay]);

  // Get dynamic styles based on theme and font size
  const getAppStyles = () => {
    // Apply theme and font size to styles
    const baseStyles = styles;
    
    // Force re-render when theme or font size changes
    console.log('Applying styles with theme:', theme, 'fontSize:', fontSize, 'forceUpdate:', forceUpdate);
    
    // Apply font size adjustments - make sure this is properly applied
    let fontSizeMultiplier;
    if (fontSize === 'Small') {
      fontSizeMultiplier = 0.85;
    } else if (fontSize === 'Large') {
      fontSizeMultiplier = 1.3; // Increased for better visibility
    } else {
      fontSizeMultiplier = 1;
    }
    console.log('Applying font size:', fontSize);
    console.log('Font size multiplier:', fontSizeMultiplier, 'for fontSize:', fontSize);
    
    // Apply theme adjustments with improved dark theme colors
    const themeColors = theme === 'Dark' ? {
      backgroundColor: '#121212',
      textColor: '#ffffff',
      cardBackground: '#1e1e1e',
      borderColor: '#444444',
      accentColor: '#bb86fc',
      secondaryTextColor: '#e0e0e0',
      buttonBackground: '#333333',
      inputBackground: '#2a2a2a'
    } : {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      cardBackground: '#fafafa',
      borderColor: '#e0e0e0',
      accentColor: '#6200ee',
      secondaryTextColor: '#757575',
      buttonBackground: '#f5f5f5',
      inputBackground: '#ffffff'
    };
    
    return {
      ...baseStyles,
      appContainer: { 
        ...baseStyles.appContainer, 
        backgroundColor: themeColors.backgroundColor 
      },
      innerContainer: { 
        ...baseStyles.innerContainer, 
        backgroundColor: themeColors.backgroundColor 
      },
      mainTitle: { 
        ...baseStyles.mainTitle, 
        fontSize: 28 * fontSizeMultiplier,
        color: themeColors.textColor,
        fontWeight: 'bold'
      },
      taskTitle: { 
        ...baseStyles.taskTitle, 
        fontSize: 16 * fontSizeMultiplier,
        color: themeColors.textColor,
        fontWeight: theme === 'Dark' ? '600' : '500'
      },
      settingLabel: {
        fontSize: 18 * fontSizeMultiplier,
        marginBottom: 10,
        color: themeColors.textColor,
        fontWeight: theme === 'Dark' ? '600' : '500'
      },
      settingValue: {
        fontSize: 16 * fontSizeMultiplier,
        color: theme === 'Dark' ? themeColors.accentColor : themeColors.textColor,
        padding: 12,
        backgroundColor: themeColors.inputBackground,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        marginBottom: 16
      },
      text: {
        fontSize: 14 * fontSizeMultiplier,
        color: themeColors.textColor
      },
      buttonText: {
        fontSize: 14 * fontSizeMultiplier,
        color: themeColors.textColor
      },
      headerText: {
        fontSize: 18 * fontSizeMultiplier,
        fontWeight: 'bold',
        color: themeColors.textColor
      },
      // Apply font size to all text elements
      ...(Object.keys(baseStyles).reduce((acc, key) => {
        // Apply font size to any style that might contain text
        if (baseStyles[key] && typeof baseStyles[key] === 'object' && 
            (key.toLowerCase().includes('text') || key.toLowerCase().includes('title') || 
             key.toLowerCase().includes('label') || key.toLowerCase().includes('button'))) {
          acc[key] = {
            ...baseStyles[key],
            fontSize: (baseStyles[key].fontSize || 14) * fontSizeMultiplier,
            color: baseStyles[key].color || themeColors.textColor
          };
        }
        return acc;
      }, {})),
      // Add more style overrides as needed
    };
  };
  
  // Get dynamic styles - recalculate when theme, fontSize or forceUpdate changes
  const dynamicStyles = useMemo(() => {
    console.log('Recalculating styles with fontSize:', fontSize);
    return getAppStyles();
  }, [theme, fontSize, forceUpdate]);
  
  // Define font size multiplier function
  const getFontSizeMultiplier = (size) => {
    if (size === 'Small') return 0.85;
    if (size === 'Large') return 1.3;
    return 1; // Medium is default
  };
  
  // Define theme colors
  const themeColors = {
    Light: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      cardBackground: '#fafafa',
      borderColor: '#e0e0e0',
      accentColor: '#6200ee',
      secondaryTextColor: '#757575',
      buttonBackground: '#f5f5f5',
      inputBackground: '#ffffff'
    },
    Dark: {
      backgroundColor: '#121212',
      textColor: '#ffffff',
      cardBackground: '#1e1e1e',
      borderColor: '#444444',
      accentColor: '#bb86fc',
      secondaryTextColor: '#e0e0e0',
      buttonBackground: '#333333',
      inputBackground: '#2a2a2a'
    }
  };

  // Common props shared across all pages
  const commonProps = {
    styles: {
      ...dynamicStyles,
      onThemeChange: (newTheme) => {
        setTheme(newTheme);
        setForceUpdate(prev => prev + 1);
        AsyncStorage.setItem('theme', newTheme);
      },
      onFontSizeChange: (newFontSize) => {
        console.log('Font size changed to:', newFontSize);
        // Force immediate update
        setFontSize(newFontSize);
        // Apply font size directly to all text elements
        setForceUpdate(prev => prev + 1);
        
        // Apply the font size change immediately to all text elements
        const baseTextSize = newFontSize === 'Small' ? 14 : newFontSize === 'Large' ? 18 : 16;
        
        AsyncStorage.setItem('fontSize', newFontSize);
      }
    },
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
    currentView,
    setCurrentView,
    currentDay,
    setCurrentDay,
    Days,
    // Add settings
    theme,
    setTheme,
    fontSize,
    setFontSize
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
        return <SettingsPage {...commonProps} />;
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