import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import getVisibleTasks from './VisibleTasks';
import AllDays from '../AllDays';
import CalendarModal from './CalendarModal';
import TaskCard from './TaskCard';

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
  styles: sharedStyles = {},
  setTheme,
}) {
  const palette = HOME_THEMES[theme] || HOME_THEMES.Light;
  const priorityOptions = [
    { key: '1', value: 'Urgent' },
    { key: '2', value: 'High' },
    { key: '3', value: 'Medium' },
    { key: '4', value: 'Low' },
    { key: '5', value: 'None' },
  ];
  const priorityDefault = useMemo(() => {
    const value = selectedPriority || 'None';
    return priorityOptions.find((option) => option.value === value) || priorityOptions[4];
  }, [selectedPriority]);

  const homeStyles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: palette.screen,
        },
        content: {
          paddingHorizontal: 20,
          paddingBottom: NAV_HEIGHT + 20,
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
          shadowOpacity: theme === 'Dark' ? 0.22 : 0.12,
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
          shadowOpacity: theme === 'Dark' ? 0.25 : 0.12,
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
          shadowOpacity: theme === 'Dark' ? 0.22 : 0.12,
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
      }),
    [palette, theme, NAV_HEIGHT, fontScale],
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
    [currentView, theme, handleNavigate, handleToggleTheme],
  );

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

        <View style={homeStyles.selectListWrapper}>
          <SelectList
            setSelected={setSelectedPriority}
            data={priorityOptions}
            save="value"
            placeholder="Priority"
            defaultOption={priorityDefault}
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
