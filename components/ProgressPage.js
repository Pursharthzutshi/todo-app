import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const PROGRESS_THEMES = {
  Light: {
    screen: '#F8FAFF',
    card: '#FFFFFF',
    elevated: '#F1F5FF',
    cardBorder: 'rgba(15,23,42,0.08)',
    cardShadow: '#312E81',
    iconShadow: '#4338CA',
    textPrimary: '#0F172A',
    textSecondary: '#475467',
    accent: '#6366F1',
    accentSoft: '#EEF2FF',
    gaugeTrack: '#E4E7FF',
    gaugeGradient: ['#A855F7', '#6366F1'],
    badgeText: '#4F46E5',
    snapshotBase: '#F1F5FF',
    snapshotAccent: '#F7ECFF',
    snapshotWarning: '#FEF4EC',
    snapshotIconBase: '#E0E7FF',
    snapshotIconAccent: '#F3E8FF',
    snapshotIconWarning: '#FFE8D7',
    snapshotIconBaseColor: '#2563EB',
    snapshotIconAccentColor: '#7C3AED',
    snapshotIconWarningColor: '#EA580C',
    snapshotValue: '#111827',
    snapshotLabel: '#475467',
    metricCard: '#FFFFFF',
    metricSuccessBg: '#ECFDF3',
    metricNeutralBg: '#EFF6FF',
    metricAccentBg: '#FEF3F2',
    metricIconSuccessBg: '#DCFCE7',
    metricIconNeutralBg: '#DBEAFE',
    metricIconAccentBg: '#FEE2E2',
    metricIconSuccessColor: '#16A34A',
    metricIconNeutralColor: '#2563EB',
    metricIconAccentColor: '#DC2626',
    metricHelper: '#7F1D1D',
    highlightUpcomingBg: '#DBEAFE',
    highlightOverdueBg: '#FEE2E2',
    highlightIconPrimary: '#2563EB',
    highlightIconOverdue: '#DC2626',
    highlightOverdueText: '#B91C1C',
    highlightPillBg: '#FFEDD5',
    highlightPillText: '#C2410C',
    emptyState: '#475467',
    tipCardBg: '#F5F5FF',
    tipEnergyBg: '#FFF7ED',
    tipCalmBg: '#EEF2FF',
    tipTitle: '#1F2937',
    tipDescription: '#475467',
    tipEnergyIcon: '#EA580C',
    tipCalmIcon: '#6366F1',
  },
  Dark: {
    screen: '#0B1120',
    card: '#111C2E',
    elevated: '#15213A',
    cardBorder: 'rgba(129,140,248,0.18)',
    cardShadow: 'rgba(2,6,23,0.7)',
    iconShadow: 'rgba(2,6,23,0.6)',
    textPrimary: '#F8FAFF',
    textSecondary: '#CBD5F5',
    accent: '#818CF8',
    accentSoft: 'rgba(129,140,248,0.2)',
    gaugeTrack: 'rgba(129,140,248,0.35)',
    gaugeGradient: ['#4C1D95', '#818CF8'],
    badgeText: '#C7D2FE',
    snapshotBase: '#15213A',
    snapshotAccent: 'rgba(168,85,247,0.25)',
    snapshotWarning: 'rgba(251,146,60,0.25)',
    snapshotIconBase: 'rgba(99,102,241,0.35)',
    snapshotIconAccent: 'rgba(168,85,247,0.4)',
    snapshotIconWarning: 'rgba(251,146,60,0.4)',
    snapshotIconBaseColor: '#93C5FD',
    snapshotIconAccentColor: '#D8B4FE',
    snapshotIconWarningColor: '#FDBA74',
    snapshotValue: '#F8FAFF',
    snapshotLabel: '#CBD5F5',
    metricCard: '#111C2E',
    metricSuccessBg: 'rgba(34,197,94,0.18)',
    metricNeutralBg: 'rgba(59,130,246,0.18)',
    metricAccentBg: 'rgba(248,113,113,0.18)',
    metricIconSuccessBg: 'rgba(34,197,94,0.32)',
    metricIconNeutralBg: 'rgba(59,130,246,0.32)',
    metricIconAccentBg: 'rgba(248,113,113,0.32)',
    metricIconSuccessColor: '#4ADE80',
    metricIconNeutralColor: '#93C5FD',
    metricIconAccentColor: '#FCA5A5',
    metricHelper: '#FCA5A5',
    highlightUpcomingBg: 'rgba(59,130,246,0.24)',
    highlightOverdueBg: 'rgba(248,113,113,0.24)',
    highlightIconPrimary: '#93C5FD',
    highlightIconOverdue: '#FCA5A5',
    highlightOverdueText: '#F87171',
    highlightPillBg: 'rgba(251,146,60,0.22)',
    highlightPillText: '#FDBA74',
    emptyState: '#CBD5F5',
    tipCardBg: '#1E293B',
    tipEnergyBg: 'rgba(251,191,36,0.22)',
    tipCalmBg: 'rgba(129,140,248,0.28)',
    tipTitle: '#E2E8F0',
    tipDescription: '#CBD5F5',
    tipEnergyIcon: '#FBBF24',
    tipCalmIcon: '#A5B4FC',
  },
};

const PROGRESS_THEME_VARIANTS = {
  Pastel: {
    ...PROGRESS_THEMES.Light,
    screen: '#F8F5FF',
    card: '#FFFFFF',
    elevated: '#F3EDFF',
    cardBorder: 'rgba(139,92,246,0.16)',
    cardShadow: 'rgba(139,92,246,0.18)',
    iconShadow: 'rgba(139,92,246,0.22)',
    textPrimary: '#2E1065',
    textSecondary: '#6B21A8',
    accent: '#8B5CF6',
    accentSoft: '#EDE9FE',
    gaugeTrack: '#E9D8FD',
    gaugeGradient: ['#C084FC', '#8B5CF6'],
    badgeText: '#6B21A8',
    snapshotBase: '#EDE9FE',
    snapshotAccent: '#DDD6FE',
    snapshotWarning: '#FCD34D',
    metricCard: '#FFFFFF',
    metricIconAccentBg: '#FCE7F3',
    emptyState: '#6B21A8',
    tipCardBg: '#F3EDFF',
  },
  Mint: {
    ...PROGRESS_THEMES.Light,
    screen: '#F0FBF6',
    card: '#FFFFFF',
    elevated: '#E6FAF0',
    cardBorder: 'rgba(16,185,129,0.16)',
    cardShadow: 'rgba(16,185,129,0.18)',
    iconShadow: 'rgba(16,185,129,0.2)',
    textPrimary: '#064E3B',
    textSecondary: '#047857',
    accent: '#10B981',
    accentSoft: '#D1FAE5',
    gaugeTrack: '#BBF7D0',
    gaugeGradient: ['#34D399', '#10B981'],
    badgeText: '#047857',
    snapshotBase: '#D1FAE5',
    snapshotAccent: '#A7F3D0',
    snapshotWarning: '#FDE68A',
    emptyState: '#0F766E',
    tipCardBg: '#E6FAF0',
  },
  Sunset: {
    ...PROGRESS_THEMES.Light,
    screen: '#FFF7ED',
    card: '#FFFFFF',
    elevated: '#FFEDD5',
    cardBorder: 'rgba(249,115,22,0.16)',
    cardShadow: 'rgba(249,115,22,0.2)',
    iconShadow: 'rgba(249,115,22,0.22)',
    textPrimary: '#7C2D12',
    textSecondary: '#9A3412',
    accent: '#F97316',
    accentSoft: '#FFEDD5',
    gaugeTrack: '#FED7AA',
    gaugeGradient: ['#FB923C', '#F97316'],
    badgeText: '#9A3412',
    snapshotBase: '#FFEDD5',
    snapshotAccent: '#FBD38D',
    snapshotWarning: '#FECACA',
    emptyState: '#F97316',
    tipCardBg: '#FFECD7',
  },
  Pink: {
    ...PROGRESS_THEMES.Light,
    screen: '#FFF5F7',
    card: '#FFFFFF',
    elevated: '#FCE7F3',
    cardBorder: 'rgba(236,72,153,0.16)',
    cardShadow: 'rgba(236,72,153,0.2)',
    iconShadow: 'rgba(236,72,153,0.22)',
    textPrimary: '#831843',
    textSecondary: '#BE185D',
    accent: '#EC4899',
    accentSoft: '#FCE7F3',
    gaugeTrack: '#FBCFE8',
    gaugeGradient: ['#F472B6', '#EC4899'],
    badgeText: '#BE185D',
    snapshotBase: '#FCE7F3',
    snapshotAccent: '#FBCFE8',
    snapshotWarning: '#FDE68A',
    emptyState: '#EC4899',
    tipCardBg: '#FCE7F3',
  },
  Ocean: {
    ...PROGRESS_THEMES.Dark,
    screen: '#0F172A',
    card: '#11243E',
    elevated: '#152C4D',
    cardBorder: 'rgba(56,189,248,0.22)',
    cardShadow: 'rgba(56,189,248,0.28)',
    iconShadow: 'rgba(37,99,235,0.35)',
    textPrimary: '#E0F2FE',
    textSecondary: '#93C5FD',
    accent: '#38BDF8',
    accentSoft: 'rgba(56,189,248,0.24)',
    gaugeTrack: 'rgba(56,189,248,0.35)',
    gaugeGradient: ['#38BDF8', '#0EA5E9'],
    badgeText: '#38BDF8',
    snapshotBase: 'rgba(30,58,138,0.35)',
    snapshotAccent: 'rgba(37,99,235,0.35)',
    snapshotWarning: 'rgba(14,116,144,0.35)',
    metricCard: '#102A44',
    metricIconNeutralBg: 'rgba(37,99,235,0.32)',
    metricIconAccentBg: 'rgba(14,165,233,0.3)',
    metricIconNeutralColor: '#93C5FD',
    metricIconAccentColor: '#67E8F9',
    emptyState: '#93C5FD',
    tipCardBg: '#112A44',
  },
};

Object.assign(PROGRESS_THEMES, PROGRESS_THEME_VARIANTS);

const clampProgress = (progress) => {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(Math.max(progress, 0), 100);
};

const CircularProgressBar = ({
  progress = 0,
  size = 144,
  strokeWidth = 12,
  trackColor,
  gradient,
  textColor,
  labelColor,
  valueSize = 28,
  labelSize = 12,
}) => {
  const safeProgress = clampProgress(progress);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;
  const gradientId = 'progressGradient';
  const gradientStops = Array.isArray(gradient) && gradient.length > 0 ? gradient : ['#A855F7', '#6366F1'];
  const track = trackColor || '#E4E7FF';

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((color, index) => {
              const offset = gradientStops.length === 1 ? 100 : Math.round((index / (gradientStops.length - 1)) * 100);
              return <Stop key={`${color}-${index}`} offset={`${offset}%`} stopColor={color} />;
            })}
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track}
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
            fontSize: valueSize,
            fontWeight: '700',
            color: textColor || '#101828',
          }}
        >
          {safeProgress}%
        </Text>
        <Text
          style={{
            fontSize: labelSize,
            color: labelColor || '#475467',
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

const scaleFont = (value, multiplier) => Math.round(value * multiplier * 100) / 100;

export default function ProgressPage({
  styles,
  savedTodoTasks,
  theme = 'Light',
  fontScale = 1,
}) {
  const palette = PROGRESS_THEMES[theme] || PROGRESS_THEMES.Light;
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

  const badgesToRender = highlightBadges.length
    ? highlightBadges
    : [{ label: 'Getting started' }];

  return (
    <ScrollView
      style={[styles.progressScreen, { backgroundColor: palette.screen }]}
      contentContainerStyle={styles.progressScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.progressHeader}>
        <View
          style={[
            styles.progressIconButton,
            { backgroundColor: palette.card, shadowColor: palette.iconShadow },
          ]}
        >
          <MaterialIcons name="arrow-back" size={22} color={palette.textPrimary} />
        </View>
        <View>
          <Text style={[styles.progressTitle, { color: palette.textPrimary }]}>
            Progress
          </Text>
          <Text style={[styles.progressSubtitle, { color: palette.textSecondary }]}>
            See how far you've come today
          </Text>
        </View>
        <View style={styles.progressIconPlaceholder} />
      </View>

      <View
        style={[
          styles.progressSummaryCard,
          {
            backgroundColor: palette.card,
            borderColor: palette.cardBorder,
            shadowColor: palette.cardShadow,
          },
        ]}
      >
        <View
          style={[styles.summaryAura, { backgroundColor: palette.accentSoft }]}
          pointerEvents="none"
        />
        <View style={styles.summaryTextGroup}>
          <Text style={[styles.summaryLabel, { color: palette.accent }]}>
            Today's completion
          </Text>
          <Text
            style={[
              styles.summaryValue,
              { color: palette.textPrimary, fontSize: scaleFont(44, fontScale) },
            ]}
          >
            {completionRate}%
          </Text>
          <Text
            style={[
              styles.summaryMessage,
              {
                color: palette.textSecondary,
                fontSize: scaleFont(15, fontScale),
                lineHeight: scaleFont(22, fontScale),
              },
            ]}
          >
            {progressMessage}
          </Text>

          <View style={styles.summaryBadgeRow}>
            {badgesToRender.map((badge) => (
              <Text
                key={badge.label}
                style={[
                styles.summaryBadge,
                {
                  backgroundColor: palette.accentSoft,
                  color: palette.badgeText,
                  fontSize: scaleFont(12, fontScale),
                },
              ]}
            >
                {badge.label}
              </Text>
            ))}
          </View>
        </View>
        <View
          style={[
            styles.progressGaugeWrapper,
            { backgroundColor: palette.card, shadowColor: palette.iconShadow },
          ]}
        >
          <CircularProgressBar
            progress={completionRate}
            trackColor={palette.gaugeTrack}
            gradient={palette.gaugeGradient}
            textColor={palette.textPrimary}
            labelColor={palette.textSecondary}
            valueSize={scaleFont(28, fontScale)}
            labelSize={scaleFont(12, fontScale)}
          />
        </View>
      </View>

      <View style={styles.snapshotRow}>
        {dailySnapshot.map((item, index) => {
          const chipBackground =
            item.tone === 'accent'
              ? palette.snapshotAccent
              : item.tone === 'warning'
                ? palette.snapshotWarning
                : palette.snapshotBase;
          const iconWrapperBackground =
            item.tone === 'accent'
              ? palette.snapshotIconAccent
              : item.tone === 'warning'
                ? palette.snapshotIconWarning
                : palette.snapshotIconBase;
          const iconColor =
            item.tone === 'accent'
              ? palette.snapshotIconAccentColor
              : item.tone === 'warning'
                ? palette.snapshotIconWarningColor
                : palette.snapshotIconBaseColor;

          return (
            <View
              key={item.label}
              style={[
                styles.snapshotChip,
                index === dailySnapshot.length - 1 && styles.snapshotChipLast,
                {
                  backgroundColor: chipBackground,
                  borderColor: palette.cardBorder,
                  borderWidth: StyleSheet.hairlineWidth,
                  shadowColor: palette.cardShadow,
                },
              ]}
            >
              <View
                style={[
                  styles.snapshotIconWrapper,
                  { backgroundColor: iconWrapperBackground },
                ]}
              >
                <MaterialIcons name={item.icon} size={16} color={iconColor} />
              </View>
              <Text
                style={[
                  styles.snapshotValue,
                  { color: palette.snapshotValue, fontSize: scaleFont(20, fontScale) },
                ]}
              >
                {item.value}
              </Text>
              <Text
                style={[styles.snapshotLabel, { color: palette.snapshotLabel }]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.metricGrid}>
        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: palette.metricSuccessBg,
              shadowColor: palette.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.metricIcon,
              { backgroundColor: palette.metricIconSuccessBg },
            ]}
          >
            <MaterialIcons
              name="check-circle"
              size={22}
              color={palette.metricIconSuccessColor}
            />
          </View>
          <Text
            style={[
              styles.metricValue,
              { color: palette.textPrimary, fontSize: scaleFont(30, fontScale) },
            ]}
          >
            {completedCount}
          </Text>
          <Text style={[styles.metricLabel, { color: palette.textSecondary }]}>
            Completed
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: palette.metricNeutralBg,
              shadowColor: palette.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.metricIcon,
              { backgroundColor: palette.metricIconNeutralBg },
            ]}
          >
            <MaterialIcons
              name="pending-actions"
              size={22}
              color={palette.metricIconNeutralColor}
            />
          </View>
          <Text
            style={[
              styles.metricValue,
              { color: palette.textPrimary, fontSize: scaleFont(30, fontScale) },
            ]}
          >
            {pendingCount}
          </Text>
          <Text style={[styles.metricLabel, { color: palette.textSecondary }]}>
            In progress
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            styles.metricCardFull,
            {
              backgroundColor: palette.metricAccentBg,
              shadowColor: palette.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.metricIcon,
              { backgroundColor: palette.metricIconAccentBg },
            ]}
          >
            <MaterialIcons
              name="report-problem"
              size={22}
              color={palette.metricIconAccentColor}
            />
          </View>
          <View style={styles.metricTextGroup}>
            <Text
              style={[
                styles.metricValue,
                { color: palette.textPrimary, fontSize: scaleFont(30, fontScale) },
              ]}
            >
              {overdueCount}
            </Text>
            <Text style={[styles.metricLabel, { color: palette.textSecondary }]}>
              Overdue tasks
            </Text>
            <Text
              style={[
                styles.metricHelperText,
                {
                  color: palette.metricHelper,
                  lineHeight: scaleFont(18, fontScale),
                  fontSize: scaleFont(13, fontScale),
                },
              ]}
            >
              {overdueCount
                ? 'Review these first to stay on track.'
                : 'Nothing overdue—nice work staying ahead!'}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.progressSection,
          {
            backgroundColor: palette.card,
            borderColor: palette.cardBorder,
            borderWidth: StyleSheet.hairlineWidth,
            shadowColor: palette.cardShadow,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Focus for today
        </Text>
        <Text style={[styles.sectionSubtitle, { color: palette.textSecondary }]}>
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
                { borderBottomColor: palette.cardBorder },
              ]}
            >
              <View
                style={[
                  styles.highlightIcon,
                  {
                    backgroundColor: task.isOverdue
                      ? palette.highlightOverdueBg
                      : palette.highlightUpcomingBg,
                  },
                ]}
              >
                <MaterialIcons
                  name={task.isOverdue ? 'error-outline' : 'schedule'}
                  size={18}
                  color={
                    task.isOverdue
                      ? palette.highlightIconOverdue
                      : palette.highlightIconPrimary
                  }
                />
              </View>
              <View style={styles.highlightTextGroup}>
                <Text style={[styles.highlightTitle, { color: palette.textPrimary }]}>
                  {task.title}
                </Text>
                <Text
                  style={[
                    styles.highlightMeta,
                    { color: palette.textSecondary, fontSize: scaleFont(13, fontScale) },
                    task.isOverdue && { color: palette.highlightOverdueText },
                  ]}
                >
                  {task.isOverdue ? `Overdue • ${task.dueLabel}` : `Due ${task.dueLabel}`}
                </Text>
              </View>
              {task.isImportant && (
                <Text
                  style={[
                    styles.highlightPill,
                    {
                      backgroundColor: palette.highlightPillBg,
                      color: palette.highlightPillText,
                      fontSize: scaleFont(12, fontScale),
                    },
                  ]}
                >
                  Important
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.emptyStateText, { color: palette.emptyState }]}>
            You're all caught up for now.
          </Text>
        )}
      </View>

      <View
        style={[
          styles.progressSection,
          {
            backgroundColor: palette.card,
            borderColor: palette.cardBorder,
            borderWidth: StyleSheet.hairlineWidth,
            shadowColor: palette.cardShadow,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Productivity tips
        </Text>
        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: palette.tipCardBg,
              shadowColor: palette.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.tipIconWrapper,
              { backgroundColor: palette.tipEnergyBg, shadowColor: palette.iconShadow },
            ]}
          >
            <MaterialIcons name="bolt" size={18} color={palette.tipEnergyIcon} />
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: palette.tipTitle }]}>
              Batch similar tasks
            </Text>
            <Text
              style={[
                styles.tipDescription,
                {
                  color: palette.tipDescription,
                  fontSize: scaleFont(13, fontScale),
                  lineHeight: scaleFont(20, fontScale),
                },
              ]}
            >
              Group tasks that require similar energy levels to finish more in less
              time.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: palette.tipCardBg,
              shadowColor: palette.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.tipIconWrapper,
              { backgroundColor: palette.tipCalmBg, shadowColor: palette.iconShadow },
            ]}
          >
            <MaterialIcons
              name="nightlight"
              size={18}
              color={palette.tipCalmIcon}
            />
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: palette.tipTitle }]}>
              Protect deep work
            </Text>
            <Text
              style={[
                styles.tipDescription,
                {
                  color: palette.tipDescription,
                  fontSize: scaleFont(13, fontScale),
                  lineHeight: scaleFont(20, fontScale),
                },
              ]}
            >
              Block a focused session and silence distractions while tackling your
              high impact tasks.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
