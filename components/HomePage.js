import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
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

const QUICK_FILTERS = ['All', 'Today', 'Important', 'Planned'];

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
  folders = [],
  activeFolder = 'All',
  setActiveFolder = () => {},
  selectedFolder = 'Personal',
  setSelectedFolder = () => {},
  addFolder = () => ({ success: false, error: 'Upgrade to Pro to add folders.' }),
  renameFolder = () => ({ success: false, error: 'Upgrade to Pro to manage folders.' }),
  deleteFolder = () => ({ success: false, error: 'Upgrade to Pro to manage folders.' }),
  baseFolders = [],
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
  const autoExitSelectionRef = useRef(false);
  const [showAddFolderInput, setShowAddFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isManageModalVisible, setIsManageModalVisible] = useState(false);
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  const [isSortAscending, setIsSortAscending] = useState(true);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [folderBeingEdited, setFolderBeingEdited] = useState(null);
  const folderChipScrollRef = useRef(null);
  const folderChipPositionsRef = useRef({});
  const priorityOptions = useMemo(() => PRO_PRIORITY_OPTIONS, []);
  const [isQuickFilterPopupVisible, setQuickFilterPopupVisible] = useState(false);

  const folderOptions = useMemo(
    () => folders.map((name) => ({ key: name, value: name })),
    [folders],
  );

  const handleFolderSelect = useCallback((folderKey) => {
    if (folders.includes(folderKey)) {
      setSelectedFolder(folderKey);
    }
  }, [folders, setSelectedFolder]);

  const handleFolderChipPress = useCallback((folderName) => {
    setActiveFolder(folderName);
  }, [setActiveFolder]);

  const folderDefaultOption = useMemo(
    () => ({ key: selectedFolder, value: selectedFolder }),
    [selectedFolder],
  );

  const folderChipList = useMemo(() => ['All', ...folders], [folders]);

  const baseFolderSet = useMemo(() => new Set(baseFolders || []), [baseFolders]);

  const managedFolderItems = useMemo(() => {
    const query = (folderSearchQuery || '').trim().toLowerCase();
    const list = folders.map((name) => ({
      name,
      isBase: baseFolderSet.has(name),
    }));
    const filtered = query
      ? list.filter((item) => item.name.toLowerCase().includes(query))
      : list;
    const sorted = [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return isSortAscending ? comparison : -comparison;
    });
    return sorted;
  }, [folders, baseFolderSet, folderSearchQuery, isSortAscending]);

  const scrollToFolder = useCallback((folderName) => {
    const scrollView = folderChipScrollRef.current;
    const positions = folderChipPositionsRef.current;
    if (!scrollView || !positions[folderName]) return;
    const { x } = positions[folderName];
    const targetX = Math.max(x - 20, 0);
    try {
      scrollView.scrollTo({ x: targetX, animated: true });
    } catch {
      // Ignore scroll errors
    }
  }, []);

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

  const handleManageRequiresPro = useCallback(() => {
    if (typeof onRequestUpgrade === 'function') {
      onRequestUpgrade('pro');
    }
    Alert.alert('Pro required', 'Upgrade to Pro to manage folders.');
  }, [onRequestUpgrade]);

  const handleOpenManageFolders = useCallback(() => {
    setShowAddFolderInput(false);
    setFolderSearchQuery('');
    setIsSortAscending(true);
    setFolderBeingEdited(null);
    setEditingFolderName('');
    setIsManageModalVisible(true);
  }, []);

  const handleCloseManageFolders = useCallback(() => {
    setIsManageModalVisible(false);
    setFolderSearchQuery('');
    setFolderBeingEdited(null);
    setEditingFolderName('');
  }, []);

  const handleToggleSortOrder = useCallback(() => {
    setIsSortAscending((prev) => !prev);
  }, []);

  const handleStartRenameFolder = useCallback((folderName) => {
    setFolderBeingEdited(folderName);
    setEditingFolderName(folderName);
  }, []);

  const handleRenameCancel = useCallback(() => {
    setFolderBeingEdited(null);
    setEditingFolderName('');
  }, []);

  const handleRenameSubmit = useCallback(() => {
    if (!folderBeingEdited) return;
    const trimmed = (editingFolderName || '').trim();
    if (!trimmed) {
      Alert.alert('Folder name required', 'Please enter a folder name.');
      return;
    }
    const result = renameFolder(folderBeingEdited, trimmed);
    if (!result?.success) {
      const message = result?.error || 'Please try again.';
      if (message.toLowerCase().includes('upgrade') && typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('pro');
      }
      Alert.alert('Unable to rename folder', message);
      return;
    }
    setFolderBeingEdited(null);
    setEditingFolderName('');
  }, [folderBeingEdited, editingFolderName, renameFolder, onRequestUpgrade]);

  const handleDeleteFolderConfirm = useCallback((folderName) => {
    Alert.alert(
      'Delete folder',
      `Delete "${folderName}"? Tasks will move to your default folder.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = deleteFolder(folderName);
            if (!result?.success) {
              const message = result?.error || 'Please try again.';
              if (message.toLowerCase().includes('upgrade') && typeof onRequestUpgrade === 'function') {
                onRequestUpgrade('pro');
              }
              Alert.alert('Unable to delete folder', message);
              return;
            }
            if (folderBeingEdited === folderName) {
              setFolderBeingEdited(null);
              setEditingFolderName('');
            }
          },
        },
      ],
    );
  }, [deleteFolder, folderBeingEdited, onRequestUpgrade]);

  const handleManageSelectFolder = useCallback((folderName) => {
    if (!folderName) return;
    if (folderName !== 'All' && !folders.includes(folderName)) return;
    setActiveFolder(folderName);
    if (folderName !== 'All' && folders.includes(folderName)) {
      setSelectedFolder(folderName);
    }
    handleCloseManageFolders();
    const schedule = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb) => setTimeout(cb, 0);
    schedule(() => {
      scrollToFolder(folderName);
    });
  }, [folders, handleCloseManageFolders, scrollToFolder, setActiveFolder, setSelectedFolder]);

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
        folderSelectWrapper: {
          marginTop: 12,
        },
        folderHint: {
          marginTop: 6,
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
        },
        folderChipsSection: {
          marginTop: 22,
          gap: 10,
        },
        folderHeaderRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        folderHeaderText: {
          fontSize: scaleFont(13, fontScale),
          fontWeight: '600',
          color: palette.textSecondary,
        },
        addFolderButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 12,
          backgroundColor: palette.filterBackground,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          gap: 6,
        },
        addFolderButtonText: {
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
        },
        addFolderInputRow: {
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        addFolderInput: {
          flex: 1,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          backgroundColor: palette.inputBackground,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: palette.textPrimary,
          fontSize: scaleFont(14, fontScale),
        },
        addFolderActions: {
          flexDirection: 'row',
          gap: 8,
        },
        addFolderActionButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: palette.addButtonBackground,
        },
        addFolderActionText: {
          color: palette.addButtonText,
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
        },
        addFolderCancelButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: palette.filterBackground,
          borderWidth: 1,
          borderColor: palette.filterBorder,
        },
        folderHeaderActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        manageModalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(15,23,42,0.32)',
          justifyContent: 'center',
          paddingHorizontal: 20,
        },
        manageModalBackdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'transparent',
        },
        manageModalCard: {
          borderRadius: 20,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          padding: 20,
          gap: 16,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.28 : 0.15,
          shadowRadius: 24,
          elevation: 8,
        },
        manageModalHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        manageModalTitle: {
          fontSize: scaleFont(16, fontScale),
          fontWeight: '700',
          color: palette.textPrimary,
        },
        manageModalCloseButton: {
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 12,
          backgroundColor: palette.filterBackground,
        },
        manageModalCloseText: {
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
        },
        manageInfoBox: {
          backgroundColor: palette.accentSoft,
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: palette.filterBorder,
        },
        manageInfoText: {
          fontSize: scaleFont(12, fontScale),
          color: palette.accent,
          fontWeight: '600',
        },
        manageModalSearchInput: {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          backgroundColor: palette.inputBackground,
          paddingHorizontal: 14,
          paddingVertical: 10,
          color: palette.textPrimary,
          fontSize: scaleFont(14, fontScale),
        },
        manageModalSortRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        manageModalSortText: {
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
        },
        manageModalSortButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 12,
          backgroundColor: palette.filterBackground,
          borderWidth: 1,
          borderColor: palette.filterBorder,
        },
        manageModalList: {
          maxHeight: 300,
        },
        manageFolderRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 10,
          gap: 12,
        },
        manageFolderInfoButton: {
          flex: 1,
        },
        manageFolderInfo: {
          flex: 1,
          gap: 6,
        },
        manageFolderName: {
          fontSize: scaleFont(14, fontScale),
          fontWeight: '600',
          color: palette.textPrimary,
        },
        manageFolderBadge: {
          alignSelf: 'flex-start',
          marginTop: 2,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 10,
          backgroundColor: palette.filterBackground,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          fontSize: scaleFont(11, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
        },
        manageFolderInput: {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          backgroundColor: palette.inputBackground,
          paddingHorizontal: 12,
          paddingVertical: 8,
          color: palette.textPrimary,
          fontSize: scaleFont(14, fontScale),
        },
        manageFolderActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        manageIconButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: palette.filterBorder,
          backgroundColor: palette.filterBackground,
        },
        manageIconButtonDisabled: {
          opacity: 0.4,
        },
        manageActionButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          backgroundColor: palette.filterBackground,
        },
        manageSaveButton: {
          backgroundColor: palette.addButtonBackground,
          borderColor: palette.addButtonBackground,
        },
        manageCancelButton: {
          borderColor: palette.filterBorder,
        },
        manageActionButtonText: {
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
          color: palette.addButtonText,
        },
        manageCancelButtonText: {
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
          color: palette.textSecondary,
        },
        manageEmptyMessage: {
          marginTop: 20,
          textAlign: 'center',
          fontSize: scaleFont(13, fontScale),
          color: palette.textSecondary,
        },
        folderChipScroll: {
          marginTop: 10,
        },
        folderChipRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 6,
        },
        folderChip: {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: palette.filterBorder,
          backgroundColor: palette.filterBackground,
        },
        folderChipActive: {
          borderColor: palette.accent,
          backgroundColor: palette.accentSoft,
        },
        folderChipText: {
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
          color: palette.textSecondary,
        },
        folderChipTextActive: {
          color: palette.accent,
        },
        inputActionsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginTop: 12,
        },
        listActionsRow: {
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
        taskListContainer: {
          marginTop: 12,
          position: 'relative',
        },
        taskList: {
          maxHeight: 420,
        },
        taskListContent: {
          gap: 12,
          paddingBottom: 24,
        },
        quickFilterOverlay: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
        },
        quickFilterBackdrop: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 80,
        },
        quickFilterContentWrapper: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: -20,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingVertical: 16,
        },
        quickFilterContent: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        quickFilterPopup: {
          marginRight: 10,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 16,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.3 : 0.16,
          shadowRadius: 18,
          elevation: 8,
          width: 150,
        },
        quickFilterPopupArrow: {
          position: 'absolute',
          right: -7,
          top: '50%',
          marginTop: -7,
          width: 14,
          height: 14,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          borderLeftWidth: 0,
          borderBottomWidth: 0,
          transform: [{ rotate: '45deg' }],
        },
        quickFilterOption: {
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 12,
        },
        quickFilterOptionActive: {
          backgroundColor: palette.filterActive,
        },
        quickFilterOptionText: {
          fontSize: scaleFont(14, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
          textAlign: 'left',
        },
        quickFilterOptionTextActive: {
          color: palette.chipIcon,
        },
        quickFilterButton: {
          width: 40,
          height: 64,
          borderRadius: 20,
          backgroundColor: palette.accent,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.32 : 0.18,
          shadowRadius: 12,
          elevation: 6,
        },
        quickFilterButtonInner: {
          width: 34,
          height: 58,
          borderRadius: 18,
          backgroundColor: palette.accent,
          justifyContent: 'center',
          alignItems: 'center',
        },
        quickFilterButtonIcon: {
          transform: [{ rotate: '-90deg' }],
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

  const ensureVoiceModule = useCallback(
    () => Voice && typeof Voice.start === 'function' && typeof Voice.stop === 'function',
    [],
  );

  const handleVoicePress = useCallback(async () => {
    if (!hasPro) {
      if (typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('pro');
      }
      return;
    }
    if (!voiceAvailable || !ensureVoiceModule()) {
      Alert.alert('Microphone unavailable', 'Speech recognition is not available on this device.');
      return;
    }
    try {
      if (isListening) {
        await Voice.stop?.();
        setVoiceStatus('Processing...');
      } else {
        voiceHandledRef.current = false;
        setVoiceStatus('Listening...');
        setVoiceError('');
        await Voice.start?.('en-US');
        setIsListening(true);
      }
    } catch (err) {
      console.warn('Voice error:', err);
      setIsListening(false);
      setVoiceStatus('');
      const message = err?.message || 'Failed to start voice recognition';
      setVoiceError(message);
      Alert.alert('Voice error', message);
    }
  }, [hasPro, onRequestUpgrade, voiceAvailable, isListening, ensureVoiceModule]);

  useEffect(() => {
    if (!hasPro || !ensureVoiceModule()) {
      setVoiceAvailable(false);
      return undefined;
    }

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
      console.warn('Speech error', event);
      setIsListening(false);
      setVoiceStatus('');
      const message = event?.error?.message || 'Microphone error occurred';
      setVoiceError(message);
      Alert.alert('Voice error', message);
    };

    (async () => {
      try {
        if (typeof Voice.requestPermissions === 'function') {
          await Voice.requestPermissions();
        }
      } catch (err) {
        console.warn('Voice permission error', err);
      }

      try {
        if (typeof Voice.isAvailable === 'function') {
          const available = await Voice.isAvailable();
          setVoiceAvailable(Boolean(available));
        } else {
          setVoiceAvailable(false);
        }
      } catch (err) {
        console.warn('Voice availability error:', err);
        setVoiceAvailable(false);
      }
    })();

    return () => {
      if (typeof Voice.destroy === 'function') {
        Voice.destroy()
          .then(() => {
            if (typeof Voice.removeAllListeners === 'function') {
              Voice.removeAllListeners();
            }
          })
          .catch(() => {});
      }
    };
  }, [hasPro, handleVoiceResult, ensureVoiceModule]);

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
        autoExitSelectionRef.current = false;
      }
      if (!prev) {
        autoExitSelectionRef.current = false;
      }
      return !prev;
    });
  }, [hasPro, onRequestUpgrade]);

  const toggleQuickFilterPopup = useCallback(() => {
    setQuickFilterPopupVisible((prev) => !prev);
  }, []);

  const handleQuickFilterSelect = useCallback((filter) => {
    setActiveFilter(filter.toLowerCase());
    setQuickFilterPopupVisible(false);
  }, [setActiveFilter]);

  const handleSelectTask = useCallback((taskId) => {
    setSelectedTaskIds((prev) => {
      if (prev.includes(taskId)) {
        const next = prev.filter((id) => id !== taskId);
        return next;
      }
      autoExitSelectionRef.current = true;
      return [...prev, taskId];
    });
  }, []);

  const handleStartTaskSelection = useCallback((taskId) => {
    if (!hasPro) {
      if (typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('pro');
      }
      return;
    }

    if (!isSelectionMode) {
      setIsSelectionMode(true);
      autoExitSelectionRef.current = true;
      setSelectedTaskIds([taskId]);
      return;
    }

    setSelectedTaskIds((prev) => {
      if (prev.includes(taskId)) {
        return prev;
      }
      autoExitSelectionRef.current = true;
      return [...prev, taskId];
    });
  }, [hasPro, isSelectionMode, onRequestUpgrade]);

  const handleSelectAll = useCallback(() => {
    if (!tasksToShow.length) return;
    const allIds = tasksToShow.map((task) => task.id);
    if (allIds.length) {
      autoExitSelectionRef.current = true;
    }
    setSelectedTaskIds(allIds);
  }, [tasksToShow]);

  const handleClearSelection = useCallback(() => {
    if (selectedTaskIds.length) {
      autoExitSelectionRef.current = true;
    }
    setSelectedTaskIds([]);
  }, [selectedTaskIds]);

  useEffect(() => {
    setQuickFilterPopupVisible(false);
  }, [activeFilter]);

  const handleBulkComplete = useCallback(() => {
    if (!selectedCount) return;
    completeTasksBulk(selectedTaskIds);
    Alert.alert('Tasks updated', 'Selected tasks marked as done.');
    setSelectedTaskIds([]);
    setIsSelectionMode(false);
    autoExitSelectionRef.current = false;
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
            autoExitSelectionRef.current = false;
          },
        },
      ],
    );
  }, [selectedCount, selectedTaskIds, deleteTasksBulk]);

  useEffect(() => {
    if (isSelectionMode && selectedTaskIds.length === 0 && autoExitSelectionRef.current) {
      autoExitSelectionRef.current = false;
      setIsSelectionMode(false);
    }
  }, [isSelectionMode, selectedTaskIds.length]);

  const handleToggleAddFolderInput = useCallback(() => {
    if (!hasPro) {
      if (typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('pro');
      }
      return;
    }
    setShowAddFolderInput((prev) => !prev);
    setNewFolderName('');
  }, [hasPro, onRequestUpgrade]);

  const handleAddFolderSubmit = useCallback(() => {
    const trimmed = (newFolderName || '').trim();
    if (!trimmed) {
      Alert.alert('Folder name required', 'Please enter a folder name.');
      return;
    }
    const result = addFolder(trimmed);
    if (!result?.success) {
      Alert.alert('Unable to add folder', result?.error || 'Please try again.');
      return;
    }
    setShowAddFolderInput(false);
    setNewFolderName('');
    if (result.folder) {
      setActiveFolder(result.folder);
      setSelectedFolder(result.folder);
    }
  }, [addFolder, newFolderName, setActiveFolder, setSelectedFolder]);

  const handleAddFolderCancel = useCallback(() => {
    setShowAddFolderInput(false);
    setNewFolderName('');
  }, []);

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

        <View style={homeStyles.folderSelectWrapper}>
          <SelectList
            setSelected={handleFolderSelect}
            data={folderOptions}
            save="key"
            placeholder="Folder"
            defaultOption={folderDefaultOption}
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
            <Text style={homeStyles.folderHint}>
              Free plan includes Personal and Work folders. Upgrade to Pro to create more.
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

        <AllDays
          Days={Days}
          dayFilter={dayFilter}
          setDayFilter={setDayFilter}
          dayCounts={dayCounts}
          theme={theme}
          fontScale={fontScale}
        />

        <View style={homeStyles.folderChipsSection}>
          <View style={homeStyles.folderHeaderRow}>
            <Text style={homeStyles.folderHeaderText}>Folders</Text>
            <View style={homeStyles.folderHeaderActions}>
              <TouchableOpacity
                style={homeStyles.addFolderButton}
                onPress={handleToggleAddFolderInput}
                activeOpacity={hasPro ? 0.85 : 1}
              >
                <MaterialIcons
                  name="create-new-folder"
                  size={16}
                  color={palette.textSecondary}
                />
                <Text style={homeStyles.addFolderButtonText}>
                  {hasPro ? 'Add folder' : 'Add folder (PRO)'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={homeStyles.addFolderButton}
                onPress={handleOpenManageFolders}
                activeOpacity={0.85}
              >
                <MaterialIcons
                  name="folder-open"
                  size={16}
                  color={palette.textSecondary}
                />
                <Text style={homeStyles.addFolderButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!hasPro && (
            <Text style={homeStyles.folderHint}>
              Upgrade to Pro to group tasks into unlimited folders.
            </Text>
          )}

          {showAddFolderInput && (
            <View style={homeStyles.addFolderInputRow}>
              <TextInput
                style={homeStyles.addFolderInput}
                placeholder="Folder name"
                placeholderTextColor={palette.inputPlaceholder}
                value={newFolderName}
                onChangeText={setNewFolderName}
              />
              <View style={homeStyles.addFolderActions}>
                <TouchableOpacity
                  style={homeStyles.addFolderActionButton}
                  onPress={handleAddFolderSubmit}
                >
                  <Text style={homeStyles.addFolderActionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={homeStyles.addFolderCancelButton}
                  onPress={handleAddFolderCancel}
                >
                  <Text style={homeStyles.addFolderButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <ScrollView
            ref={folderChipScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={homeStyles.folderChipScroll}
          >
            <View style={homeStyles.folderChipRow}>
              {folderChipList.map((folderName) => {
                const isActive = activeFolder === folderName;
                return (
                  <TouchableOpacity
                    key={folderName}
                    style={[
                      homeStyles.folderChip,
                      isActive && homeStyles.folderChipActive,
                    ]}
                    onPress={() => handleFolderChipPress(folderName)}
                    onLayout={({ nativeEvent }) => {
                      const layout = nativeEvent?.layout;
                      if (!layout || typeof layout.x !== 'number') return;
                      folderChipPositionsRef.current[folderName] = {
                        x: layout.x,
                        width: layout.width,
                      };
                    }}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text
                      style={[
                        homeStyles.folderChipText,
                        isActive && homeStyles.folderChipTextActive,
                      ]}
                    >
                      {folderName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <Modal
          visible={isManageModalVisible}
          animationType="fade"
          transparent
          onRequestClose={handleCloseManageFolders}
        >
          <View style={homeStyles.manageModalOverlay}>
            <TouchableOpacity
              style={homeStyles.manageModalBackdrop}
              activeOpacity={1}
              onPress={handleCloseManageFolders}
            />
            <View style={homeStyles.manageModalCard}>
              <View style={homeStyles.manageModalHeader}>
                <Text style={homeStyles.manageModalTitle}>Manage folders</Text>
                <TouchableOpacity
                  style={homeStyles.manageModalCloseButton}
                  onPress={handleCloseManageFolders}
                >
                  <Text style={homeStyles.manageModalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>

              {!hasPro && (
                <View style={homeStyles.manageInfoBox}>
                  <Text style={homeStyles.manageInfoText}>
                    Upgrade to Pro to create, rename, or delete additional folders.
                  </Text>
                </View>
              )}

              <TextInput
                style={homeStyles.manageModalSearchInput}
                placeholder="Search folders"
                placeholderTextColor={palette.inputPlaceholder}
                value={folderSearchQuery}
                onChangeText={setFolderSearchQuery}
              />

              <View style={homeStyles.manageModalSortRow}>
                <Text style={homeStyles.manageModalSortText}>
                  Sorted {isSortAscending ? 'A to Z' : 'Z to A'}
                </Text>
                <TouchableOpacity
                  style={homeStyles.manageModalSortButton}
                  onPress={handleToggleSortOrder}
                >
                  <MaterialIcons
                    name={isSortAscending ? 'south' : 'north'}
                    size={16}
                    color={palette.textSecondary}
                  />
                  <Text style={homeStyles.addFolderButtonText}>
                    {isSortAscending ? 'A-Z' : 'Z-A'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={homeStyles.manageModalList}
                contentContainerStyle={{ paddingVertical: 4 }}
                showsVerticalScrollIndicator={false}
              >
                {managedFolderItems.length ? (
                  managedFolderItems.map(({ name, isBase }) => {
                    const isEditing = folderBeingEdited === name;
                    const canModify = hasPro && !isBase;
                    return (
                      <View key={name} style={homeStyles.manageFolderRow}>
                        {isEditing ? (
                          <View style={homeStyles.manageFolderInfo}>
                            <TextInput
                              style={homeStyles.manageFolderInput}
                              value={editingFolderName}
                              onChangeText={setEditingFolderName}
                              placeholder="Folder name"
                              placeholderTextColor={palette.inputPlaceholder}
                            />
                            {isBase && (
                              <Text style={homeStyles.manageFolderBadge}>Default</Text>
                            )}
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={homeStyles.manageFolderInfoButton}
                            onPress={() => handleManageSelectFolder(name)}
                            activeOpacity={0.85}
                          >
                            <View style={homeStyles.manageFolderInfo}>
                              <Text style={homeStyles.manageFolderName}>{name}</Text>
                              {isBase && (
                                <Text style={homeStyles.manageFolderBadge}>Default</Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        )}
                        <View style={homeStyles.manageFolderActions}>
                          {isEditing ? (
                            <>
                              <TouchableOpacity
                                style={[
                                  homeStyles.manageActionButton,
                                  homeStyles.manageSaveButton,
                                ]}
                                onPress={handleRenameSubmit}
                              >
                                <Text style={homeStyles.manageActionButtonText}>Save</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  homeStyles.manageActionButton,
                                  homeStyles.manageCancelButton,
                                ]}
                                onPress={handleRenameCancel}
                              >
                                <Text style={homeStyles.manageCancelButtonText}>Cancel</Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <>
                              <TouchableOpacity
                                style={[
                                  homeStyles.manageIconButton,
                                  (!canModify) && homeStyles.manageIconButtonDisabled,
                                ]}
                                onPress={() => {
                                  if (!hasPro) {
                                    handleManageRequiresPro();
                                    return;
                                  }
                                  if (isBase) {
                                    Alert.alert('Default folder', 'Default folders cannot be renamed.');
                                    return;
                                  }
                                  handleStartRenameFolder(name);
                                }}
                                activeOpacity={canModify ? 0.85 : 1}
                              >
                                <MaterialIcons
                                  name="edit"
                                  size={16}
                                  color={palette.textSecondary}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  homeStyles.manageIconButton,
                                  (!canModify) && homeStyles.manageIconButtonDisabled,
                                ]}
                                onPress={() => {
                                  if (!hasPro) {
                                    handleManageRequiresPro();
                                    return;
                                  }
                                  if (isBase) {
                                    Alert.alert('Default folder', 'Default folders cannot be deleted.');
                                    return;
                                  }
                                  handleDeleteFolderConfirm(name);
                                }}
                                activeOpacity={canModify ? 0.85 : 1}
                              >
                                <MaterialIcons
                                  name="delete-outline"
                                  size={16}
                                  color={palette.textSecondary}
                                />
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={homeStyles.manageEmptyMessage}>No folders found.</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Text style={homeStyles.todoListHeading}>Todo list</Text>
        <TextInput
          style={homeStyles.searchInput}
          placeholder="Search your tasks"
          placeholderTextColor={palette.inputPlaceholder}
          value={searchAllTodoListItem}
          onChangeText={setSearchAllTodoListItem}
          returnKeyType="search"
        />

        <View style={homeStyles.listActionsRow}>
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

        <View style={homeStyles.taskListContainer}>
          <ScrollView
            style={homeStyles.taskList}
            contentContainerStyle={homeStyles.taskListContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
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
                  onLongPressSelect={() => handleStartTaskSelection(task.id)}
                  theme={theme}
                  fontScale={fontScale}
                />
              ))
            ) : (
              <Text style={homeStyles.emptyState}>
                Your list is clear—add a task to get started.
              </Text>
            )}
          </ScrollView>

          <View pointerEvents="box-none" style={homeStyles.quickFilterOverlay}>
            {isQuickFilterPopupVisible && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setQuickFilterPopupVisible(false)}
                style={homeStyles.quickFilterBackdrop}
              />
            )}
            <View pointerEvents="box-none" style={homeStyles.quickFilterContentWrapper}>
              <View style={homeStyles.quickFilterContent}>
                {isQuickFilterPopupVisible && (
                  <View style={homeStyles.quickFilterPopup}>
                    <View style={homeStyles.quickFilterPopupArrow} />
                    {QUICK_FILTERS.map((filter) => {
                      const isActive =
                        activeFilter.toLowerCase() === filter.toLowerCase();
                      return (
                        <TouchableOpacity
                          key={filter}
                          style={[
                            homeStyles.quickFilterOption,
                            isActive && homeStyles.quickFilterOptionActive,
                          ]}
                          onPress={() => handleQuickFilterSelect(filter)}
                          activeOpacity={0.85}
                        >
                          <Text
                            style={[
                              homeStyles.quickFilterOptionText,
                              isActive && homeStyles.quickFilterOptionTextActive,
                            ]}
                          >
                            {filter}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                <TouchableOpacity
                  style={homeStyles.quickFilterButton}
                  onPress={toggleQuickFilterPopup}
                  activeOpacity={0.85}
                >
                  <View style={homeStyles.quickFilterButtonInner}>
                    <MaterialIcons
                      name={isQuickFilterPopupVisible ? 'close' : 'tune'}
                      size={20}
                      color="#FFFFFF"
                      style={isQuickFilterPopupVisible ? undefined : homeStyles.quickFilterButtonIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
