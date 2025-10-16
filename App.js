import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import HomePage from './components/HomePage';
import ProgressPage from './components/ProgressPage';
import WishlistPage from './components/WishlistPage';
import SettingsPage from './components/SettingsPage';

// Navigation
import FooterNavigationBar from './components/FooterNavigationBar';

// Styles
import defaultStyles from './styles';

// Constants
const NAV_HEIGHT = 60;
const STORAGE_KEYS = {
  tasks: 'TASKS',
  adFree: 'HAS_AD_FREE',
  pro: 'HAS_PRO',
};
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DAYS = DAY_NAMES.map((fullName, id) => ({
  id,
  name: fullName.slice(0, 3),
  fullName,
}));

const THEME_COLOR_MAP = {
  Light: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    cardBackground: '#fafafa',
    borderColor: '#e0e0e0',
    accentColor: '#6200ee',
    secondaryTextColor: '#757575',
    buttonBackground: '#f5f5f5',
    inputBackground: '#ffffff',
  },
  Dark: {
    backgroundColor: '#121212',
    textColor: '#ffffff',
    cardBackground: '#1e1e1e',
    borderColor: '#444444',
    accentColor: '#bb86fc',
    secondaryTextColor: '#e0e0e0',
    buttonBackground: '#333333',
    inputBackground: '#2a2a2a',
  },
  Pastel: {
    backgroundColor: '#F8F5FF',
    textColor: '#2E1065',
    cardBackground: '#FFFFFF',
    borderColor: '#E9D5FF',
    accentColor: '#8B5CF6',
    secondaryTextColor: '#6D28D9',
    buttonBackground: '#EDE9FE',
    inputBackground: '#FFFFFF',
  },
  Mint: {
    backgroundColor: '#F0FBF6',
    textColor: '#064E3B',
    cardBackground: '#FFFFFF',
    borderColor: '#BBF7D0',
    accentColor: '#10B981',
    secondaryTextColor: '#047857',
    buttonBackground: '#D1FAE5',
    inputBackground: '#FFFFFF',
  },
  Ocean: {
    backgroundColor: '#0F172A',
    textColor: '#E0F2FE',
    cardBackground: '#11243E',
    borderColor: '#1E3A5F',
    accentColor: '#38BDF8',
    secondaryTextColor: '#93C5FD',
    buttonBackground: '#1E40AF',
    inputBackground: '#102338',
  },
  Sunset: {
    backgroundColor: '#FFF7ED',
    textColor: '#7C2D12',
    cardBackground: '#FFFFFF',
    borderColor: '#FED7AA',
    accentColor: '#F97316',
    secondaryTextColor: '#9A3412',
    buttonBackground: '#FFEDD5',
    inputBackground: '#FFFFFF',
  },
  Pink: {
    backgroundColor: '#FFF5F7',
    textColor: '#831843',
    cardBackground: '#FFFFFF',
    borderColor: '#FBCFE8',
    accentColor: '#EC4899',
    secondaryTextColor: '#BE185D',
    buttonBackground: '#FCE7F3',
    inputBackground: '#FFFFFF',
  },
};

const startOfDay = (value) => {
  if (!value && value !== 0) return null;
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (date, count) => {
  const base = startOfDay(date) || new Date();
  const result = new Date(base);
  result.setDate(base.getDate() + count);
  return result;
};

const toISODate = (value) => {
  const date = startOfDay(value);
  return date ? date.toISOString() : null;
};

const formatShortDate = (date) => {
  const safeDate = startOfDay(date);
  if (!safeDate) return '';
  return safeDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const formatLongDay = (date) => {
  const safeDate = startOfDay(date);
  if (!safeDate) return '';
  return safeDate.toLocaleDateString('en-US', { weekday: 'long' });
};

const describeRelativeDate = (date, reference = startOfDay(new Date())) => {
  const safeDate = startOfDay(date);
  const refDate = startOfDay(reference);
  if (!safeDate || !refDate) return '';

  const diffMs = safeDate.getTime() - refDate.getTime();
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return formatShortDate(safeDate);
};

const getTaskDueDate = (task) => {
  if (!task) return null;
  if (task.dueDateISO) {
    const parsed = startOfDay(task.dueDateISO);
    if (parsed) return parsed;
  }

  if (task.dueDate) {
    const parsed = startOfDay(task.dueDate);
    if (parsed) return parsed;
  }

  return null;
};

const normalizeTask = (task) => {
  if (!task) return task;

  const normalized = {
    wishlist: false,
    ...task,
  };
  if (!normalized.priority) {
    normalized.priority = 'Normal';
  }
  const legacyPriorityMap = {
    Urgent: 'Critical',
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
    None: 'Normal',
  };
  if (legacyPriorityMap[normalized.priority]) {
    normalized.priority = legacyPriorityMap[normalized.priority];
  }

  const dueDate = getTaskDueDate(normalized);
  const createdDate = normalized.createdAt ? startOfDay(normalized.createdAt) : null;
  const fallbackDate =
    createdDate ||
    (() => {
      if (typeof normalized.currentDate === 'number') {
        const base = startOfDay(new Date());
        if (!base) return null;
        const diff = normalized.currentDate - base.getDay();
        const adjusted = new Date(base);
        adjusted.setDate(base.getDate() + diff);
        return adjusted;
      }
      return null;
    })() ||
    startOfDay(new Date());

  if (dueDate) {
    const iso = toISODate(dueDate);
    normalized.dueDateISO = iso;
    normalized.dueDayId = dueDate.getDay();
    normalized.dueDayName = formatLongDay(dueDate);
    normalized.dueDateLabel = normalized.dueDateLabel || describeRelativeDate(dueDate);
    normalized.currentDate = normalized.dueDayId;
    normalized.currentDay = normalized.dueDayName;
  } else {
    normalized.dueDateISO = null;
    normalized.dueDateLabel = '';

    normalized.dueDayId = fallbackDate.getDay();
    normalized.dueDayName = formatLongDay(fallbackDate);
    normalized.currentDate = normalized.dueDayId;
    normalized.currentDay = normalized.dueDayName;
  }

  return normalized;
};

const countTasksByDay = (tasks = []) => tasks.reduce((acc, task) => {
  const normalized = normalizeTask(task);
  if (typeof normalized.dueDayId === 'number') {
    acc[normalized.dueDayId] = (acc[normalized.dueDayId] || 0) + 1;
  }
  return acc;
}, {});

const DEFAULT_TASKS = (() => {
  const today = startOfDay(new Date());
  return [
    {
      id: '1',
      title: 'Buy milk',
      completed: false,
      important: false,
      wishlist: false,
      priority: 'Normal',
      dueDateISO: toISODate(today),
      time: '10:00',
    },
    {
      id: '2',
      title: 'Fix bug',
      completed: true,
      important: true,
      wishlist: false,
      priority: 'Normal',
      dueDateISO: toISODate(addDays(today, -1)),
    },
    {
      id: '3',
      title: 'Call mom',
      completed: false,
      important: true,
      wishlist: false,
      priority: 'Normal',
      dueDateISO: toISODate(addDays(today, 2)),
    },
  ].map(normalizeTask);
})();

function AppContent() {
  // App settings
  const [theme, setTheme] = useState('Light');
  const [fontSize, setFontSize] = useState('Medium');
  
  // Force re-render when theme or font size changes
  const [forceUpdate, setForceUpdate] = useState(0);
  const [dayFilter, setDayFilter] = useState('all');
  const [currentView, setCurrentView] = useState('today');
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Normal');
  const [searchAllTodoListItem, setSearchAllTodoListItem] = useState('');
  const [selectedDueDateKey, setSelectedDueDateKey] = useState('none');
  const [tasks, setTasks] = useState(() => DEFAULT_TASKS.map(task => ({ ...task })));
  const savedTodoTasks = useMemo(() => tasks.map(task => ({ ...task })), [tasks]);
  const [hasAdFree, setHasAdFree] = useState(false);
  const [hasPro, setHasPro] = useState(false);
  const insets = typeof useSafeAreaInsets === 'function'
    ? useSafeAreaInsets()
    : { top: 0, bottom: 0, left: 0, right: 0 };
  useEffect(() => {
    if (!hasPro) {
      const allowedThemes = ['Light', 'Dark'];
      if (!allowedThemes.includes(theme)) {
        setTheme('Light');
        AsyncStorage.setItem('theme', 'Light').catch((err) => {
          console.error('Failed to reset theme for free tier', err);
        });
      }
      if (fontSize !== 'Medium') {
        setFontSize('Medium');
        AsyncStorage.setItem('fontSize', 'Medium').catch((err) => {
          console.error('Failed to reset font size for free tier', err);
        });
      }
    }
  }, [hasPro, theme, fontSize]);
  useEffect(() => {
    if (!hasPro) {
      setSelectedPriority('Normal');
    }
  }, [hasPro]);
  const selectedDueDateLabel = useMemo(() => {
    if (!selectedDueDateKey || selectedDueDateKey === 'none') return 'No due date';
    const date = startOfDay(selectedDueDateKey);
    if (!date) return 'No due date';
    const relative = describeRelativeDate(date);
    if (['Today', 'Tomorrow', 'Yesterday'].includes(relative)) {
      return relative;
    }
    return formatShortDate(date);
  }, [selectedDueDateKey]);

  // Load tasks and settings from AsyncStorage when app mounts
  useEffect(() => {
    async function loadData() {
      try {
        const keysToLoad = [
          STORAGE_KEYS.tasks,
          STORAGE_KEYS.adFree,
          STORAGE_KEYS.pro,
          'theme',
          'fontSize',
        ];
        const entries = await AsyncStorage.multiGet(keysToLoad);
        const stored = Object.fromEntries(entries);

        const rawTasks = stored[STORAGE_KEYS.tasks];
        if (rawTasks) {
          const parsed = JSON.parse(rawTasks);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map(normalizeTask);
            setTasks(normalized);
          } else {
            console.warn('Stored tasks is not an array, ignoring.');
          }
        }

        const rawAdFree = stored[STORAGE_KEYS.adFree];
        if (rawAdFree !== undefined && rawAdFree !== null) {
          setHasAdFree(rawAdFree === 'true');
        }

        const rawPro = stored[STORAGE_KEYS.pro];
        if (rawPro !== undefined && rawPro !== null) {
          const proActive = rawPro === 'true';
          setHasPro(proActive);
          if (proActive) {
            setHasAdFree(true);
          }
        }

        const savedTheme = stored.theme;
        const savedFontSize = stored.fontSize;

        if (savedTheme) setTheme(savedTheme);
        if (savedFontSize) setFontSize(savedFontSize);
      } catch (err) {
        console.error('Failed to load data from AsyncStorage', err);
      }
    }
    loadData();
  }, []);

  // Add new task
  async function addTask() {
    try {
      const trimmed = (newTask || '').trim();
      if (!trimmed) return;
      const dueDate = selectedDueDateKey === 'none' ? null : startOfDay(selectedDueDateKey);
      const taskItem = normalizeTask({
        id: String(Date.now()),
        title: trimmed,
        completed: false,
        important: false,
        wishlist: false,
        priority: selectedPriority,
        createdAt: new Date().toISOString(),
        dueDateISO: dueDate ? toISODate(dueDate) : null,
        dueDateLabel: dueDate ? describeRelativeDate(dueDate) : '',
      });
      setTasks(prev => {
        const newList = [taskItem, ...prev];
        AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newList)).catch(e => {
          console.error('Failed to save tasks to AsyncStorage', e);
        });
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
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newList)).catch(e => console.error(e));
      return newList;
    });
  }

  // Toggle wishlist
  function toggleWishlist(id) {
    setTasks(prev => {
      const newList = prev.map(t => (t.id === id ? { ...t, wishlist: !t.wishlist } : t));
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newList)).catch(e => console.error(e));
      return newList;
    });
  }

  // Toggle important
  function toggleImportant(id) {
    setTasks(prev => {
      const newList = prev.map(t => (t.id === id ? { ...t, important: !t.important } : t));
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newList)).catch(e => console.error(e));
      return newList;
    });
  }

  // Future billing integration can call these helpers to adjust local entitlements.
  const updateAdFreeStatus = useCallback((value) => {
    const normalized = !!value;
    setHasAdFree(normalized);
    AsyncStorage.setItem(STORAGE_KEYS.adFree, normalized ? 'true' : 'false').catch((err) => {
      console.error('Failed to persist ad-free status', err);
    });
  }, []);

  const updateProStatus = useCallback((value) => {
    const normalized = !!value;
    setHasPro(normalized);
    AsyncStorage.setItem(STORAGE_KEYS.pro, normalized ? 'true' : 'false').catch((err) => {
      console.error('Failed to persist pro status', err);
    });
    if (normalized) {
      updateAdFreeStatus(true);
    }
  }, [updateAdFreeStatus]);

  const completeTasksBulk = useCallback((ids = []) => {
    if (!Array.isArray(ids) || !ids.length) return;
    const idSet = new Set(ids);
    setTasks(prev => {
      const newList = prev.map(task => (idSet.has(task.id) ? { ...task, completed: true } : task));
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newList)).catch(e => console.error(e));
      return newList;
    });
  }, []);

  const deleteTasksBulk = useCallback((ids = []) => {
    if (!Array.isArray(ids) || !ids.length) return;
    const idSet = new Set(ids);
    setTasks(prev => {
      const newList = prev.filter(task => !idSet.has(task.id));
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newList)).catch(e => console.error(e));
      return newList;
    });
  }, []);

  const requestUpgrade = useCallback((target = 'pro') => {
    console.log('Upgrade requested for:', target);
    setCurrentView('settings');
    setShowMenu(false);
  }, [setCurrentView, setShowMenu]);

  // Filter tasks based on activeFilter and search
  const dayCounts = useMemo(() => countTasksByDay(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    const today = startOfDay(new Date());

    if (activeFilter === 'today') {
      list = list.filter(task => {
        const dueDate = getTaskDueDate(task);
        return dueDate ? describeRelativeDate(dueDate, today) === 'Today' : false;
      });
    } else if (activeFilter === 'important') {
      list = list.filter(task => task.important);
    } else if (activeFilter === 'planned') {
      list = list.filter(task => !!getTaskDueDate(task));
    }

    const shouldFilterByDay =
      dayFilter !== 'all' &&
      (activeFilter === 'all' || activeFilter === 'important' || activeFilter === 'planned');

    if (shouldFilterByDay) {
      const dayIndex = Number(dayFilter);
      if (!Number.isNaN(dayIndex)) {
        list = list.filter(task => {
          if (typeof task.dueDayId === 'number') return task.dueDayId === dayIndex;
          const dueDate = getTaskDueDate(task);
          return dueDate ? dueDate.getDay() === dayIndex : false;
        });
      }
    }

    const query = (searchQuery || '').trim().toLowerCase();
    if (query) {
      list = list.filter(task => (task.title || '').toLowerCase().includes(query));
    }

    return list.map(normalizeTask);
  }, [tasks, activeFilter, searchQuery, dayFilter]);

  // Get dynamic styles based on theme and font size
  const getAppStyles = () => {
    // Apply theme and font size to styles
    const baseStyles = defaultStyles;
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
    
    // Apply theme adjustments
    const themeColors = THEME_COLOR_MAP[theme] || THEME_COLOR_MAP.Light;
    const isDarkTheme = theme === 'Dark' || theme === 'Ocean';
    
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
        fontWeight: isDarkTheme ? '600' : '500'
      },
      settingLabel: {
        fontSize: 18 * fontSizeMultiplier,
        marginBottom: 10,
        color: themeColors.textColor,
        fontWeight: isDarkTheme ? '600' : '500'
      },
      settingValue: {
        fontSize: 16 * fontSizeMultiplier,
        color: isDarkTheme ? themeColors.accentColor : themeColors.textColor,
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

  const fontScale = useMemo(() => getFontSizeMultiplier(fontSize), [fontSize]);

  function getFontSizeMultiplier(size) {
    if (size === 'Small') return 0.85;
    if (size === 'Large') return 1.3;
    return 1;
  }
  
  // Expose theme color map for downstream components
  const themeColors = THEME_COLOR_MAP;

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
    hasAdFree,
    hasPro,
    setHasAdFree: updateAdFreeStatus,
    setHasPro: updateProStatus,
    completeTasksBulk,
    deleteTasksBulk,
    onRequestUpgrade: requestUpgrade,
    savedTodoTasks,
    selectedPriority,
    setSelectedPriority,
    searchAllTodoListItem,
    setSearchAllTodoListItem,
    setTasks,
    currentView,
    setCurrentView,
    dayFilter,
    setDayFilter,
    Days: DAYS,
    selectedDueDateKey,
    setSelectedDueDateKey,
    selectedDueDateLabel,
    dayCounts,
    // Add settings
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontScale,
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

  const currentPalette = THEME_COLOR_MAP[theme] || THEME_COLOR_MAP.Light;
  const statusBarStyle = (theme === 'Dark' || theme === 'Ocean') ? 'light-content' : 'dark-content';
  const statusBarBackground = currentPalette.backgroundColor;

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackground}
      />
      <SafeAreaView style={dynamicStyles.appContainer}>
        
      {renderCurrentView()}

      <FooterNavigationBar
        styles={dynamicStyles}
        currentView={currentView}
        setCurrentView={setCurrentView}
        NAV_HEIGHT={NAV_HEIGHT}
      />
      </SafeAreaView>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
