
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createRequirement,
  getIndustries,
  getRequirements,
  Industry,
  Requirement,
} from '@/lib/api';

export default function RequirementsScreen() {
  const [items, setItems] = useState<Requirement[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const [requirements, companies] = await Promise.all([
        getRequirements(),
        getIndustries(),
      ]);
      setItems(requirements);
      setIndustries(companies);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load requirements. Please try again.',
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const submit = async () => {
    const amount = Number(quantity);

    if (
      !name.trim() ||
      !category.trim() ||
      !location.trim() ||
      !industryId ||
      !quantity.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      Alert.alert(
        'Check required fields',
        'Enter the material name, category, a positive quantity and location. Also select your industry.',
      );
      return;
    }

    setSaving(true);

    try {
      await createRequirement({
        industryId,
        materialName: name.trim(),
        category: category.trim(),
        quantity: amount,
        unit: 'kg',
        location: location.trim(),
      });

      setName('');
      setCategory('');
      setQuantity('');
      setLocation('');

      Alert.alert('Success', 'Your requirement has been created.');
      await load();
    } catch (e) {
      Alert.alert(
        'Requirement was not saved',
        e instanceof Error ? e.message : 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            item.id ?? `${item.materialName}-${index}`
          }
          contentContainerStyle={s.page}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={s.title}>Requirements</Text>
              <Text style={s.muted}>
                Tell suppliers what materials your industry needs.
                Your requirement can then be used for material matching.
              </Text>

              {error ? (
                <Text style={s.error}>{error}</Text>
              ) : null}

              <View style={s.form}>
                <Text style={s.formTitle}>
                  Create a Requirement
                </Text>
                <Text style={s.formHint}>
                  Fields marked with * are required.
                </Text>

                <Text style={s.label}>
                  Material Name *
                </Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g., Cotton textile waste"
                  placeholderTextColor="#718075"
                  value={name}
                  onChangeText={setName}
                  editable={!saving}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Text style={s.fieldHint}>
                  Enter the raw material or waste material you need.
                </Text>

                <Text style={s.label}>
                  Material Category *
                </Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g., Textile, Plastic, Metal"
                  placeholderTextColor="#718075"
                  value={category}
                  onChangeText={setCategory}
                  editable={!saving}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Text style={s.fieldHint}>
                  Choose the category that best describes the material.
                </Text>

                <Text style={s.label}>
                  Required Quantity (kg) *
                </Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g., 500"
                  placeholderTextColor="#718075"
                  keyboardType="decimal-pad"
                  value={quantity}
                  onChangeText={setQuantity}
                  editable={!saving}
                />
                <Text style={s.fieldHint}>
                  Enter the total quantity you need in kilograms.
                </Text>

                <Text style={s.label}>
                  Delivery / Required Location *
                </Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g., Madurai, Tamil Nadu"
                  placeholderTextColor="#718075"
                  value={location}
                  onChangeText={setLocation}
                  editable={!saving}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
                <Text style={s.fieldHint}>
                  Enter the location where you need the material.
                </Text>

                <Text style={s.label}>
                  Seeking Industry *
                </Text>
                <Text style={s.fieldHint}>
                  Select the industry placing this requirement.
                </Text>

                {industries.length === 0 ? (
                  <Text style={s.emptyIndustry}>
                    No industries available. Please register an industry
                    first.
                  </Text>
                ) : (
                  <View style={s.chips}>
                    {industries.map((industry) => (
                      <TouchableOpacity
                        key={industry.id}
                        style={[
                          s.chip,
                          industryId === industry.id && s.selected,
                        ]}
                        onPress={() => setIndustryId(industry.id)}
                        disabled={saving}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            s.chipText,
                            industryId === industry.id &&
                              s.selectedText,
                          ]}
                        >
                          {industryId === industry.id ? '✓ ' : ''}
                          {industry.industryName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    s.button,
                    saving && s.disabledButton,
                  ]}
                  disabled={saving}
                  onPress={submit}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={s.buttonText}>
                      Create Requirement
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={s.heading}>
                Saved Requirements
              </Text>
              <Text style={s.listHint}>
                Your previously created material requirements.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.name}>
                {item.materialName}
              </Text>
              <Text style={s.cardDetails}>
                Category: {item.category}
              </Text>
              <Text style={s.cardDetails}>
                Quantity: {item.quantity} {item.unit}
              </Text>
              <Text style={s.cardDetails}>
                Location: {item.location}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={s.separator} />
          )}
          ListEmptyComponent={
            <Text style={s.emptyText}>
              No requirements yet. Create your first requirement above.
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },
  flex: {
    flex: 1,
  },
  page: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#193B28',
    marginBottom: 6,
  },
  muted: {
    color: '#496451',
    lineHeight: 21,
    fontSize: 14,
    marginBottom: 14,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCE5DA',
    marginTop: 8,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#193B28',
  },
  formHint: {
    color: '#718075',
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#294534',
    marginTop: 15,
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5DA',
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5DA',
  },
  chipText: {
    color: '#294534',
    fontSize: 13,
  },
  selected: {
    backgroundColor: '#E3F1E4',
    borderColor: '#237A45',
  },
  selectedText: {
    color: '#237A45',
    fontWeight: '700',
  },
  emptyIndustry: {
    color: '#8D2B2B',
    fontSize: 13,
    marginTop: 10,
    lineHeight: 19,
  },
  button: {
    backgroundColor: '#237A45',
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 52,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  heading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#193B28',
    marginTop: 24,
    marginBottom: 5,
  },
  listHint: {
    color: '#718075',
    fontSize: 13,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E9E1',
  },
  name: {
    fontWeight: '800',
    fontSize: 16,
    color: '#193B28',
    marginBottom: 6,
  },
  cardDetails: {
    color: '#496451',
    fontSize: 13,
    lineHeight: 20,
  },
  separator: {
    height: 10,
  },
  emptyText: {
    color: '#718075',
    fontSize: 13,
    lineHeight: 20,
    paddingVertical: 12,
  },
  error: {
    color: '#8D2B2B',
    marginBottom: 10,
  },
});
