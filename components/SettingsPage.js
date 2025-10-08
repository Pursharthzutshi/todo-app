import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, TextInput, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsPage({ styles }) {
  const [theme, setTheme] = useState('Light');
  const [fontSize, setFontSize] = useState('Medium');
  
  // Dropdown states
  const [themeDropdownVisible, setThemeDropdownVisible] = useState(false);
  const [fontSizeDropdownVisible, setFontSizeDropdownVisible] = useState(false);
  
  // Feedback form state
  const [feedbackText, setFeedbackText] = useState('');
  
  // Options for dropdowns
  const themeOptions = ['Light', 'Dark'];
  const fontSizeOptions = ['Small', 'Medium', 'Large'];
  
  // Text content
  const content = {
    appearance: 'Appearance & Display',
    theme: 'Theme Selection',
    fontSize: 'Font Size',
    feedback: 'Feedback/Support',
    about: 'About Us',
    feedbackPlaceholder: 'Enter your feedback here...',
    submit: 'Submit',
    aboutText: 'Todo App is a simple task management application designed to help you organize your daily tasks efficiently.',
    contactUs: 'Contact Us',
    version: 'Version 1.0.0'
  };
  
  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        
        if (savedTheme) setTheme(savedTheme);
        if (savedFontSize) setFontSize(savedFontSize);
        
        // Apply settings to the app
        applySettings(savedTheme || theme, savedFontSize || fontSize);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings to AsyncStorage and apply them
  const saveSettings = async (setting, value) => {
    try {
      await AsyncStorage.setItem(setting, value);
      
      // Apply settings immediately
      if (setting === 'theme') {
        setTheme(value);
        applyTheme(value);
      } else if (setting === 'fontSize') {
        setFontSize(value);
        applyFontSize(value);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  // Apply theme to the app
  const applyTheme = (selectedTheme) => {
    console.log('Theme set to:', selectedTheme);
    
    // For React Native, we need to make sure the theme change is propagated to App.js
    // This is done by updating the AsyncStorage and the state in App.js
    // We'll also need to force a re-render of the app to apply the theme changes
    
    // Notify App.js that theme has changed
    if (styles && styles.onThemeChange) {
      styles.onThemeChange(selectedTheme);
    }
  };
  
  // Apply font size to the app
  const applyFontSize = (selectedFontSize) => {
    console.log('Font size set to:', selectedFontSize);
    
    // Save to AsyncStorage directly to ensure persistence
    AsyncStorage.setItem('fontSize', selectedFontSize).then(() => {
      console.log('Font size saved to AsyncStorage:', selectedFontSize);
    }).catch(error => {
      console.error('Error saving font size to AsyncStorage:', error);
    });
    
    // Notify App.js that font size has changed
    if (styles && styles.onFontSizeChange) {
      // Call the callback directly and force immediate update
      styles.onFontSizeChange(selectedFontSize);
      
      // Force a re-render of the component
      setFontSize(selectedFontSize);
    } else {
      // Fallback if callback is not available
      console.warn('onFontSizeChange callback not available, font size may not be applied correctly');
    }
  };
  
  // Apply all settings
  const applySettings = (selectedTheme, selectedFontSize) => {
    applyTheme(selectedTheme);
    applyFontSize(selectedFontSize);
  };
  
  // Handle dropdown selection
  const handleSelect = (type, value) => {
    if (type === 'theme') {
      setTheme(value);
      setThemeDropdownVisible(false);
      // Apply theme immediately
      applyTheme(value);
    } else if (type === 'fontSize') {
      setFontSize(value);
      setFontSizeDropdownVisible(false);
      
      // Apply font size immediately with direct style changes
      applyFontSize(value);
      
      // Force immediate update in parent component
      if (styles && styles.onFontSizeChange) {
        // Call multiple times to ensure the change is applied
        styles.onFontSizeChange(value);
        
        // Force a re-render after a short delay
        setTimeout(() => {
          styles.onFontSizeChange(value);
        }, 100);
      }
    }
  };
  
  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      // In a real app, this would send the feedback to a server
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setFeedbackText('');
    } else {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
    }
  };
  
  // Render dropdown
  const renderDropdown = (visible, options, onSelect, type) => {
    if (!visible) return null;
    
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
          if (type === 'theme') setThemeDropdownVisible(false);
          else if (type === 'fontSize') setFontSizeDropdownVisible(false);
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
          activeOpacity={1}
          onPress={() => {
            if (type === 'theme') setThemeDropdownVisible(false);
            else if (type === 'fontSize') setFontSizeDropdownVisible(false);
          }}
        >
          <View style={[localStyles.dropdownContainer, { backgroundColor: styles?.appContainer?.backgroundColor || '#fff' }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    localStyles.dropdownItem,
                    type === 'theme' && item === theme && { backgroundColor: '#444' },
                    type === 'fontSize' && item === fontSize && { backgroundColor: '#444' }
                  ]}
                  onPress={() => onSelect(type, item)}
                >
                  <Text 
                    style={[
                      localStyles.dropdownItemText,
                      { color: styles?.taskTitle?.color || '#000' },
                      // Apply the actual font size to the font size options
                      type === 'fontSize' && {
                        fontSize: item === 'Small' ? 14 : item === 'Large' ? 18 : 16
                      }
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  return (
    <ScrollView style={[styles.innerContainer, localStyles.container]}>
      <Text style={localStyles.sectionTitle}>{content.appearance}</Text>
      
      {/* Theme Selection */}
      <View style={localStyles.settingItem}>
        <Text style={localStyles.settingLabel}>{content.theme}</Text>
        <TouchableOpacity
          style={localStyles.dropdown}
          onPress={() => {
            setThemeDropdownVisible(!themeDropdownVisible);
            setFontSizeDropdownVisible(false);
          }}
        >
          <Text style={localStyles.dropdownText}>{theme}</Text>
        </TouchableOpacity>
        {renderDropdown(themeDropdownVisible, themeOptions, handleSelect, 'theme')}
      </View>
      
      {/* Font Size */}
      <View style={localStyles.settingItem}>
        <Text style={localStyles.settingLabel}>{content.fontSize}</Text>
        <TouchableOpacity
          style={localStyles.dropdown}
          onPress={() => {
            setFontSizeDropdownVisible(!fontSizeDropdownVisible);
            setThemeDropdownVisible(false);
          }}
        >
          <Text style={localStyles.dropdownText}>{fontSize}</Text>
        </TouchableOpacity>
        {renderDropdown(fontSizeDropdownVisible, fontSizeOptions, handleSelect, 'fontSize')}
      </View>
      
      {/* Feedback/Support */}
      <Text style={[localStyles.sectionTitle, { marginTop: 20 }]}>{content.feedback}</Text>
      <View style={localStyles.feedbackContainer}>
        <TextInput
          style={localStyles.feedbackInput}
          placeholder={content.feedbackPlaceholder}
          value={feedbackText}
          onChangeText={setFeedbackText}
          multiline
        />
        <TouchableOpacity
          style={localStyles.submitButton}
          onPress={handleFeedbackSubmit}
        >
          <Text style={localStyles.submitButtonText}>{content.submit}</Text>
        </TouchableOpacity>
      </View>
      
      {/* About Us */}
      <Text style={[localStyles.sectionTitle, { marginTop: 20 }]}>{content.about}</Text>
      <View style={localStyles.aboutContainer}>
        <Text style={localStyles.aboutText}>{content.aboutText}</Text>
        <TouchableOpacity
          style={localStyles.contactButton}
          onPress={() => Linking.openURL('mailto:support@todoapp.com')}
        >
          <Text style={localStyles.contactButtonText}>{content.contactUs}</Text>
        </TouchableOpacity>
        <Text style={localStyles.versionText}>{content.version}</Text>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    marginBottom: 16,
    position: 'relative',
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  feedbackContainer: {
    marginBottom: 16,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutContainer: {
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
