
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createIndustry, getIndustries } from '@/lib/api';
import type { Industry } from '@/lib/api';

export default function IndustriesScreen() {
  const [items, setItems] = useState<Industry[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndustry, setSelectedIndustry] =
    useState<Industry | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const industries = await getIndustries();
      setItems(industries);
    } catch (error) {
      Alert.alert(
        'Unable to load industries',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredItems = items.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      item.industryName.toLowerCase().includes(query) ||
      (item.industryType || '').toLowerCase().includes(query) ||
      (item.location || '').toLowerCase().includes(query)
    );
  });

  const suggestions = filteredItems.slice(0, 6);

  const chooseIndustry = (item: Industry) => {
    setSearch(item.industryName);
    setSelectedIndustry(item);
    setShowSuggestions(false);
  };

  const submit = async () => {
    if (saving) {
      return;
    }

    if (!name.trim() || !location.trim()) {
      Alert.alert(
        'Missing details',
        'Industry name and location are required.',
      );
      return;
    }

    setSaving(true);

    try {
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
      Alert.alert(
        'Profile was not saved',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.page}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Supplier Industries</Text>

            <Text style={styles.muted}>
              Search registered industries by name, type or location.
            </Text>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search supplier industry..."
                placeholderTextColor="#7A8B7D"
                value={search}
                onChangeText={(value) => {
                  setSearch(value);
                  setSelectedIndustry(null);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                autoCorrect={false}
                returnKeyType="search"
              />

              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearch('');
                    setSelectedIndustry(null);
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.clearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {showSuggestions && search.trim().length > 0 && (
              <View style={styles.dropdown}>
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestion}
                      onPress={() => chooseIndustry(item)}
                    >
                      <View style={styles.suggestionIcon}>
                        <Text>🏭</Text>
                      </View>

                      <View style={styles.suggestionDetails}>
                        <Text style={styles.suggestionName}>
                          {item.industryName}
                        </Text>
                        <Text style={styles.suggestionMeta}>
                          {item.industryType || 'Industry'} ·{' '}
                          {item.location || 'Location unavailable'}
                        </Text>
                      </View>

                      <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noSuggestions}>
                    No matching industries found.
                  </Text>
                )}

                {filteredItems.length > 6 && (
                  <Text style={styles.moreText}>
                    Showing first 6 matches. Refine your search for more.
                  </Text>
                )}
              </View>
            )}

            {selectedIndustry && (
              <View style={styles.selectedCard}>
                <Text style={styles.selectedTitle}>
                  Selected Supplier
                </Text>
                <Text style={styles.name}>
                  {selectedIndustry.industryName}
                </Text>
                <Text style={styles.muted}>
                  {selectedIndustry.industryType || 'Industry'} ·{' '}
                  {selectedIndustry.location || 'Location unavailable'}
                </Text>
              </View>
            )}

            <Text style={styles.heading}>Add an Industry</Text>

            <TextInput
              style={styles.input}
              placeholder="Industry/company name"
              value={name}
              onChangeText={setName}
              editable={!saving}
            />

            <TextInput
              style={styles.input}
              placeholder="Industry type (optional)"
              value={type}
              onChangeText={setType}
              editable={!saving}
            />

            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              editable={!saving}
            />

            <TouchableOpacity
              style={[styles.button, saving && styles.buttonDisabled]}
              onPress={submit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Save industry</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.heading}>
              {search.trim()
                ? `Matching Industries (${filteredItems.length})`
                : `All Supplier Industries (${items.length})`}
            </Text>

            {loading && items.length === 0 && (
              <ActivityIndicator
                style={styles.loader}
                color="#237A45"
                size="large"
              />
            )}

            {!loading && filteredItems.length === 0 && (
              <Text style={styles.muted}>
                {search.trim()
                  ? 'No matching industries found. Try another name.'
                  : 'No industries found yet.'}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedIndustry?.id === item.id && styles.activeCard,
            ]}
            onPress={() => chooseIndustry(item)}
          >
            <Text style={styles.name}>{item.industryName}</Text>
            <Text style={styles.muted}>
              {item.industryType || 'Industry'} ·{' '}
              {item.location || 'Location unavailable'}
            </Text>
            <Text style={styles.selectText}>Tap to select supplier</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },
  page: {
    padding: 20,
    paddingBottom: 36,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#193B28',
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#193B28',
    marginTop: 22,
    marginBottom: 8,
  },
  muted: {
    color: '#496451',
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8D5BE',
    borderRadius: 14,
    paddingHorizontal: 13,
    marginTop: 16,
    minHeight: 52,
  },
  searchIcon: {
    fontSize: 24,
    color: '#237A45',
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    color: '#193B28',
    paddingVertical: 12,
    fontSize: 15,
  },
  clearText: {
    fontSize: 18,
    color: '#496451',
    paddingHorizontal: 5,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5DA',
    borderRadius: 14,
    marginTop: 5,
    overflow: 'hidden',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1EB',
  },
  suggestionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EAF4E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  suggestionDetails: {
    flex: 1,
  },
  suggestionName: {
    color: '#193B28',
    fontWeight: '700',
    fontSize: 14,
  },
  suggestionMeta: {
    color: '#657667',
    fontSize: 12,
    marginTop: 4,
  },
  arrow: {
    fontSize: 25,
    color: '#237A45',
    marginLeft: 8,
  },
  noSuggestions: {
    color: '#657667',
    padding: 14,
  },
  moreText: {
    color: '#657667',
    fontSize: 12,
    padding: 10,
    backgroundColor: '#F5F8F2',
  },
  selectedCard: {
    backgroundColor: '#EAF4E9',
    borderColor: '#B8D5BE',
    borderWidth: 1,
    padding: 15,
    borderRadius: 14,
    marginTop: 12,
  },
  selectedTitle: {
    color: '#237A45',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5DA',
    borderRadius: 12,
    padding: 13,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#237A45',
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5EBE2',
  },
  activeCard: {
    borderColor: '#237A45',
    backgroundColor: '#F0F7EF',
  },
  name: {
    fontWeight: '800',
    fontSize: 16,
    color: '#193B28',
  },
  selectText: {
    color: '#237A45',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 8,
  },
  loader: {
    margin: 20,
  },
});
