import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import getVisibleTasks from './VisibleTasks';
import TaskCard from './TaskCard';

const WISHLIST_THEMES = {
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
    inputBackground: '#FFFFFF',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94A3B8',
    badgeBackground: '#F8FAFF',
    badgeText: '#4338CA',
    emptyState: '#94A3B8',
  },
  Dark: {
    screen: '#0B1120',
    card: '#111C2E',
    accent: '#818CF8',
    accentSoft: 'rgba(129,140,248,0.24)',
    cardBorder: 'rgba(148,163,184,0.18)',
    cardShadow: 'rgba(2,6,23,0.5)',
    textPrimary: '#E2E8F0',
    textSecondary: '#A5B4FC',
    textMuted: '#64748B',
    inputBackground: '#1E293B',
    inputBorder: 'rgba(129,140,248,0.32)',
    inputPlaceholder: '#94A3B8',
    badgeBackground: 'rgba(148,163,184,0.16)',
    badgeText: '#E0E7FF',
    emptyState: '#94A3B8',
  },
};

const scaleFont = (value, multiplier) =>
  Math.round(value * multiplier * 100) / 100;

export default function WishlistPage({
  searchAllTodoListItem,
  filteredTasks = [],
  setTasks,
  setSearchAllTodoListItem,
  toggleWishlist,
  theme = 'Light',
  fontScale = 1,
}) {
  const palette = WISHLIST_THEMES[theme] || WISHLIST_THEMES.Light;
  const tasksToShow = useMemo(
    () => getVisibleTasks(filteredTasks, searchAllTodoListItem).filter(
      (task) => task.wishlist,
    ),
    [filteredTasks, searchAllTodoListItem],
  );

  const wishlistStyles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: palette.screen,
        },
        content: {
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 26,
          gap: 22,
        },
        headerCard: {
          padding: 24,
          borderRadius: 28,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: theme === 'Dark' ? 0.25 : 0.12,
          shadowRadius: 22,
          elevation: 8,
        },
        headerTitle: {
          fontSize: scaleFont(28, fontScale),
          fontWeight: '700',
          color: palette.textPrimary,
        },
        headerSubtitle: {
          marginTop: 8,
          fontSize: scaleFont(14, fontScale),
          color: palette.textSecondary,
          lineHeight: scaleFont(20, fontScale),
        },
        headerBadgeRow: {
          marginTop: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        },
        headerBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.badgeBackground,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 999,
        },
        headerBadgeText: {
          marginLeft: 6,
          fontSize: scaleFont(12, fontScale),
          fontWeight: '600',
          color: palette.badgeText,
        },
        sectionCard: {
          padding: 20,
          borderRadius: 24,
          backgroundColor: palette.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.cardBorder,
          shadowColor: palette.cardShadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme === 'Dark' ? 0.2 : 0.1,
          shadowRadius: 18,
          elevation: 6,
        },
        sectionTitle: {
          fontSize: scaleFont(18, fontScale),
          fontWeight: '700',
          color: palette.textPrimary,
        },
        sectionSubtitle: {
          marginTop: 4,
          fontSize: scaleFont(13, fontScale),
          color: palette.textSecondary,
        },
        searchInput: {
          marginTop: 16,
          backgroundColor: palette.inputBackground,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: palette.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: palette.textPrimary,
          fontSize: scaleFont(14, fontScale),
        },
        listWrapper: {
          marginTop: 16,
        },
        emptyState: {
          marginTop: 20,
          fontSize: scaleFont(14, fontScale),
          color: palette.emptyState,
        },
      }),
    [palette, theme, fontScale],
  );

  return (
    <ScrollView
      style={wishlistStyles.screen}
      contentContainerStyle={wishlistStyles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={wishlistStyles.headerCard}>
        <Text style={wishlistStyles.headerTitle}>Wishlist</Text>
        <Text style={wishlistStyles.headerSubtitle}>
          Tasks you&apos;re keeping an eye on—promote one when you&apos;re ready to
          focus.
        </Text>
        <View style={wishlistStyles.headerBadgeRow}>
          <View style={wishlistStyles.headerBadge}>
            <MaterialIcons name="favorite" size={16} color={palette.accent} />
            <Text style={wishlistStyles.headerBadgeText}>
              {tasksToShow.length} saved
            </Text>
          </View>
          <View style={wishlistStyles.headerBadge}>
            <MaterialIcons name="star-outline" size={16} color={palette.accent} />
            <Text style={wishlistStyles.headerBadgeText}>Swipe to star</Text>
          </View>
        </View>
      </View>

      <View style={wishlistStyles.sectionCard}>
        <Text style={wishlistStyles.sectionTitle}>Search & curate</Text>
        <Text style={wishlistStyles.sectionSubtitle}>
          Find the tasks you stashed for later inspiration.
        </Text>

        <TextInput
          style={wishlistStyles.searchInput}
          placeholder="Search wishlist"
          placeholderTextColor={palette.inputPlaceholder}
          value={searchAllTodoListItem}
          onChangeText={setSearchAllTodoListItem}
          returnKeyType="search"
        />

        <View style={wishlistStyles.listWrapper}>
          {tasksToShow.length ? (
            tasksToShow.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                setTasks={setTasks}
                onToggleWishlist={() => toggleWishlist(task.id)}
                theme={theme}
                fontScale={fontScale}
              />
            ))
          ) : (
            <Text style={wishlistStyles.emptyState}>
              Nothing saved yet. Add tasks to your wishlist to hold them for
              later.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
