import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const clampProgress = (progress) => {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(Math.max(progress, 0), 100);
};

const CircularProgressBar = ({
  progress = 0,
  size = 144,
  strokeWidth = 12,
  color = '#4C51C6',
  backgroundColor = '#E4E7FF',
}) => {
  const safeProgress = clampProgress(progress);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;
  const gradientId = 'progressGradient';

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#6366F1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: '#101828',
          }}
        >
          {safeProgress}%
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#475467',
            marginTop: 2,
          }}
        >
          Complete
        </Text>
      </View>
    </View>
  );
};

const parseDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? new Date(value) : new Date(`${value}`);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export default function ProgressPage({ styles, savedTodoTasks }) {
  const tasks = Array.isArray(savedTodoTasks) ? savedTodoTasks : [];
  const totalTasks = tasks.length;

  const completedCount = useMemo(
    () => tasks.filter((task) => task?.completed).length,
    [tasks],
  );

  const pendingCount = Math.max(totalTasks - completedCount, 0);

  const completionRate = totalTasks
    ? Math.round((completedCount / totalTasks) * 100)
    : 0;

  const overdueCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task || task.completed) return false;
      const dueDate = parseDate(task.dueDateISO || task.dueDate);
      if (!dueDate) return false;
      return dueDate < today;
    }).length;
  }, [tasks]);

  const importantCount = useMemo(
    () => tasks.filter((task) => task?.important).length,
    [tasks],
  );

  const progressMessage = useMemo(() => {
    if (!totalTasks) return 'Add tasks to start tracking your progress.';
    if (completionRate >= 80) return 'You are crushing your goals today!';
    if (completionRate >= 50) return 'Solid momentum—keep it going!';
    return 'Focus on the priority tasks to build momentum.';
  }, [completionRate, totalTasks]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((task) => task && !task.completed)
      .map((task, index) => {
        const dueDate = parseDate(task.dueDateISO || task.dueDate);
        const label = dueDate
          ? dueDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })
          : 'No due date';

        const overdue = !!dueDate && dueDate < today;

        return {
          key: task.id || `${task.title || 'task'}-${index}`,
          title: task.title || 'Untitled task',
          dueLabel: label,
          isOverdue: overdue,
          isImportant: !!task.important,
          dueTime: dueDate ? dueDate.getTime() : Number.MAX_SAFE_INTEGER,
        };
      })
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.dueTime === b.dueTime) {
          return a.title.localeCompare(b.title);
        }
        return a.dueTime - b.dueTime;
      })
      .slice(0, 3);
  }, [tasks]);

  const highlightBadges = [
    { label: 'On track', visible: completionRate >= 70 },
    { label: 'Momentum boost', visible: completedCount >= 5 },
    { label: 'High impact focus', visible: importantCount > 0 },
  ].filter((item) => item.visible);

  const dailySnapshot = useMemo(
    () => [
      {
        label: 'Tasks today',
        value: totalTasks,
        icon: 'calendar-today',
      },
      {
        label: 'Important',
        value: importantCount,
        icon: 'star',
        tone: 'accent',
      },
      {
        label: 'Streak',
        value: Math.max(completedCount - overdueCount, 0),
        icon: 'local-fire-department',
        tone: 'warning',
      },
    ],
    [totalTasks, importantCount, completedCount, overdueCount],
  );

  return (
    <ScrollView
      style={styles.progressScreen}
      contentContainerStyle={styles.progressScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.progressHeader}>
        <View style={styles.progressIconButton}>
          <MaterialIcons name="arrow-back" size={22} color="#101828" />
        </View>
        <View>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressSubtitle}>See how far you've come today</Text>
        </View>
        <View style={styles.progressIconPlaceholder} />
      </View>

      <View style={styles.progressSummaryCard}>
        <View style={styles.summaryAura} pointerEvents="none" />
        <View style={styles.summaryTextGroup}>
          <Text style={styles.summaryLabel}>Today&apos;s completion</Text>
          <Text style={styles.summaryValue}>{completionRate}%</Text>
          <Text style={styles.summaryMessage}>{progressMessage}</Text>

          <View style={styles.summaryBadgeRow}>
            {(highlightBadges.length ? highlightBadges : [{ label: 'Getting started' }]).map(
              (badge) => (
                <Text key={badge.label} style={styles.summaryBadge}>
                  {badge.label}
                </Text>
              ),
            )}
          </View>
        </View>
        <View style={styles.progressGaugeWrapper}>
          <CircularProgressBar progress={completionRate} />
        </View>
      </View>

      <View style={styles.snapshotRow}>
        {dailySnapshot.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.snapshotChip,
              index === dailySnapshot.length - 1 && styles.snapshotChipLast,
              item.tone === 'accent' && styles.snapshotChipAccent,
              item.tone === 'warning' && styles.snapshotChipWarning,
            ]}
          >
            <View
              style={[
                styles.snapshotIconWrapper,
                item.tone === 'accent' && styles.snapshotIconWrapperAccent,
                item.tone === 'warning' && styles.snapshotIconWrapperWarning,
              ]}
            >
              <MaterialIcons
                name={item.icon}
                size={16}
                color={item.tone === 'accent' ? '#7C3AED' : item.tone === 'warning' ? '#EA580C' : '#2563EB'}
              />
            </View>
            <Text style={styles.snapshotValue}>{item.value}</Text>
            <Text style={styles.snapshotLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metricGrid}>
        <View style={[styles.metricCard, styles.metricCardSuccess]}>
          <View style={[styles.metricIcon, styles.metricIconSuccess]}>
            <MaterialIcons name="check-circle" size={22} color="#16A34A" />
          </View>
          <Text style={styles.metricValue}>{completedCount}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </View>

        <View style={[styles.metricCard, styles.metricCardNeutral]}>
          <View style={[styles.metricIcon, styles.metricIconNeutral]}>
            <MaterialIcons name="pending-actions" size={22} color="#2563EB" />
          </View>
          <Text style={styles.metricValue}>{pendingCount}</Text>
          <Text style={styles.metricLabel}>In progress</Text>
        </View>

        <View style={[styles.metricCard, styles.metricCardAccent, styles.metricCardFull]}>
          <View style={[styles.metricIcon, styles.metricIconAccent]}>
            <MaterialIcons name="report-problem" size={22} color="#DC2626" />
          </View>
          <View style={styles.metricTextGroup}>
            <Text style={styles.metricValue}>{overdueCount}</Text>
            <Text style={styles.metricLabel}>Overdue tasks</Text>
            <Text style={styles.metricHelperText}>
              {overdueCount
                ? 'Review these first to stay on track.'
                : 'Nothing overdue—nice work staying ahead!'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Focus for today</Text>
        <Text style={styles.sectionSubtitle}>
          Prioritize the next few tasks to keep your streak alive.
        </Text>

        {upcomingTasks.length ? (
          upcomingTasks.map((task, index) => (
            <View
              key={task.key}
              style={[
                styles.highlightItem,
                index === 0 && styles.highlightItemFirst,
                index === upcomingTasks.length - 1 && styles.highlightItemLast,
              ]}
            >
              <View
                style={[
                  styles.highlightIcon,
                  task.isOverdue ? styles.highlightIconOverdue : styles.highlightIconUpcoming,
                ]}
              >
                <MaterialIcons
                  name={task.isOverdue ? 'error-outline' : 'schedule'}
                  size={18}
                  color={task.isOverdue ? '#DC2626' : '#2563EB'}
                />
              </View>
              <View style={styles.highlightTextGroup}>
                <Text style={styles.highlightTitle}>{task.title}</Text>
                <Text
                  style={[
                    styles.highlightMeta,
                    task.isOverdue && styles.highlightMetaOverdue,
                  ]}
                >
                  {task.isOverdue ? `Overdue • ${task.dueLabel}` : `Due ${task.dueLabel}`}
                </Text>
              </View>
              {task.isImportant && (
                <Text style={styles.highlightPill}>Important</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyStateText}>You're all caught up for now.</Text>
        )}
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Productivity tips</Text>
        <View style={styles.tipCard}>
          <View style={[styles.tipIconWrapper, styles.tipIconWrapperEnergy]}>
            <MaterialIcons name="bolt" size={18} color="#EA580C" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Batch similar tasks</Text>
            <Text style={styles.tipDescription}>
              Group tasks that require similar energy levels to finish more in less
              time.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={[styles.tipIconWrapper, styles.tipIconWrapperCalm]}>
            <MaterialIcons name="nightlight" size={18} color="#6366F1" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Protect deep work</Text>
            <Text style={styles.tipDescription}>
              Block a focused session and silence distractions while tackling your
              high impact tasks.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
