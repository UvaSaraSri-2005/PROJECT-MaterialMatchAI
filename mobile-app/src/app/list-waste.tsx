
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createMaterial,
  getIndustries,
  type Industry,
} from '@/lib/api';

export default function ListWasteScreen() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industryId, setIndustryId] = useState('');
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);

  const [materialName, setMaterialName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [location, setLocation] = useState('');
  const [moisture, setMoisture] = useState('');
  const [description, setDescription] = useState('');

  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [industryError, setIndustryError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedIndustry = industries.find(
    (industry) => industry.id === industryId
  );

  const loadIndustries = useCallback(async () => {
    setLoadingIndustries(true);
    setIndustryError('');

    try {
      const data = await getIndustries();
      setIndustries(Array.isArray(data) ? data : []);
    } catch (error) {
      setIndustryError(
        error instanceof Error
          ? error.message
          : 'Unable to load industries.'
      );
    } finally {
      setLoadingIndustries(false);
    }
  }, []);

  useEffect(() => {
    void loadIndustries();
  }, [loadIndustries]);

  const selectIndustry = (industry: Industry) => {
    setIndustryId(industry.id);

    if (industry.location) {
      setLocation(industry.location);
    }
  };

  const submit = async () => {
    if (!industryId) {
      Alert.alert(
        'Select an industry',
        'Choose your supplier industry first.'
      );
      return;
    }

    if (
      !materialName.trim() ||
      !category.trim() ||
      !quantity.trim() ||
      !pricePerUnit.trim() ||
      !location.trim()
    ) {
      Alert.alert(
        'Missing details',
        'Material name, category, quantity, price, and location are required.'
      );
      return;
    }

    const amount = Number(quantity);
    const priceValue = Number(pricePerUnit);
    const moistureValue =
      moisture.trim() === '' ? undefined : Number(moisture);

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert(
        'Invalid quantity',
        'Enter a quantity greater than zero.'
      );
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      Alert.alert(
        'Invalid price',
        'Enter a valid price per kg. Free materials can have a price of 0.'
      );
      return;
    }

    if (
      moistureValue !== undefined &&
      (!Number.isFinite(moistureValue) ||
        moistureValue < 0 ||
        moistureValue > 100)
    ) {
      Alert.alert(
        'Invalid moisture',
        'Enter a value from 0 to 100, or leave it blank when unknown.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const created = await createMaterial({
        industryId,
        materialName: materialName.trim(),
        category: category.trim(),
        quantity: amount,
        pricePerUnit: priceValue,
        unit: 'kg',
        location: location.trim(),
        ...(moistureValue === undefined
          ? {}
          : { moisture: moistureValue }),
        ...(description.trim()
          ? { description: description.trim() }
          : {}),
      });

      Alert.alert(
        'Success',
        'Your waste listing has been saved.',
        [
          {
            text: 'OK',
            onPress: () =>
              router.replace({
                pathname: '/find-materials',
                params: { createdId: created.id },
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Listing was not saved',
        error instanceof Error
          ? error.message
          : 'Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>MATERIALMATCH AI</Text>

        <Text style={styles.title}>List Your Waste</Text>

        <Text style={styles.subtitle}>
          Select your registered industry and enter the waste details.
        </Text>

        <Text style={styles.label}>Supplier industry *</Text>

        {loadingIndustries ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#237A45"
          />
        ) : industryError ? (
          <View style={styles.notice}>
            <Text style={styles.error}>{industryError}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadIndustries()}
            >
              <Text style={styles.retryText}>
                Retry loading industries
              </Text>
            </TouchableOpacity>
          </View>
        ) : industries.length === 0 ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              No registered industries found. Register an industry
              before listing waste.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadIndustries()}
            >
              <Text style={styles.retryText}>
                Refresh industries
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() =>
                setIndustryDropdownOpen((open) => !open)
              }
              accessibilityRole="button"
              accessibilityLabel="Select supplier industry"
              accessibilityState={{
                expanded: industryDropdownOpen,
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedIndustry && styles.dropdownPlaceholder,
                ]}
                numberOfLines={1}
              >
                {selectedIndustry?.industryName ??
                  'Select your industry'}
              </Text>

              <Text style={styles.dropdownArrow}>
                {industryDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {industryDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {industries.map((industry) => {
                  const selected = industryId === industry.id;

                  return (
                    <TouchableOpacity
                      key={industry.id}
                      style={[
                        styles.dropdownOption,
                        selected && styles.industrySelected,
                      ]}
                      onPress={() => {
                        selectIndustry(industry);
                        setIndustryDropdownOpen(false);
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <View style={styles.industryInfo}>
                        <Text style={styles.industryName}>
                          {industry.industryName}
                        </Text>

                        <Text style={styles.industryDetail}>
                          {industry.industryType || 'Industry'}
                          {industry.location
                            ? ` • ${industry.location}`
                            : ''}
                        </Text>
                      </View>

                      {selected && (
                        <Text style={styles.radio}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        <Field
          label="Material name *"
          value={materialName}
          onChangeText={setMaterialName}
          placeholder="e.g. Cotton textile offcuts"
        />

        <Field
          label="Material category *"
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Textile"
        />

        <Field
          label="Available quantity (kg) *"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="e.g. 500"
          keyboardType="decimal-pad"
        />

        <Field
          label="Price per kg (₹) *"
          value={pricePerUnit}
          onChangeText={setPricePerUnit}
          placeholder="e.g. 12"
          keyboardType="decimal-pad"
        />

        <Text style={styles.helperText}>
          Enter 12 for ₹12 per kg. Enter 0 if the material is free.
        </Text>

        <Field
          label="Location *"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Madurai"
        />

        <Field
          label="Moisture (%) — optional"
          value={moisture}
          onChangeText={setMoisture}
          placeholder="Leave blank if unknown"
          keyboardType="decimal-pad"
        />

        <Field
          label="Description — optional"
          value={description}
          onChangeText={setDescription}
          placeholder="Condition, contamination, or handling notes"
          multiline
        />

        <TouchableOpacity
          accessibilityRole="button"
          disabled={
            submitting ||
            loadingIndustries ||
            industries.length === 0
          }
          style={[
            styles.button,
            (submitting ||
              loadingIndustries ||
              industries.length === 0) &&
              styles.disabled,
          ]}
          onPress={() => void submit()}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Submit listing
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
  multiline?: boolean;
}) {
  return (
    <View>
      <Text style={styles.label}>{props.label}</Text>

      <TextInput
        style={[
          styles.input,
          props.multiline && styles.multi,
        ]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="#718075"
        keyboardType={props.keyboardType}
        multiline={props.multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '800',
    color: '#237A45',
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#193B28',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#718075',
    marginTop: 8,
  },
  label: {
    color: '#294534',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DCE5DA',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#193B28',
  },
  multi: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  helperText: {
    color: '#718075',
    fontSize: 12,
    marginTop: 6,
  },
  loader: {
    marginVertical: 22,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DCE5DA',
    borderRadius: 12,
    padding: 16,
    minHeight: 54,
  },
  dropdownText: {
    flex: 1,
    color: '#193B28',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownPlaceholder: {
    color: '#718075',
    fontWeight: '400',
  },
  dropdownArrow: {
    color: '#237A45',
    marginLeft: 10,
    fontSize: 12,
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DCE5DA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEE5',
  },
  industrySelected: {
    backgroundColor: '#E3F1E4',
  },
  industryInfo: {
    flex: 1,
  },
  industryName: {
    fontWeight: '800',
    color: '#193B28',
    fontSize: 14,
  },
  industryDetail: {
    color: '#496451',
    fontSize: 12,
    marginTop: 5,
  },
  radio: {
    fontSize: 20,
    color: '#237A45',
    marginLeft: 12,
    fontWeight: '800',
  },
  notice: {
    backgroundColor: '#E3F1E4',
    padding: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  noticeText: {
    color: '#496451',
    lineHeight: 19,
    fontSize: 13,
  },
  error: {
    color: '#8D2B2B',
    lineHeight: 19,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 6,
  },
  retryText: {
    color: '#237A45',
    fontWeight: '800',
  },
  button: {
    backgroundColor: '#237A45',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
    minHeight: 52,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
