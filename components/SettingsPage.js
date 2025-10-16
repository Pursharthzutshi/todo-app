import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIGHT_PALETTE = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  elevated: '#F9FAFF',
  border: 'rgba(99,102,241,0.16)',
  subtleBorder: 'rgba(15,23,42,0.06)',
  textPrimary: '#0F172A',
  textSecondary: '#475467',
  accent: '#6366F1',
  accentSoft: 'rgba(99,102,241,0.12)',
  badgeSurface: '#EEF2FF',
  pillText: '#64748B',
  pillTextActive: '#312E81',
  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(148,163,184,0.32)',
  buttonBackground: '#6366F1',
  buttonText: '#F8FAFF',
  placeholder: '#94A3B8',
  secondaryButton: '#EEF2FF',
  secondaryButtonText: '#4338CA',
};

const DARK_PALETTE = {
  background: '#0B1120',
  card: '#111C2E',
  elevated: '#15213A',
  border: 'rgba(129,140,248,0.24)',
  subtleBorder: 'rgba(15,23,42,0.35)',
  textPrimary: '#F8FAFF',
  textSecondary: '#CBD5F5',
  accent: '#818CF8',
  accentSoft: 'rgba(99,102,241,0.22)',
  badgeSurface: 'rgba(129,140,248,0.16)',
  pillText: '#94A3B8',
  pillTextActive: '#E0E7FF',
  inputBackground: '#101A2B',
  inputBorder: 'rgba(129,140,248,0.35)',
  buttonBackground: '#6366F1',
  buttonText: '#F8FAFF',
  placeholder: '#7486A8',
  secondaryButton: 'rgba(129,140,248,0.16)',
  secondaryButtonText: '#E0E7FF',
};

const PASTEL_PALETTE = {
  background: '#F8F5FF',
  card: '#FFFFFF',
  elevated: '#F3EDFF',
  border: 'rgba(139,92,246,0.25)',
  subtleBorder: 'rgba(139,92,246,0.18)',
  textPrimary: '#2E1065',
  textSecondary: '#6B21A8',
  accent: '#8B5CF6',
  accentSoft: 'rgba(139,92,246,0.16)',
  badgeSurface: '#EDE9FE',
  pillText: '#6B21A8',
  pillTextActive: '#312E81',
  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(139,92,246,0.28)',
  buttonBackground: '#6D28D9',
  buttonText: '#F8FAFF',
  placeholder: '#7C3AED',
  secondaryButton: '#EDE9FE',
  secondaryButtonText: '#5B21B6',
};

const MINT_PALETTE = {
  background: '#F0FBF6',
  card: '#FFFFFF',
  elevated: '#E8FDF3',
  border: 'rgba(16,185,129,0.22)',
  subtleBorder: 'rgba(16,185,129,0.16)',
  textPrimary: '#064E3B',
  textSecondary: '#047857',
  accent: '#10B981',
  accentSoft: 'rgba(16,185,129,0.16)',
  badgeSurface: '#D1FAE5',
  pillText: '#047857',
  pillTextActive: '#115E59',
  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(16,185,129,0.26)',
  buttonBackground: '#059669',
  buttonText: '#ECFDF5',
  placeholder: '#0F766E',
  secondaryButton: '#D1FAE5',
  secondaryButtonText: '#047857',
};

const OCEAN_PALETTE = {
  background: '#0F172A',
  card: '#11243E',
  elevated: '#152C4D',
  border: 'rgba(56,189,248,0.28)',
  subtleBorder: 'rgba(30,64,175,0.4)',
  textPrimary: '#E0F2FE',
  textSecondary: '#93C5FD',
  accent: '#38BDF8',
  accentSoft: 'rgba(56,189,248,0.18)',
  badgeSurface: 'rgba(56,189,248,0.18)',
  pillText: '#BFDBFE',
  pillTextActive: '#2563EB',
  inputBackground: '#102A44',
  inputBorder: 'rgba(56,189,248,0.3)',
  buttonBackground: '#1E40AF',
  buttonText: '#E0F2FE',
  placeholder: '#60A5FA',
  secondaryButton: 'rgba(56,189,248,0.18)',
  secondaryButtonText: '#BAE6FD',
};

const SUNSET_PALETTE = {
  background: '#FFF7ED',
  card: '#FFFFFF',
  elevated: '#FFF3E0',
  border: 'rgba(249,115,22,0.24)',
  subtleBorder: 'rgba(250,204,21,0.2)',
  textPrimary: '#7C2D12',
  textSecondary: '#9A3412',
  accent: '#F97316',
  accentSoft: 'rgba(249,115,22,0.16)',
  badgeSurface: '#FFEDD5',
  pillText: '#9A3412',
  pillTextActive: '#C2410C',
  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(249,115,22,0.24)',
  buttonBackground: '#EA580C',
  buttonText: '#FFF7ED',
  placeholder: '#F97316',
  secondaryButton: '#FFEDD5',
  secondaryButtonText: '#9A3412',
};

const PINK_PALETTE = {
  background: '#FFF5F7',
  card: '#FFFFFF',
  elevated: '#FFE4EC',
  border: 'rgba(236,72,153,0.24)',
  subtleBorder: 'rgba(244,114,182,0.2)',
  textPrimary: '#831843',
  textSecondary: '#BE185D',
  accent: '#EC4899',
  accentSoft: 'rgba(236,72,153,0.16)',
  badgeSurface: '#FCE7F3',
  pillText: '#BE185D',
  pillTextActive: '#9D174D',
  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(236,72,153,0.24)',
  buttonBackground: '#DB2777',
  buttonText: '#FFF5F7',
  placeholder: '#F472B6',
  secondaryButton: '#FCE7F3',
  secondaryButtonText: '#BE185D',
};

const THEME_PALETTES = {
  Light: LIGHT_PALETTE,
  Dark: DARK_PALETTE,
  Pastel: PASTEL_PALETTE,
  Mint: MINT_PALETTE,
  Ocean: OCEAN_PALETTE,
  Sunset: SUNSET_PALETTE,
  Pink: PINK_PALETTE,
};

const BASE_THEME_CHOICES = [
  {
    value: 'Light',
    title: 'Light',
    caption: 'Bright & airy',
    icon: 'wb-sunny',
  },
  {
    value: 'Dark',
    title: 'Dark',
    caption: 'Calm & focused',
    icon: 'nightlight-round',
  },
];

const PRO_THEME_CHOICES = [
  {
    value: 'Pastel',
    title: 'Pastel',
    caption: 'Soft lavender glow',
    icon: 'palette',
  },
  {
    value: 'Mint',
    title: 'Mint',
    caption: 'Fresh & calm',
    icon: 'palette',
  },
  {
    value: 'Ocean',
    title: 'Ocean',
    caption: 'Deep focus blues',
    icon: 'waves',
  },
  {
    value: 'Sunset',
    title: 'Sunset',
    caption: 'Warm evening hues',
    icon: 'wb-sunny',
  },
  {
    value: 'Pink',
    title: 'Pink',
    caption: 'Playful energy',
    icon: 'favorite',
  },
];

const ALL_THEME_CHOICES = [...BASE_THEME_CHOICES, ...PRO_THEME_CHOICES];

const fontChoices = [
  {
    value: 'Small',
    title: 'Small',
    caption: 'Compact detail',
    icon: 'text-fields',
  },
  {
    value: 'Medium',
    title: 'Medium',
    caption: 'Balanced comfort',
    icon: 'text-format',
  },
  {
    value: 'Large',
    title: 'Large',
    caption: 'Bold & easy',
    icon: 'format-size',
  },
];

const createThemedStyles = (palette, fontScale = 1) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: palette.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 36,
      paddingTop: 26,
    },
    headerCard: {
      backgroundColor: palette.card,
      borderRadius: 28,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: palette.subtleBorder,
      shadowColor: 'rgba(15,23,42,0.25)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 22,
      elevation: 8,
    },
    headerIcon: {
      width: 50,
      height: 50,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.accentSoft,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28 * fontScale,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    headerSubtitle: {
      marginTop: 8,
      color: palette.textSecondary,
      fontSize: 14 * fontScale,
      lineHeight: 21 * fontScale,
    },
    headerBadge: {
      alignSelf: 'flex-start',
      marginTop: 18,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: palette.badgeSurface,
    },
    headerBadgeText: {
      color: palette.accent,
      fontSize: 12 * fontScale,
      fontWeight: '600',
      letterSpacing: 0.4,
    },
    upgradeCard: {
      backgroundColor: palette.card,
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: palette.subtleBorder,
      shadowColor: 'rgba(15,23,42,0.16)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 6,
    },
    upgradeTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    upgradeSubtitle: {
      marginTop: 6,
      fontSize: 13 * fontScale,
      lineHeight: 19 * fontScale,
      color: palette.textSecondary,
    },
    upgradeButton: {
      marginTop: 16,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: palette.subtleBorder,
    },
    upgradeButtonPrimary: {
      backgroundColor: palette.buttonBackground,
      borderColor: palette.buttonBackground,
    },
    upgradeButtonSecondary: {
      backgroundColor: palette.secondaryButton,
      borderColor: palette.secondaryButton,
    },
    upgradeButtonDisabled: {
      opacity: 0.7,
    },
    upgradeButtonTextGroup: {
      flex: 1,
      paddingRight: 12,
    },
    upgradeButtonLabel: {
      fontSize: 15 * fontScale,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    upgradeButtonLabelPrimary: {
      color: palette.buttonText,
    },
    upgradeButtonCaption: {
      marginTop: 4,
      fontSize: 12 * fontScale,
      color: palette.textSecondary,
    },
    upgradeButtonCaptionPrimary: {
      color: palette.buttonText,
      opacity: 0.85,
    },
    upgradeStatusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 18,
    },
    upgradeStatusChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentSoft,
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    upgradeStatusText: {
      marginLeft: 6,
      fontSize: 12 * fontScale,
      fontWeight: '600',
      color: palette.textSecondary,
    },
    devResetButton: {
      marginTop: 16,
      backgroundColor: palette.elevated,
      borderColor: palette.border,
    },
    sectionCard: {
      backgroundColor: palette.card,
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: palette.subtleBorder,
      shadowColor: 'rgba(15,23,42,0.16)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 6,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.accentSoft,
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    sectionSubtitle: {
      color: palette.textSecondary,
      fontSize: 13 * fontScale,
      marginTop: 4,
      lineHeight: 19 * fontScale,
    },
    inputLabel: {
      fontSize: 12 * fontScale,
      letterSpacing: 0.5,
      fontWeight: '600',
      color: palette.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    inputLabelSpacing: {
      marginTop: 22,
    },
    pillGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    optionPill: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      marginHorizontal: 6,
      marginBottom: 12,
      flexGrow: 1,
      minWidth: 150,
      flexBasis: '48%',
    },
    optionPillActive: {
      borderColor: palette.accent,
      backgroundColor: palette.accentSoft,
    },
    optionPillDisabled: {
      opacity: 0.55,
    },
    optionIcon: {
      width: 30,
      height: 30,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.badgeSurface,
      marginRight: 12,
      marginTop: 2,
    },
    optionIconActive: {
      backgroundColor: palette.accent,
    },
    optionPillContent: {
      flex: 1,
      paddingRight: 4,
    },
    optionPillText: {
      fontSize: 15 * fontScale,
      fontWeight: '600',
      color: palette.textPrimary,
    },
    optionPillTextActive: {
      color: palette.pillTextActive,
    },
    optionPillCaption: {
      fontSize: 12 * fontScale,
      color: palette.textSecondary,
      marginTop: 2,
      lineHeight: 18 * fontScale,
    },
    helperText: {
      color: palette.textSecondary,
      fontSize: 13 * fontScale,
      marginTop: 8,
      lineHeight: 20 * fontScale,
    },
    proHint: {
      color: palette.textSecondary,
      fontSize: 12 * fontScale,
      marginTop: 8,
      fontStyle: 'italic',
    },
    proBadge: {
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: 'flex-start',
      backgroundColor: palette.accentSoft,
      marginBottom: 6,
    },
    proBadgeText: {
      color: palette.accent,
      fontSize: 10 * fontScale,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    textArea: {
      backgroundColor: palette.inputBackground,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.inputBorder,
      padding: 16,
      minHeight: 120,
      color: palette.textPrimary,
      lineHeight: 20 * fontScale,
      fontSize: 15 * fontScale,
    },
    primaryButton: {
      marginTop: 16,
      backgroundColor: palette.buttonBackground,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonDisabled: {
      opacity: 0.5,
    },
    primaryButtonText: {
      color: palette.buttonText,
      fontSize: 15 * fontScale,
      fontWeight: '700',
    },
    secondaryButton: {
      marginTop: 18,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: palette.secondaryButton,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
    },
    secondaryButtonText: {
      color: palette.secondaryButtonText,
      fontSize: 15 * fontScale,
      fontWeight: '600',
    },
    secondaryButtonIcon: {
      marginRight: 12,
    },
    secondaryButtonLabelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      paddingRight: 12,
    },
    aboutText: {
      color: palette.textSecondary,
      fontSize: 14 * fontScale,
      lineHeight: 22 * fontScale,
    },
    versionTag: {
      marginTop: 16,
      alignSelf: 'flex-start',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: palette.accentSoft,
    },
    versionTagText: {
      color: palette.accent,
      fontSize: 12 * fontScale,
      fontWeight: '600',
      letterSpacing: 0.4,
    },
  });

export default function SettingsPage({
  styles,
  theme: activeTheme = 'Light',
  setTheme: updateTheme,
  fontSize: activeFontSize = 'Medium',
  setFontSize: updateFontSize,
  fontScale = 1,
  NAV_HEIGHT,
  safeAreaInsets,
  hasAdFree = false,
  hasPro = false,
  setHasAdFree,
  setHasPro,
  onRequestUpgrade,
}) {
  const [theme, setTheme] = useState(activeTheme);
  const [fontSize, setFontSize] = useState(activeFontSize);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    setTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    setFontSize(activeFontSize);
  }, [activeFontSize]);

  const content = {
    appearance: 'Appearance & Display',
    theme: 'Theme Selection',
    fontSize: 'Font Size',
    feedback: 'Feedback & Support',
    about: 'About Todo',
    feedbackPlaceholder: 'Tell us what is working well or what could be better...',
    submit: 'Submit feedback',
    aboutText:
      'Todo App helps you organize and complete the work that matters. We build every screen with focus and clarity in mind.',
    contactUs: 'Email support',
    version: 'Version 1.0.0',
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedFontSize = await AsyncStorage.getItem('fontSize');

        if (savedTheme) {
          setTheme(savedTheme);
        }
        if (savedFontSize) {
          setFontSize(savedFontSize);
        }

        applySettings(savedTheme || theme, savedFontSize || fontSize);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const applyTheme = (selectedTheme) => {
    if (styles?.onThemeChange) {
      styles.onThemeChange(selectedTheme);
    }
    if (typeof updateTheme === 'function') {
      updateTheme(selectedTheme);
    }
  };

  const applyFontSize = (selectedFontSize) => {
    setFontSize(selectedFontSize);
    if (styles?.onFontSizeChange) {
      styles.onFontSizeChange(selectedFontSize);
    }
    if (typeof updateFontSize === 'function') {
      updateFontSize(selectedFontSize);
    }
  };

  const applySettings = (selectedTheme, selectedFontSize) => {
    if (selectedTheme) {
      applyTheme(selectedTheme);
    }
    if (selectedFontSize) {
      applyFontSize(selectedFontSize);
    }
  };

  const saveSettings = async (setting, value) => {
    try {
      await AsyncStorage.setItem(setting, value);

      if (setting === 'theme') {
        setTheme(value);
        applyTheme(value);
      } else if (setting === 'fontSize') {
        applyFontSize(value);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSelect = (type, value) => {
    if (type === 'theme' && value !== theme) {
      saveSettings('theme', value);
    }
    if (type === 'fontSize') {
      if (!hasPro) {
        if (typeof onRequestUpgrade === 'function') {
          onRequestUpgrade('pro');
        }
        Alert.alert('Pro required', 'Upgrade to Pro to adjust font size.');
        return;
      }
      if (value !== fontSize) {
        saveSettings('fontSize', value);
      }
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setFeedbackText('');
    } else {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
    }
  };

  const handleAdFreePress = useCallback(() => {
    if (hasAdFree) {
      Alert.alert('Already unlocked', 'Lifetime ad-free access is active.');
      return;
    }
    if (typeof onRequestUpgrade === 'function') {
      onRequestUpgrade('adfree');
    }
    if (typeof setHasAdFree === 'function') {
      setHasAdFree(true);
    }
    Alert.alert(
      'Ad-free enabled',
      'Ad-free access has been granted for testing. Integrate billing to handle real purchases.',
    );
  }, [hasAdFree, onRequestUpgrade, setHasAdFree]);

  const handleProPress = useCallback(() => {
    if (hasPro) {
      if (typeof onRequestUpgrade === 'function') {
        onRequestUpgrade('manage');
      }
      Alert.alert('Subscription active', 'Manage your plan through the store settings.');
      return;
    }
    if (typeof onRequestUpgrade === 'function') {
      onRequestUpgrade('pro');
    }
    if (typeof setHasPro === 'function') {
      setHasPro(true);
    }
    Alert.alert(
      'Pro unlocked',
      'Pro access has been granted for testing. Replace this with billing integration.',
    );
  }, [hasPro, onRequestUpgrade, setHasPro]);

  const handleResetEntitlements = useCallback(() => {
    if (typeof setHasPro === 'function') {
      setHasPro(false);
    }
    if (typeof setHasAdFree === 'function') {
      setHasAdFree(false);
    }
    Alert.alert('Entitlements reset', 'Pro and ad-free flags have been cleared.');
  }, [setHasPro, setHasAdFree]);

  const bottomInset = safeAreaInsets?.bottom ?? 0;

  const palette = useMemo(
    () => THEME_PALETTES[theme] || LIGHT_PALETTE,
    [theme],
  );
  const themedStyles = useMemo(
    () => createThemedStyles(palette, fontScale || 1),
    [palette, fontScale],
  );

  const availableThemeChoices = useMemo(() => ALL_THEME_CHOICES, []);

  const adFreeCaption = hasAdFree
    ? 'Ad-free access is active on this device.'
    : 'One-time unlock. Yours forever on this account.';
  const proButtonTitle = hasPro ? 'Manage Pro subscription' : 'Go Pro (monthly)';
  const proButtonCaption = hasPro
    ? 'All premium features are unlocked while your plan stays active.'
    : 'Unlock premium features and stay ad-free while subscribed.';

  return (
    <ScrollView
      style={themedStyles.screen}
      contentContainerStyle={[
        themedStyles.content,
        { paddingBottom: 36 + (NAV_HEIGHT || 0) + bottomInset },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={themedStyles.headerCard}>
        <View style={themedStyles.headerIcon}>
          <MaterialIcons name="tune" size={22} color={palette.accent} />
        </View>
        <Text style={themedStyles.headerTitle}>Settings</Text>
        <Text style={themedStyles.headerSubtitle}>
          Tailor Todo to match the way you plan, focus, and ship your day.
        </Text>
      <View style={themedStyles.headerBadge}>
        <Text style={themedStyles.headerBadgeText}>Personalize your experience</Text>
      </View>
    </View>

      <View style={themedStyles.upgradeCard}>
        <Text style={themedStyles.upgradeTitle}>Upgrade your workspace</Text>
        <Text style={themedStyles.upgradeSubtitle}>
          Remove ads forever or unlock every Pro tool with a monthly plan.
        </Text>

        <TouchableOpacity
          style={[
            themedStyles.upgradeButton,
            themedStyles.upgradeButtonSecondary,
            hasAdFree && themedStyles.upgradeButtonDisabled,
          ]}
          onPress={handleAdFreePress}
          activeOpacity={0.85}
          disabled={hasAdFree}
        >
          <View style={themedStyles.upgradeButtonTextGroup}>
            <Text style={themedStyles.upgradeButtonLabel}>Remove ads (lifetime)</Text>
            <Text style={themedStyles.upgradeButtonCaption}>{adFreeCaption}</Text>
          </View>
          <MaterialIcons
            name={hasAdFree ? 'check-circle' : 'block'}
            size={20}
            color={hasAdFree ? palette.accent : palette.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            themedStyles.upgradeButton,
            themedStyles.upgradeButtonPrimary,
          ]}
          onPress={handleProPress}
          activeOpacity={0.9}
        >
          <View style={themedStyles.upgradeButtonTextGroup}>
            <Text style={[themedStyles.upgradeButtonLabel, themedStyles.upgradeButtonLabelPrimary]}>
              {proButtonTitle}
            </Text>
            <Text
              style={[themedStyles.upgradeButtonCaption, themedStyles.upgradeButtonCaptionPrimary]}
            >
              {proButtonCaption}
            </Text>
          </View>
          <MaterialIcons
            name={hasPro ? 'workspace-premium' : 'arrow-forward'}
            size={20}
            color={palette.buttonText}
          />
        </TouchableOpacity>

        <View style={themedStyles.upgradeStatusRow}>
          <View style={themedStyles.upgradeStatusChip}>
            <MaterialIcons
              name={hasAdFree ? 'done' : 'lock-open'}
              size={16}
              color={hasAdFree ? palette.accent : palette.textSecondary}
            />
            <Text style={themedStyles.upgradeStatusText}>
              {hasAdFree ? 'Ad-free active' : 'Ads currently enabled'}
            </Text>
          </View>
          <View style={themedStyles.upgradeStatusChip}>
            <MaterialIcons
              name={hasPro ? 'workspace-premium' : 'star-outline'}
              size={16}
              color={hasPro ? palette.accent : palette.textSecondary}
            />
            <Text style={themedStyles.upgradeStatusText}>
              {hasPro ? 'Pro subscription active' : 'Pro features locked'}
            </Text>
          </View>
        </View>
        {__DEV__ && (
          <TouchableOpacity
            style={[themedStyles.upgradeButton, themedStyles.devResetButton]}
            onPress={handleResetEntitlements}
            activeOpacity={0.85}
          >
            <View style={themedStyles.upgradeButtonTextGroup}>
              <Text style={themedStyles.upgradeButtonLabel}>Reset entitlements (dev)</Text>
              <Text style={themedStyles.upgradeButtonCaption}>
                Clears local Pro and ad-free flags for testing.
              </Text>
            </View>
            <MaterialIcons name="restart-alt" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={themedStyles.sectionCard}>
        <View style={themedStyles.sectionHeader}>
          <View style={themedStyles.sectionIcon}>
            <MaterialIcons name="palette" size={20} color={palette.accent} />
          </View>
          <View>
            <Text style={themedStyles.sectionTitle}>{content.appearance}</Text>
            <Text style={themedStyles.sectionSubtitle}>
              Switch themes and adjust text comfort for easier reading.
            </Text>
          </View>
        </View>

        <Text style={themedStyles.inputLabel}>{content.theme}</Text>
        <View style={themedStyles.pillGroup}>
          {availableThemeChoices.map((option) => {
            const isProTheme = !BASE_THEME_CHOICES.some((base) => base.value === option.value);
            const locked = isProTheme && !hasPro;
            const selected = theme === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  themedStyles.optionPill,
                  selected && themedStyles.optionPillActive,
                  locked && themedStyles.optionPillDisabled,
                ]}
                onPress={() => handleSelect('theme', option.value)}
                activeOpacity={locked ? 1 : 0.9}
                disabled={locked}
              >
                <View
                  style={[
                    themedStyles.optionIcon,
                    selected && themedStyles.optionIconActive,
                  ]}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={18}
                    color={selected ? palette.buttonText : palette.accent}
                  />
                </View>
                <View style={themedStyles.optionPillContent}>
                  {locked && (
                    <View style={themedStyles.proBadge}>
                      <Text style={themedStyles.proBadgeText}>PRO</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      themedStyles.optionPillText,
                      selected && themedStyles.optionPillTextActive,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={themedStyles.optionPillCaption}>{option.caption}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={themedStyles.helperText}>
          Choose the mood that keeps you feeling clear and focused.
        </Text>
        {!hasPro && (
          <Text style={themedStyles.proHint}>
            Unlock additional color themes with Todo Pro.
          </Text>
        )}

        <Text
          style={[themedStyles.inputLabel, themedStyles.inputLabelSpacing]}
        >
          {content.fontSize}
        </Text>
        <View style={themedStyles.pillGroup}>
          {fontChoices.map((option) => {
            const selected = fontSize === option.value;
            const locked = !hasPro;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  themedStyles.optionPill,
                  selected && themedStyles.optionPillActive,
                  locked && themedStyles.optionPillDisabled,
                ]}
                onPress={() => handleSelect('fontSize', option.value)}
                activeOpacity={locked ? 1 : 0.9}
                disabled={locked}
              >
                <View
                  style={[
                    themedStyles.optionIcon,
                    selected && themedStyles.optionIconActive,
                  ]}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={18}
                    color={selected ? palette.buttonText : palette.accent}
                  />
                </View>
                <View style={themedStyles.optionPillContent}>
                  {locked && (
                    <View style={themedStyles.proBadge}>
                      <Text style={themedStyles.proBadgeText}>PRO</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      themedStyles.optionPillText,
                      selected && themedStyles.optionPillTextActive,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={themedStyles.optionPillCaption}>{option.caption}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={themedStyles.helperText}>
          Adjust text sizes to match your reading comfort across the app.
        </Text>
      </View>

      <View style={themedStyles.sectionCard}>
        <View style={themedStyles.sectionHeader}>
          <View style={themedStyles.sectionIcon}>
            <MaterialIcons name="support-agent" size={20} color={palette.accent} />
          </View>
          <View>
            <Text style={themedStyles.sectionTitle}>{content.feedback}</Text>
            <Text style={themedStyles.sectionSubtitle}>
              Share what you love or what we should tune next—we respond quickly.
            </Text>
          </View>
        </View>

        <TextInput
          style={themedStyles.textArea}
          placeholder={content.feedbackPlaceholder}
          placeholderTextColor={palette.placeholder}
          value={feedbackText}
          multiline
          onChangeText={setFeedbackText}
        />
        <TouchableOpacity
          style={[
            themedStyles.primaryButton,
            !feedbackText.trim() && themedStyles.primaryButtonDisabled,
          ]}
          onPress={handleFeedbackSubmit}
          activeOpacity={0.9}
          disabled={!feedbackText.trim()}
        >
          <Text style={themedStyles.primaryButtonText}>{content.submit}</Text>
        </TouchableOpacity>
      </View>

      <View style={themedStyles.sectionCard}>
        <View style={themedStyles.sectionHeader}>
          <View style={themedStyles.sectionIcon}>
            <MaterialIcons name="info" size={20} color={palette.accent} />
          </View>
          <View>
            <Text style={themedStyles.sectionTitle}>{content.about}</Text>
            <Text style={themedStyles.sectionSubtitle}>
              Learn more about how Todo keeps you organized every day.
            </Text>
          </View>
        </View>

        <Text style={themedStyles.aboutText}>{content.aboutText}</Text>

        <TouchableOpacity
          style={themedStyles.secondaryButton}
          onPress={() => Linking.openURL('mailto:support@todoapp.com')}
          activeOpacity={0.85}
        >
          <View style={themedStyles.secondaryButtonLabelGroup}>
            <MaterialIcons
              name="mail-outline"
              size={18}
              color={palette.secondaryButtonText}
              style={themedStyles.secondaryButtonIcon}
            />
            <Text style={themedStyles.secondaryButtonText}>{content.contactUs}</Text>
          </View>
          <MaterialIcons
            name="open-in-new"
            size={18}
            color={palette.secondaryButtonText}
          />
        </TouchableOpacity>

        <View style={themedStyles.versionTag}>
          <Text style={themedStyles.versionTagText}>{content.version}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
