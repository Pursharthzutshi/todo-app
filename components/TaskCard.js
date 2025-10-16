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

const CARD_THEME_VARIANTS = {
  Pastel: {
    ...CARD_THEMES.Light,
    background: '#FFFFFF',
    border: 'rgba(139,92,246,0.18)',
    shadow: 'rgba(139,92,246,0.2)',
    textPrimary: '#2E1065',
    textSecondary: '#6B21A8',
    textMuted: '#9F67F8',
    accent: '#8B5CF6',
    checkboxBorder: '#C4B5FD',
    badgeBackground: '#EDE9FE',
    badgeText: '#5B21B6',
    subtleChip: '#F5F3FF',
    iconColor: '#7C3AED',
    iconActive: '#8B5CF6',
    delete: '#DB2777',
  },
  Mint: {
    ...CARD_THEMES.Light,
    background: '#FFFFFF',
    border: 'rgba(16,185,129,0.18)',
    shadow: 'rgba(16,185,129,0.2)',
    textPrimary: '#064E3B',
    textSecondary: '#047857',
    textMuted: '#0D9488',
    accent: '#10B981',
    checkboxBorder: '#A7F3D0',
    badgeBackground: '#D1FAE5',
    badgeText: '#047857',
    subtleChip: '#ECFDF5',
    iconColor: '#0F766E',
    iconActive: '#10B981',
    delete: '#DC2626',
  },
  Sunset: {
    ...CARD_THEMES.Light,
    background: '#FFFFFF',
    border: 'rgba(249,115,22,0.18)',
    shadow: 'rgba(249,115,22,0.2)',
    textPrimary: '#7C2D12',
    textSecondary: '#9A3412',
    textMuted: '#FB923C',
    accent: '#F97316',
    checkboxBorder: '#FDBA74',
    badgeBackground: '#FFEDD5',
    badgeText: '#9A3412',
    subtleChip: '#FFF7ED',
    iconColor: '#EA580C',
    iconActive: '#F97316',
    delete: '#B91C1C',
  },
  Pink: {
    ...CARD_THEMES.Light,
    background: '#FFFFFF',
    border: 'rgba(236,72,153,0.18)',
    shadow: 'rgba(236,72,153,0.2)',
    textPrimary: '#831843',
    textSecondary: '#BE185D',
    textMuted: '#F472B6',
    accent: '#EC4899',
    checkboxBorder: '#FBCFE8',
    badgeBackground: '#FCE7F3',
    badgeText: '#BE185D',
    subtleChip: '#FFF5F7',
    iconColor: '#EC4899',
    iconActive: '#DB2777',
    delete: '#DB2777',
  },
  Ocean: {
    ...CARD_THEMES.Dark,
    background: '#11243E',
    border: 'rgba(56,189,248,0.26)',
    shadow: 'rgba(15,118,215,0.35)',
    textPrimary: '#E0F2FE',
    textSecondary: '#93C5FD',
    textMuted: '#60A5FA',
    accent: '#38BDF8',
    checkboxBorder: '#38BDF8',
    checkboxBackground: '#0F172A',
    checkboxChecked: '#38BDF8',
    checkboxCheckmark: '#0B1120',
    badgeBackground: 'rgba(56,189,248,0.18)',
    badgeText: '#BAE6FD',
    subtleChip: 'rgba(30,58,138,0.45)',
    iconColor: '#60A5FA',
    iconActive: '#38BDF8',
    delete: '#FCA5A5',
  },
};

Object.assign(CARD_THEMES, CARD_THEME_VARIANTS);

const PRIORITY_COLORS = {
  Normal: { bg: 'rgba(148,163,184,0.18)', text: '#475467' },
  Low: { bg: 'rgba(59,130,246,0.18)', text: '#1D4ED8' },
  Medium: { bg: 'rgba(234,179,8,0.18)', text: '#854D0E' },
  High: { bg: 'rgba(249,115,22,0.2)', text: '#B45309' },
  Critical: { bg: 'rgba(248,113,113,0.22)', text: '#B91C1C' },
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
  selectionMode = false,
  selected = false,
  onSelectToggle = () => {},
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

  const priorityValue = task.priority || 'Normal';
  const cardStyles = useMemo(() => {
    const priorityColors = PRIORITY_COLORS[priorityValue] || PRIORITY_COLORS.Normal;

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
          shadowOpacity: (theme === 'Dark' || theme === 'Ocean') ? 0.35 : 0.12,
          shadowRadius: 18,
          elevation: 5,
        },
        containerSelected: {
          borderColor: palette.accent,
          backgroundColor: palette.subtleChip || palette.accentSoft,
        },
        selectionToggle: {
          width: 30,
          height: 30,
          marginRight: 16,
          justifyContent: 'center',
          alignItems: 'center',
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
        actionsDisabled: {
          opacity: 0.35,
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

  const containerStyles = [
    cardStyles.container,
    selectionMode && selected && cardStyles.containerSelected,
  ];

  return (
    <TouchableOpacity
      activeOpacity={selectionMode ? 0.85 : 1}
      onPress={selectionMode ? onSelectToggle : undefined}
      style={containerStyles}
    >
      {selectionMode ? (
        <View style={cardStyles.selectionToggle}>
          <MaterialIcons
            name={selected ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={selected ? palette.accent : palette.iconColor}
          />
        </View>
      ) : (
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
      )}

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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={cardStyles.priorityPill}>
              <Text style={cardStyles.priorityText}>{priorityValue}</Text>
            </View>
            {task.completed ? (
              <View style={cardStyles.statusChip}>
                <MaterialIcons name="check" size={14} color={palette.textSecondary} />
                <Text style={cardStyles.statusText}>Done</Text>
              </View>
            ) : null}
          </View>

          <View
            style={[cardStyles.actions, selectionMode && cardStyles.actionsDisabled]}
            pointerEvents={selectionMode ? 'none' : 'auto'}
          >
            <TouchableOpacity
              style={cardStyles.actionButton}
              onPress={onToggleImportant}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              disabled={selectionMode}
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
              disabled={selectionMode}
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
              disabled={selectionMode}
            >
              <MaterialIcons
                name="delete-outline"
                size={22}
                color={palette.delete}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
