import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CARD_THEMES = {
  Light: {
    background: '#FFFFFF',
    border: 'rgba(15,23,42,0.08)',
    shadow: 'rgba(15,23,42,0.1)',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    accent: '#6366F1',
    checkboxBorder: '#CBD5F5',
    checkboxBackground: '#FFFFFF',
    checkboxChecked: '#22C55E',
    checkboxCheckmark: '#FFFFFF',
    badgeBackground: '#EEF2FF',
    badgeText: '#4338CA',
    subtleChip: '#F8FAFF',
    iconColor: '#475467',
    iconActive: '#4338CA',
    delete: '#DC2626',
  },
  Dark: {
    background: '#111C2E',
    border: 'rgba(148,163,184,0.18)',
    shadow: 'rgba(2,6,23,0.55)',
    textPrimary: '#E2E8F0',
    textSecondary: '#94A3B8',
    textMuted: '#94A3B8',
    accent: '#A5B4FC',
    checkboxBorder: '#4C1D95',
    checkboxBackground: '#1E293B',
    checkboxChecked: '#4ADE80',
    checkboxCheckmark: '#0B1120',
    badgeBackground: 'rgba(99,102,241,0.22)',
    badgeText: '#E0E7FF',
    subtleChip: 'rgba(148,163,184,0.12)',
    iconColor: '#CBD5F5',
    iconActive: '#C7D2FE',
    delete: '#FCA5A5',
  },
};

const PRIORITY_COLORS = {
  Urgent: { bg: 'rgba(248,113,113,0.16)', text: '#B91C1C' },
  High: { bg: 'rgba(249,115,22,0.16)', text: '#B45309' },
  Medium: { bg: 'rgba(234,179,8,0.16)', text: '#854D0E' },
  Low: { bg: 'rgba(59,130,246,0.16)', text: '#1D4ED8' },
  None: { bg: 'rgba(148,163,184,0.18)', text: '#475467' },
};

const scaleFont = (value, multiplier) =>
  Math.round(value * multiplier * 100) / 100;

export default function TaskCard({
  task,
  setTasks,
  onToggle = () => {},
  onToggleImportant = () => {},
  onToggleWishlist = () => {},
  theme = 'Light',
  fontScale = 1,
}) {
  const palette = CARD_THEMES[theme] || CARD_THEMES.Light;

  const detailText = useMemo(() => {
    if (task.completed) return 'Completed';

    const parts = [];
    if (task.dueDateLabel) {
      parts.push(task.dueDateLabel);
    } else {
      parts.push('No due date');
    }
    if (task.time) {
      parts.push(task.time);
    }
    return parts.filter(Boolean).join(' · ');
  }, [task.completed, task.dueDateLabel, task.time]);

  const priorityValue = task.priority || 'None';
  const cardStyles = useMemo(() => {
    const priorityColors = PRIORITY_COLORS[priorityValue] || PRIORITY_COLORS.None;

    return StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 18,
          marginBottom: 18,
          borderRadius: 24,
          backgroundColor: palette.background,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.border,
          shadowColor: palette.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme === 'Dark' ? 0.35 : 0.12,
          shadowRadius: 18,
          elevation: 5,
        },
        checkbox: {
          width: 30,
          height: 30,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: palette.checkboxBorder,
          backgroundColor: palette.checkboxBackground,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 16,
        },
        checkboxChecked: {
          backgroundColor: palette.checkboxChecked,
          borderColor: palette.checkboxChecked,
        },
        checkmark: {
          color: palette.checkboxCheckmark,
          fontWeight: '700',
          fontSize: scaleFont(16, fontScale),
        },
        content: {
          flex: 1,
        },
        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        title: {
          fontSize: scaleFont(17, fontScale),
          fontWeight: '700',
          color: palette.textPrimary,
          flexShrink: 1,
        },
        titleCompleted: {
          color: palette.textMuted,
          textDecorationLine: 'line-through',
        },
        meta: {
          marginTop: 6,
          fontSize: scaleFont(13, fontScale),
          color: palette.textSecondary,
        },
        footerRow: {
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        priorityPill: {
          backgroundColor: priorityColors.bg,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
        },
        priorityText: {
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
          color: priorityColors.text,
          textTransform: 'uppercase',
        },
        statusChip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.subtleChip,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 999,
          marginLeft: 8,
        },
        statusText: {
          marginLeft: 6,
          fontSize: scaleFont(12, fontScale),
          color: palette.textSecondary,
          fontWeight: '600',
        },
        actions: {
          justifyContent: 'space-between',
          marginLeft: 18,
          alignItems: 'flex-end',
        },
        actionButton: {
          padding: 6,
          borderRadius: 12,
        },
      });
  }, [palette, priorityValue, theme, fontScale]);

  const deleteTodoTask = (id) => {
    if (typeof setTasks !== 'function') return;
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  return (
    <View style={cardStyles.container}>
      <TouchableOpacity
        style={[
          cardStyles.checkbox,
          task.completed && cardStyles.checkboxChecked,
        ]}
        onPress={onToggle}
        hitSlop={{ top: 20, bottom: 10, left: 10, right: 10 }}
      >
        {task.completed && <Text style={cardStyles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={cardStyles.content}>
        <View style={cardStyles.titleRow}>
          <Text
            style={[
              cardStyles.title,
              task.completed && cardStyles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {task.important && (
            <MaterialIcons
              name="flag"
              size={20}
              color={palette.accent}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        <Text style={cardStyles.meta}>{detailText}</Text>

        <View style={cardStyles.footerRow}>
          <View style={cardStyles.priorityPill}>
            <Text style={cardStyles.priorityText}>{priorityValue}</Text>
          </View>
          {task.wishlist && (
            <View style={cardStyles.statusChip}>
              <MaterialIcons name="favorite" size={16} color={palette.accent} />
              <Text style={cardStyles.statusText}>Wishlist</Text>
            </View>
          )}
        </View>
      </View>

      <View style={cardStyles.actions}>
        <TouchableOpacity
          style={cardStyles.actionButton}
          onPress={onToggleImportant}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={task.important ? 'star' : 'star-border'}
            size={22}
            color={task.important ? palette.iconActive : palette.iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={cardStyles.actionButton}
          onPress={onToggleWishlist}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={task.wishlist ? 'favorite' : 'favorite-border'}
            size={22}
            color={task.wishlist ? palette.iconActive : palette.iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={cardStyles.actionButton}
          onPress={() => deleteTodoTask(task.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name="delete-outline"
            size={22}
            color={palette.delete}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
