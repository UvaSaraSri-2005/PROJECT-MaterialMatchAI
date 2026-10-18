
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { createIndustry, getIndustries, type Industry } from '@/lib/api';

export default function IndustriesScreen() {
  const [items, setItems] = useState<Industry[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] =
    useState<Industry | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getIndustries();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load industries:', error);
      Alert.alert(
        'Unable to load industries',
        'Please check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert('Required field', 'Please enter your industry/company name.');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Required field', 'Please enter your industry location.');
      return;
    }

    try {
      setSaving(true);

      await createIndustry({
        industryName: name.trim(),
        industryType: type.trim(),
        location: location.trim(),
      });

      setName('');
      setType('');
      setLocation('');

      Alert.alert('Success', 'Industry saved successfully.');
      await load();
    } catch (error) {
      console.error('Failed to save industry:', error);
      Alert.alert(
        'Save failed',
        'Could not save the industry. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      (item.industryName ?? '').toLowerCase().includes(query) ||
      (item.industryType ?? '').toLowerCase().includes(query) ||
      (item.location ?? '').toLowerCase().includes(query)
    );
  });

  const renderIndustry = ({ item }: { item: Industry }) => {
    const isSelected = selectedIndustry?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.industryCard,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => setSelectedIndustry(item)}
        activeOpacity={0.8}
      >
        <View style={styles.industryInfo}>
          <Text style={styles.industryName}>
            {item.industryName}
          </Text>

          <Text style={styles.industryDetails}>
            {item.industryType || 'Industry type not specified'}
          </Text>

          <Text style={styles.industryLocation}>
            📍 {item.location || 'Location not specified'}
          </Text>
        </View>

        <Text style={styles.selectText}>
          {isSelected ? '✓ Selected' : 'Select'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Industries</Text>

          <Text style={styles.subtitle}>
            Register an industry and find potential waste-material suppliers.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Add an Industry
            </Text>

            <Text style={styles.sectionDescription}>
              Enter your company's details below. Fields marked with *
              are required.
            </Text>

            <Text style={styles.label}>
              Industry / Company Name *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., ABC Textile Industries"
              placeholderTextColor="#718075"
              value={name}
              onChangeText={setName}
              editable={!saving}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Text style={styles.fieldHint}>
              Enter the official name of your company.
            </Text>

            <Text style={styles.label}>
              Industry Type
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Textile, Plastic, Metal, Food"
              placeholderTextColor="#718075"
              value={type}
              onChangeText={setType}
              editable={!saving}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Text style={styles.fieldHint}>
              Mention the type of industry you operate.
            </Text>

            <Text style={styles.label}>
              Location *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Madurai, Tamil Nadu"
              placeholderTextColor="#718075"
              value={location}
              onChangeText={setLocation}
              editable={!saving}
              autoCapitalize="words"
              returnKeyType="done"
            />
            <Text style={styles.fieldHint}>
              Enter your industry city or operating location.
            </Text>

            <TouchableOpacity
              style={[
                styles.saveButton,
                saving && styles.disabledButton,
              ]}
              onPress={submit}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save Industry
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              Find Supplier Industries
            </Text>

            <Text style={styles.sectionDescription}>
              Search by company name, industry type, or location.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g., Textile or Madurai"
              placeholderTextColor="#718075"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              returnKeyType="search"
            />

            {selectedIndustry && (
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedHeading}>
                  Selected Industry
                </Text>
                <Text style={styles.selectedName}>
                  {selectedIndustry.industryName}
                </Text>
                <Text style={styles.selectedDetails}>
                  {selectedIndustry.industryType || 'Type not specified'}
                  {' • '}
                  {selectedIndustry.location || 'Location not specified'}
                </Text>

                <TouchableOpacity
                  onPress={() => setSelectedIndustry(null)}
                >
                  <Text style={styles.clearSelection}>
                    Clear selection
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#287747"
                style={styles.loader}
              />
            ) : filteredItems.length === 0 ? (
              <Text style={styles.emptyText}>
                No industries found. Try another search or add an industry.
              </Text>
            ) : (
              <FlatList
                data={filteredItems}
                renderItem={renderIndustry}
                keyExtractor={(item, index) =>
                  item.id ?? `${item.industryName}-${index}`
                }
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator} />
                )}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8F5',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#183D29',
  },
  subtitle: {
    fontSize: 14,
    color: '#65776A',
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E9E1',
    marginBottom: 24,
  },
  listSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#234B32',
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#718075',
    marginTop: 5,
    marginBottom: 8,
  },
  label: {
    color: '#294534',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E1D7',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginTop: 7,
    color: '#203C2B',
    fontSize: 14,
  },
  fieldHint: {
    color: '#718075',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
    marginLeft: 2,
  },
  saveButton: {
    backgroundColor: '#287747',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  industryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E9E1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: '#287747',
    backgroundColor: '#EDF7EF',
  },
  industryInfo: {
    flex: 1,
    paddingRight: 10,
  },
  industryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#234B32',
  },
  industryDetails: {
    fontSize: 13,
    color: '#56695B',
    marginTop: 4,
  },
  industryLocation: {
    fontSize: 12,
    color: '#718075',
    marginTop: 5,
  },
  selectText: {
    color: '#287747',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedInfo: {
    backgroundColor: '#EDF7EF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBD9C2',
    padding: 13,
    marginTop: 12,
  },
  selectedHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#287747',
  },
  selectedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#234B32',
    marginTop: 4,
  },
  selectedDetails: {
    fontSize: 12,
    color: '#56695B',
    marginTop: 4,
  },
  clearSelection: {
    color: '#287747',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  loader: {
    marginTop: 24,
    marginBottom: 24,
  },
  emptyText: {
    color: '#718075',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: 24,
  },
  separator: {
    height: 10,
  },
});
