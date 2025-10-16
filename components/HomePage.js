import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import getVisibleTasks from './VisibleTasks';
import AllDays from '../AllDays';
import CalendarModal from './CalendarModal';
import TaskCard from './TaskCard';
import Voice from '@react-native-voice/voice';

const HOME_THEMES = {
  Light: {
    screen: '#F5F7FB',
    card: '#FFFFFF',
    accent: '#6366F1',
    accentSoft: '#EEF2FF',
    cardBorder: 'rgba(15,23,42,0.08)',
    cardShadow: 'rgba(15,23,42,0.08)',
    textPrimary: '#0F172A',
    textSecondary: '#475467',
    textMuted: '#94A3B8',
    filterBackground: '#FFFFFF',
    filterBorder: '#E2E8F0',
    filterActive: '#EEF2FF',
    filterActiveBorder: '#6366F1',
    chipIcon: '#6366F1',
    inputBackground: '#FFFFFF',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94A3B8',
    pillBackground: '#F8FAFF',
    pillText: '#4338CA',
    metricSuccess: '#22C55E',
    metricNeutral: '#3B82F6',
    metricWarning: '#F59E0B',
    emptyState: '#94A3B8',
    addButtonBackground: '#111827',
    addButtonText: '#FFFFFF',
  },
  Dark: {
    screen: '#0B1120',
    card: '#111C2E',
    accent: '#818CF8',
    accentSoft: 'rgba(129,140,248,0.25)',
    cardBorder: 'rgba(148,163,184,0.18)',
    cardShadow: 'rgba(2,6,23,0.5)',
    textPrimary: '#E2E8F0',
    textSecondary: '#A5B4FC',
    textMuted: '#6B7280',
    filterBackground: 'rgba(17,28,46,0.6)',
    filterBorder: 'rgba(148,163,184,0.28)',
    filterActive: 'rgba(129,140,248,0.24)',
    filterActiveBorder: '#A5B4FC',
    chipIcon: '#A5B4FC',
    inputBackground: '#1E293B',
    inputBorder: 'rgba(129,140,248,0.32)',
    inputPlaceholder: '#94A3B8',
    pillBackground: 'rgba(148,163,184,0.16)',
    pillText: '#E0E7FF',
    metricSuccess: '#4ADE80',
    metricNeutral: '#93C5FD',
    metricWarning: '#FBBF24',
    emptyState: '#94A3B8',
    addButtonBackground: '#4338CA',
    addButtonText: '#F8FAFF',
  },
};

const HOME_THEME_VARIANTS = {
  Pastel: {
    ...HOME_THEMES.Light,
    screen: '#F8F5FF',
    card: '#FFFFFF',
    accent: '#8B5CF6',
    accentSoft: 'rgba(139,92,246,0.16)',
    cardBorder: 'rgba(139,92,246,0.18)',
    cardShadow: 'rgba(139,92,246,0.22)',
    textPrimary: '#2E1065',
    textSecondary: '#6B21A8',
    textMuted: '#9F67F8',
    filterBackground: '#FFFFFF',
    filterBorder: 'rgba(139,92,246,0.22)',
    filterActive: 'rgba(139,92,246,0.18)',
    filterActiveBorder: '#8B5CF6',
    chipIcon: '#8B5CF6',
    inputBackground: '#FFFFFF',
    inputBorder: 'rgba(139,92,246,0.25)',
    inputPlaceholder: '#7C3AED',
    pillBackground: '#EDE9FE',
    pillText: '#5B21B6',
    metricSuccess: '#8B5CF6',
    addButtonBackground: '#6D28D9',
    addButtonText: '#F8FAFF',
  },
  Mint: {
    ...HOME_THEMES.Light,
    screen: '#F0FBF6',
    accent: '#10B981',
    accentSoft: 'rgba(16,185,129,0.18)',
    cardBorder: 'rgba(16,185,129,0.18)',
    cardShadow: 'rgba(16,185,129,0.18)',
    textPrimary: '#064E3B',
    textSecondary: '#047857',
    textMuted: '#0D9488',
    filterBorder: 'rgba(16,185,129,0.18)',
    filterActive: 'rgba(16,185,129,0.14)',
    filterActiveBorder: '#10B981',
    chipIcon: '#0D9488',
    inputBackground: '#FFFFFF',
    inputBorder: 'rgba(16,185,129,0.22)',
    inputPlaceholder: '#0F766E',
    pillBackground: '#D1FAE5',
    pillText: '#047857',
    metricSuccess: '#34D399',
    addButtonBackground: '#047857',
    addButtonText: '#ECFDF5',
  },
  Sunset: {
    ...HOME_THEMES.Light,
    screen: '#FFF7ED',
    accent: '#F97316',
    accentSoft: 'rgba(249,115,22,0.18)',
    cardBorder: 'rgba(249,115,22,0.22)',
    cardShadow: 'rgba(249,115,22,0.22)',
    textPrimary: '#7C2D12',
    textSecondary: '#9A3412',
    textMuted: '#FB923C',
    filterBorder: 'rgba(249,115,22,0.18)',
    filterActive: 'rgba(249,115,22,0.14)',
    filterActiveBorder: '#F97316',
    chipIcon: '#F97316',
    inputBackground: '#FFFFFF',
    inputBorder: 'rgba(249,115,22,0.22)',
    inputPlaceholder: '#FB923C',
    pillBackground: '#FFEDD5',
    pillText: '#9A3412',
    metricSuccess: '#F97316',
    addButtonBackground: '#EA580C',
    addButtonText: '#FFF7ED',
  },
  Pink: {
    ...HOME_THEMES.Light,
    screen: '#FFF5F7',
    accent: '#EC4899',
    accentSoft: 'rgba(236,72,153,0.18)',
    cardBorder: 'rgba(236,72,153,0.2)',
    cardShadow: 'rgba(236,72,153,0.2)',
    textPrimary: '#831843',
    textSecondary: '#BE185D',
    textMuted: '#F472B6',
    filterBorder: 'rgba(236,72,153,0.18)',
    filterActive: 'rgba(236,72,153,0.14)',
    filterActiveBorder: '#EC4899',
    chipIcon: '#EC4899',
    inputBackground: '#FFFFFF',
    inputBorder: 'rgba(236,72,153,0.22)',
    inputPlaceholder: '#F472B6',
    pillBackground: '#FCE7F3',
    pillText: '#BE185D',
    metricSuccess: '#F472B6',
    addButtonBackground: '#DB2777',
    addButtonText: '#FFF5F7',
  },
  Ocean: {
    ...HOME_THEMES.Dark,
    screen: '#0F172A',
    card: '#11243E',
    accent: '#38BDF8',
    accentSoft: 'rgba(56,189,248,0.24)',
    cardBorder: 'rgba(56,189,248,0.22)',
    cardShadow: 'rgba(56,189,248,0.28)',
    textPrimary: '#E0F2FE',
    textSecondary: '#93C5FD',
    textMuted: '#38BDF8',
    filterBackground: 'rgba(17,36,62,0.7)',
    filterBorder: 'rgba(56,189,248,0.28)',
    filterActive: 'rgba(56,189,248,0.28)',
    filterActiveBorder: '#38BDF8',
    chipIcon: '#38BDF8',
    inputBackground: '#102A44',
    inputBorder: 'rgba(56,189,248,0.28)',
    inputPlaceholder: '#60A5FA',
    pillBackground: 'rgba(56,189,248,0.18)',
    pillText: '#1E3A8A',
    metricSuccess: '#38BDF8',
    addButtonBackground: '#1D4ED8',
    addButtonText: '#E0F2FE',
  },
};

Object.assign(HOME_THEMES, HOME_THEME_VARIANTS);

const PRO_PRIORITY_OPTIONS = [
  { key: 'normal', value: 'Normal', isPro: false },
  { key: 'low', value: 'Low', isPro: true },
  { key: 'medium', value: 'Medium', isPro: true },
  { key: 'high', value: 'High', isPro: true },
  { key: 'critical', value: 'Critical', isPro: true },
];

const scaleFont = (value, multiplier) =>
  Math.round(value * multiplier * 100) / 100;

const startOfDay = (value) => {
  if (!value && value !== 0) return null;
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const isDueToday = (task) => {
  const today = startOfDay(new Date());
  const due = task.dueDateISO || task.dueDate;
  if (!due) return false;
  const dueDate = startOfDay(due);
  if (!dueDate) return false;
  return dueDate.getTime() === today.getTime();
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function HomePage({
  NAV_HEIGHT,
  showMenu,
  setShowMenu,
  activeFilter,
  setActiveFilter,
  newTask,
  setNewTask,
  addTask,
  filteredTasks = [],
  toggleTask,
  toggleImportant,
  toggleWishlist,
  title = 'Today',
  dateLabel,
  savedTodoTasks = [],
  selectedPriority,
  setSelectedPriority,
  searchAllTodoListItem,
  setSearchAllTodoListItem,
  setTasks,
  completeTasksBulk,
  deleteTasksBulk,
  dayFilter,
  setDayFilter,
  Days,
  selectedDueDateKey,
  setSelectedDueDateKey,
  selectedDueDateLabel,
  dayCounts = {},
  theme = 'Light',
  fontScale = 1,
  currentView,
  setCurrentView,
  hasPro,
  onRequestUpgrade,
  safeAreaInsets,
  styles: sharedStyles = {},
  setTheme,
}) {
  const palette = HOME_THEMES[theme] || HOME_THEMES.Light;
  const bottomInset = safeAreaInsets?.bottom ?? 0;
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const voiceHandledRef = useRef(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const priorityOptions = useMemo(() => PRO_PRIORITY_OPTIONS, []);

  const prioritySelectOptions = useMemo(
    () =>
      priorityOptions.map((option) => ({
        key: option.key,
        value:
          option.isPro && !hasPro
            ? `${option.value} (PRO)`
            : option.value,
        disabled: option.isPro && !hasPro,
      })),
    [priorityOptions, hasPro],
  );

  const priorityDefault = useMemo(() => {
    const value = selectedPriority || 'Normal';
    return (
      priorityOptions.find((option) => option.value === value) ||
      priorityOptions[0]
    );
  }, [selectedPriority, priorityOptions]);

  const priorityDefaultOption = useMemo(
    () => ({
      key: priorityDefault.key,
      value:
        priorityDefault.isPro && !hasPro
          ? `${priorityDefault.value} (PRO)`
          : priorityDefault.value,
    }),
    [priorityDefault, hasPro],
  );

  const handlePrioritySelect = useCallback(
    (nextKey) => {
      const match = priorityOptions.find((option) => option.key === nextKey);
      if (!match) return;
      if (match.isPro && !hasPro) {
        if (typeof onRequestUpgrade === 'function') {
          onRequestUpgrade('pro');
        }
        Alert.alert('Pro required', 'Upgrade to Pro to assign advanced priority levels.');
        setSelectedPriority('Normal');
        return;
      }
      setSelectedPriority(match.value);
    },
    [priorityOptions, hasPro, onRequestUpgrade, setSelectedPriority],
  );

  const homeStyles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: palette.screen,
        },
        content: {
          paddingHorizontal: 20,
          paddingBottom: NAV_HEIGHT + bottomInset + 20,
          paddingTop: 20,
          gap: 18,
        },
        headerCard: {
          paddingVertical: 18,
          paddingHorizontal: 20,
          borderRadius: 24,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.22 : 0.12,
          shadowRadius: 20,
          elevation: 7,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        headerTextGroup: {
          flex: 1,
          paddingRight: 12,
        },
        headerGreeting: {
          fontSize: scaleFont(13, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        },
        headerTitle: {
          marginTop: 2,
          fontSize: scaleFont(24, fontScale),
          fontWeight: '700',
          color: palette.textPrimary,
        },
        headerSubtitle: {
          marginTop: 4,
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
          lineHeight: scaleFont(18, fontScale),
        },
        headerMetricsRow: {
          marginTop: 12,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        },
        headerMetric: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.pillBackground,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 14,
        },
        headerMetricText: {
          marginLeft: 6,
          color: palette.pillText,
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
        },
        menuWrapper: {
          position: 'relative',
        },
        menuContainer: {
          position: 'absolute',
          top: 54,
          right: 0,
          width: 220,
          borderRadius: 16,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.25 : 0.12,
          shadowRadius: 16,
          elevation: 6,
          overflow: 'hidden',
          zIndex: 20,
        },
        menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: 'transparent',
        },
        menuItemActive: {
          backgroundColor: palette.accentSoft,
        },
        menuItemIcon: {
          marginRight: 12,
        },
        menuItemText: {
          fontSize: scaleFont(14, fontScale),
          color: palette.textPrimary,
          fontWeight: '600',
        },
        menuDivider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: palette.filterBorder,
          marginHorizontal: 12,
        },
        filterGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: palette.filterBackground,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          padding: 6,
          marginTop: 12,
        },
        filterChip: {
          flex: 1,
          paddingVertical: 10,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 4,
        },
        filterChipActive: {
          backgroundColor: palette.filterActive,
          borderColor: palette.filterActiveBorder,
        },
        filterChipText: {
          fontSize: scaleFont(13, fontScale),
          fontWeight: '600',
          color: palette.textSecondary,
        },
        filterChipTextActive: {
          color: palette.chipIcon,
        },
        sectionCard: {
          padding: 20,
          borderRadius: 24,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.22 : 0.12,
          shadowRadius: 20,
          elevation: 6,
        },
        sectionTitleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
        },
        sectionTitle: {
          fontSize: scaleFont(18, fontScale),
          fontWeight: '700',
          color: palette.textPrimary,
        },
        sectionSubtitle: {
          fontSize: scaleFont(13, fontScale),
          color: palette.textSecondary,
          marginTop: 4,
        },
        todoListHeading: {
          marginTop: 18,
          color: palette.textPrimary,
          fontSize: scaleFont(12, fontScale),
          fontWeight: '700',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        },
        addTaskInput: {
          backgroundColor: palette.inputBackground,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: palette.textPrimary,
          fontSize: scaleFont(15, fontScale),
        },
        selectListWrapper: {
          marginTop: 12,
        },
        proFeatureHint: {
          marginTop: 6,
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
        },
        inputActionsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginTop: 12,
        },
        actionChip: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          backgroundColor: palette.filterBackground,
          gap: 8,
        },
        actionChipText: {
          fontSize: scaleFont(13, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
        },
        actionChipDisabled: {
          opacity: 0.6,
        },
        actionChipActive: {
          borderColor: palette.accent,
          backgroundColor: palette.accentSoft,
        },
        voiceStatusText: {
          marginTop: 6,
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
        },
        voiceErrorText: {
          marginTop: 4,
          fontSize: scaleFont(12, fontScale),
          color: '#dc2626',
        },
        dueDateButton: {
          marginTop: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          backgroundColor: palette.inputBackground,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        dueDateText: {
          fontSize: scaleFont(14, fontScale),
          color: palette.textSecondary,
          fontWeight: '500',
        },
        dueDateValue: {
          fontSize: scaleFont(14, fontScale),
          color: palette.accent,
          fontWeight: '600',
        },
        addTaskButton: {
          marginTop: 16,
          borderRadius: 16,
          paddingVertical: 15,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 8,
          backgroundColor: palette.addButtonBackground,
        },
        addTaskButtonText: {
          fontSize: scaleFont(15, fontScale),
          color: palette.addButtonText,
          fontWeight: '700',
        },
        statsRow: {
          marginTop: 0,
        },
        searchInput: {
          marginTop: 12,
          backgroundColor: palette.inputBackground,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: palette.textPrimary,
          fontSize: scaleFont(14, fontScale),
        },
        taskList: {
          marginTop: 12,
          gap: 12,
        },
        emptyState: {
          marginTop: 20,
          fontSize: scaleFont(14, fontScale),
          color: palette.emptyState,
          textAlign: 'center',
        },
        bulkActionsBar: {
          marginTop: 12,
          padding: 12,
          borderRadius: 16,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.25 : 0.12,
          shadowRadius: 12,
          elevation: 4,
          gap: 10,
        },
        bulkSelectedText: {
          fontSize: scaleFont(13, fontScale),
          fontWeight: '600',
          color: palette.textSecondary,
        },
        bulkButtons: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        },
        bulkButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          backgroundColor: palette.filterBackground,
          gap: 6,
        },
        bulkButtonText: {
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
        },
        bulkButtonDisabled: {
          opacity: 0.4,
        },
        bulkPrimaryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: palette.addButtonBackground,
          gap: 6,
        },
        bulkPrimaryButtonText: {
          fontSize: scaleFont(12, fontScale),
          color: palette.addButtonText,
          fontWeight: '700',
        },
        bulkDangerButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: '#DC2626',
          gap: 6,
        },
        bulkDangerButtonText: {
          fontSize: scaleFont(12, fontScale),
          color: '#fff',
          fontWeight: '700',
        },
      }),
    [palette, theme, NAV_HEIGHT, bottomInset, fontScale, hasPro],
  );

  const selectedDayDetails = useMemo(() => {
    if (dayFilter === 'all') return null;
    return Days.find((day) => String(day.id) === String(dayFilter));
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
        return 'All Tasks';
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
      if (dayFilter === 'all') return dateLabel || 'All tasks';
      return name ? `Tasks for ${name}` : 'Tasks';
    }

    return dateLabel || '';
  }, [activeFilter, dayFilter, dateLabel, selectedDayDetails]);

  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const tasksToShow = useMemo(
    () => getVisibleTasks(filteredTasks, searchAllTodoListItem),
    [filteredTasks, searchAllTodoListItem],
  );

  const totalTasks = savedTodoTasks.length;
  const completedTasks = savedTodoTasks.filter((task) => task.completed).length;
  const importantTasks = savedTodoTasks.filter((task) => task.important).length;
  const plannedTasks = savedTodoTasks.filter((task) => task.dueDateISO).length;
  const todayTasks = savedTodoTasks.filter(isDueToday).length;

  const handleNavigate = useCallback(
    (view) => {
      if (typeof setCurrentView === 'function' && view) {
        setCurrentView(view);
      }
      setShowMenu(false);
    },
    [setCurrentView, setShowMenu],
  );

  const handleToggleTheme = useCallback(() => {
    const nextTheme = theme === 'Light' ? 'Dark' : 'Light';
    if (sharedStyles?.onThemeChange) {
      sharedStyles.onThemeChange(nextTheme);
    } else if (typeof setTheme === 'function') {
      setTheme(nextTheme);
    }
    setShowMenu(false);
  }, [theme, sharedStyles, setTheme, setShowMenu]);

  const menuItems = useMemo(
    () => [
      {
        key: 'upgrade',
        label: hasPro ? 'Manage subscription' : 'Unlock Pro',
        icon: 'workspace-premium',
        action: () => {
          if (typeof onRequestUpgrade === 'function') {
            onRequestUpgrade(hasPro ? 'manage' : 'pro');
          } else {
            handleNavigate('settings');
          }
          setShowMenu(false);
        },
        isActive: false,
      },
      {
        key: 'progress',
        label: 'View progress',
        icon: 'insert-chart-outlined',
        action: () => handleNavigate('progress'),
        isActive: currentView === 'progress',
      },
      {
        key: 'settings',
        label: 'App settings',
        icon: 'settings',
        action: () => handleNavigate('settings'),
        isActive: currentView === 'settings',
      },
      {
        key: 'theme',
        label: theme === 'Light' ? 'Switch to Dark mode' : 'Switch to Light mode',
        icon: theme === 'Light' ? 'dark-mode' : 'light-mode',
        action: handleToggleTheme,
        isActive: false,
      },
    ],
    [currentView, theme, hasPro, onRequestUpgrade, handleNavigate, handleToggleTheme, setShowMenu],
  );

  const handleVoiceResult = useCallback((text) => {
    if (!text || voiceHandledRef.current) return;
    voiceHandledRef.current = true;
    setVoiceStatus('Saving task...');
    setNewTask(text);
    setTimeout(() => {
      addTask();
      setVoiceStatus('');
      Alert.alert('Task added', `"${text}" was added from voice input.`);
    }, 0);
  }, [addTask, setNewTask]);

  const handleVoicePress = useCallback(async () => {
    if (!hasPro) {
      if (typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('pro');
      }
      return;
    }
    if (!voiceAvailable) {
      Alert.alert('Microphone unavailable', 'Speech recognition is not available on this device.');
      return;
    }
    try {
      if (isListening) {
        await Voice.stop();
        setVoiceStatus('Processing...');
      } else {
        voiceHandledRef.current = false;
        setVoiceStatus('Listening...');
        setVoiceError('');
        await Voice.start('en-US');
        setIsListening(true);
      }
    } catch (err) {
      console.error('Voice error:', err);
      setIsListening(false);
      setVoiceStatus('');
      const message = err?.message || 'Failed to start voice recognition';
      setVoiceError(message);
      Alert.alert('Voice error', message);
    }
  }, [hasPro, onRequestUpgrade, voiceAvailable, isListening]);

  useEffect(() => {
    if (!hasPro) return undefined;

    Voice.onSpeechStart = () => {
      setIsListening(true);
      setVoiceStatus('Listening...');
      setVoiceError('');
    };
    Voice.onSpeechEnd = () => {
      setIsListening(false);
      if (!voiceHandledRef.current) {
        setVoiceStatus('');
      }
    };
    Voice.onSpeechResults = (event) => {
      const text = event?.value?.[0];
      if (text) {
        handleVoiceResult(text);
      }
    };
    Voice.onSpeechError = (event) => {
      console.error('Speech error', event);
      setIsListening(false);
      setVoiceStatus('');
      const message = event?.error?.message || 'Microphone error occurred';
      setVoiceError(message);
      Alert.alert('Voice error', message);
    };

    (async () => {
      try {
        await Voice?.requestPermissions?.();
        const available = await Voice?.isAvailable?.();
        if (typeof available === 'boolean') {
          setVoiceAvailable(available);
        }
      } catch (err) {
        console.error('Voice availability error:', err);
        setVoiceAvailable(false);
      }
    })();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
    };
  }, [hasPro, handleVoiceResult]);

  const selectedCount = selectedTaskIds.length;
  const hasTasksToSelect = tasksToShow.length > 0;
  const allSelected = selectedCount > 0 && selectedCount === tasksToShow.length;

  const handleToggleSelectionMode = useCallback(() => {
    if (!hasPro) {
      if (typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('pro');
      }
      return;
    }
    setIsSelectionMode((prev) => {
      if (prev) {
        setSelectedTaskIds([]);
      }
      return !prev;
    });
  }, [hasPro, onRequestUpgrade]);

  const handleSelectTask = useCallback((taskId) => {
    setSelectedTaskIds((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      }
      return [...prev, taskId];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!tasksToShow.length) return;
    const allIds = tasksToShow.map((task) => task.id);
    setSelectedTaskIds(allIds);
  }, [tasksToShow]);

  const handleClearSelection = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  const handleBulkComplete = useCallback(() => {
    if (!selectedCount) return;
    completeTasksBulk(selectedTaskIds);
    Alert.alert('Tasks updated', 'Selected tasks marked as done.');
    setSelectedTaskIds([]);
    setIsSelectionMode(false);
  }, [selectedCount, selectedTaskIds, completeTasksBulk]);

  const handleBulkDelete = useCallback(() => {
    if (!selectedCount) return;
    Alert.alert(
      'Delete tasks',
      `Delete ${selectedCount} selected task${selectedCount === 1 ? '' : 's'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTasksBulk(selectedTaskIds);
            setSelectedTaskIds([]);
            setIsSelectionMode(false);
          },
        },
      ],
    );
  }, [selectedCount, selectedTaskIds, deleteTasksBulk]);

  return (
    <ScrollView
      style={homeStyles.screen}
      contentContainerStyle={homeStyles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={homeStyles.headerCard}>
        <View style={homeStyles.headerRow}>
          <View style={homeStyles.headerTextGroup}>
            <Text style={homeStyles.headerGreeting}>{getGreeting()}</Text>
            <Text style={homeStyles.headerTitle}>{pageTitle}</Text>
            <Text style={homeStyles.headerSubtitle}>{headerSubtitle}</Text>
          </View>
          <View style={homeStyles.menuWrapper}>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: palette.accentSoft,
              }}
              onPress={() => setShowMenu(!showMenu)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="menu" size={22} color={palette.accent} />
            </TouchableOpacity>

            {showMenu && (
              <View style={homeStyles.menuContainer}>
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.key}>
                    <TouchableOpacity
                      style={[
                        homeStyles.menuItem,
                        item.isActive && homeStyles.menuItemActive,
                      ]}
                      onPress={item.action}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={18}
                        color={item.isActive ? palette.accent : palette.textSecondary}
                        style={homeStyles.menuItemIcon}
                      />
                      <Text
                        style={[
                          homeStyles.menuItemText,
                          item.isActive && { color: palette.accent },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                    {index < menuItems.length - 1 && <View style={homeStyles.menuDivider} />}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={homeStyles.headerMetricsRow}>
          <View style={homeStyles.headerMetric}>
            <MaterialIcons name="check-circle" size={16} color={palette.accent} />
            <Text style={homeStyles.headerMetricText}>{completedTasks} done</Text>
          </View>
          <View style={homeStyles.headerMetric}>
            <MaterialIcons name="event" size={16} color={palette.accent} />
            <Text style={homeStyles.headerMetricText}>{todayTasks} due today</Text>
          </View>
          <View style={homeStyles.headerMetric}>
            <MaterialIcons name="star" size={16} color={palette.accent} />
            <Text style={homeStyles.headerMetricText}>{importantTasks} important</Text>
          </View>
        </View>
      </View>

      <View style={homeStyles.sectionCard}>
        <Text style={homeStyles.sectionTitle}>Add a task</Text>
        <Text style={homeStyles.sectionSubtitle}>
          Capture what&apos;s on your mind and give it a plan.
        </Text>

        <TextInput
          style={homeStyles.addTaskInput}
          placeholder="Add a new task..."
          placeholderTextColor={palette.inputPlaceholder}
          value={newTask}
          onChangeText={setNewTask}
        onSubmitEditing={addTask}
        returnKeyType="done"
      />

      <View style={homeStyles.inputActionsRow}>
        <TouchableOpacity
          style={[
            homeStyles.actionChip,
            (!hasPro || !voiceAvailable) && homeStyles.actionChipDisabled,
            isListening && homeStyles.actionChipActive,
          ]}
          onPress={handleVoicePress}
          activeOpacity={hasPro ? 0.85 : 1}
        >
          <MaterialIcons
            name={isListening ? 'hearing' : 'mic'}
            size={18}
            color={hasPro ? palette.accent : palette.textSecondary}
          />
          <Text style={homeStyles.actionChipText}>
            {hasPro ? (isListening ? 'Listening…' : 'Voice task') : 'Voice (PRO)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            homeStyles.actionChip,
            !hasPro && homeStyles.actionChipDisabled,
            isSelectionMode && homeStyles.actionChipActive,
          ]}
          onPress={handleToggleSelectionMode}
          activeOpacity={hasPro ? 0.85 : 1}
        >
          <MaterialIcons
            name={isSelectionMode ? 'close' : 'checklist'}
            size={18}
            color={hasPro ? palette.accent : palette.textSecondary}
          />
          <Text style={homeStyles.actionChipText}>
            {hasPro ? (isSelectionMode ? 'Cancel select' : 'Multi-select') : 'Multi-select (PRO)'}
          </Text>
        </TouchableOpacity>
      </View>

      {!!voiceStatus && (
        <Text style={homeStyles.voiceStatusText}>{voiceStatus}</Text>
      )}
      {!!voiceError && (
        <Text style={homeStyles.voiceErrorText}>{voiceError}</Text>
      )}

      <View style={homeStyles.selectListWrapper}>
        <SelectList
          setSelected={handlePrioritySelect}
          data={prioritySelectOptions}
            save="key"
            placeholder="Priority"
            defaultOption={priorityDefaultOption}
            search={false}
            boxStyles={{
              backgroundColor: palette.inputBackground,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: palette.inputBorder,
            }}
            dropdownStyles={{
              backgroundColor: palette.inputBackground,
              borderColor: palette.inputBorder,
            }}
            inputStyles={{
              color: palette.textPrimary,
              fontSize: scaleFont(14, fontScale),
            }}
            dropdownTextStyles={{
              color: palette.textPrimary,
              fontSize: scaleFont(14, fontScale),
            }}
          />
          {!hasPro && (
            <Text style={homeStyles.proFeatureHint}>
              Priority levels beyond Normal are part of Pro.
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          style={homeStyles.dueDateButton}
        >
          <Text style={homeStyles.dueDateText}>Due date</Text>
          <Text style={homeStyles.dueDateValue}>{selectedDueDateLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={homeStyles.addTaskButton} onPress={addTask}>
          <MaterialIcons name="add-circle-outline" size={20} color={palette.addButtonText} />
          <Text style={homeStyles.addTaskButtonText}>Add task to list</Text>
        </TouchableOpacity>
      </View>

      <View style={homeStyles.sectionCard}>
        <View style={homeStyles.sectionTitleRow}>
          <View>
            <Text style={homeStyles.sectionTitle}>Quick filters</Text>
            <Text style={homeStyles.sectionSubtitle}>
              Jump to the list that needs your focus.
            </Text>
          </View>
        </View>

        <View style={homeStyles.filterGroup}>
          {['All', 'Today', 'Important', 'Planned'].map((filter) => {
            const isActive =
              activeFilter.toLowerCase() === filter.toLowerCase();
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  homeStyles.filterChip,
                  isActive && homeStyles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter.toLowerCase())}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text
                  style={[
                    homeStyles.filterChipText,
                    isActive && homeStyles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <AllDays
          Days={Days}
          dayFilter={dayFilter}
          setDayFilter={setDayFilter}
          dayCounts={dayCounts}
          theme={theme}
          fontScale={fontScale}
        />

        <Text style={homeStyles.todoListHeading}>Todo list</Text>
        <TextInput
          style={homeStyles.searchInput}
          placeholder="Search your tasks"
          placeholderTextColor={palette.inputPlaceholder}
          value={searchAllTodoListItem}
          onChangeText={setSearchAllTodoListItem}
          returnKeyType="search"
        />

        {hasPro && isSelectionMode && (
          <View style={homeStyles.bulkActionsBar}>
            <Text style={homeStyles.bulkSelectedText}>
              {selectedCount} selected
            </Text>
            <View style={homeStyles.bulkButtons}>
              <TouchableOpacity
                style={[
                  homeStyles.bulkButton,
                  (!hasTasksToSelect || allSelected) && homeStyles.bulkButtonDisabled,
                ]}
                onPress={handleSelectAll}
                disabled={!hasTasksToSelect || allSelected}
              >
                <MaterialIcons name="select-all" size={18} color={palette.accent} />
                <Text style={homeStyles.bulkButtonText}>Select all</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[homeStyles.bulkButton, !selectedCount && homeStyles.bulkButtonDisabled]}
                onPress={handleClearSelection}
                disabled={!selectedCount}
              >
                <MaterialIcons name="clear" size={18} color={palette.accent} />
                <Text style={homeStyles.bulkButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[homeStyles.bulkPrimaryButton, !selectedCount && homeStyles.bulkButtonDisabled]}
                onPress={handleBulkComplete}
                disabled={!selectedCount}
              >
                <MaterialIcons name="task-alt" size={18} color={palette.addButtonText} />
                <Text style={homeStyles.bulkPrimaryButtonText}>Mark done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[homeStyles.bulkDangerButton, !selectedCount && homeStyles.bulkButtonDisabled]}
                onPress={handleBulkDelete}
                disabled={!selectedCount}
              >
                <MaterialIcons name="delete" size={18} color="#fff" />
                <Text style={homeStyles.bulkDangerButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={homeStyles.taskList}>
          {tasksToShow.length ? (
            tasksToShow.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                setTasks={setTasks}
                onToggle={() => toggleTask(task.id)}
                onToggleImportant={() => toggleImportant(task.id)}
                onToggleWishlist={() => toggleWishlist(task.id)}
                selectionMode={hasPro && isSelectionMode}
                selected={selectedTaskIds.includes(task.id)}
                onSelectToggle={() => handleSelectTask(task.id)}
                theme={theme}
                fontScale={fontScale}
              />
            ))
          ) : (
            <Text style={homeStyles.emptyState}>
              Your list is clear—add a task to get started.
            </Text>
          )}
        </View>
      </View>

      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelect={(value) => setSelectedDueDateKey(value)}
        selectedDateISO={selectedDueDateKey === 'none' ? null : selectedDueDateKey}
        theme={theme}
      />
    </ScrollView>
  );
}
