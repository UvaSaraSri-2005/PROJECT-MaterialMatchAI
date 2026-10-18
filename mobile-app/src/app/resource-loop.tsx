
import { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { getResourceLoop, type Recommendation } from '@/lib/api';

export default function ResourceLoopScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!name.trim() || !category.trim()) {
      setError('Please enter both the material name and category.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const recommendations = await getResourceLoop(
        name.trim(),
        category.trim(),
      );
      setItems(recommendations);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load recommendations. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.page}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.title}>Resource Loop</Text>

        <Text style={s.muted}>
          Discover possible reuse options for industrial waste.
          Enter the material details to get recommendations.
        </Text>

        <View style={s.notice}>
          <Text style={s.noticeTitle}>
            ♻️ How it works
          </Text>
          <Text style={s.noticeText}>
            MaterialMatch AI suggests potential uses based on
            the available backend rules. Always verify material
            quality, contamination, safety, and processing
            requirements before reuse.
          </Text>
        </View>

        <View style={s.form}>
          <Text style={s.formTitle}>
            Find Reuse Opportunities
          </Text>

          <Text style={s.formHint}>
            Enter both required fields to continue.
          </Text>

          <Text style={s.label}>
            Material Name *
          </Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Cotton textile offcuts"
            placeholderTextColor="#718075"
            autoCapitalize="words"
            editable={!loading}
            returnKeyType="next"
          />
          <Text style={s.fieldHint}>
            What waste material do you want to reuse?
          </Text>

          <Text style={s.label}>
            Material Category *
          </Text>
          <TextInput
            style={s.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Textile, Plastic, Metal"
            placeholderTextColor="#718075"
            autoCapitalize="words"
            editable={!loading}
            returnKeyType="done"
          />
          <Text style={s.fieldHint}>
            Enter the category that best describes your material.
          </Text>

          <TouchableOpacity
            style={[s.button, loading && s.disabledButton]}
            onPress={search}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.buttonText}>
                Get Recommendations
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={s.error}>{error}</Text>
        ) : null}

        {items.length > 0 && (
          <View style={s.resultsHeader}>
            <Text style={s.resultsTitle}>
              Suggested Reuse Options
            </Text>
            <Text style={s.resultsHint}>
              Review each suggestion before using the material.
            </Text>
          </View>
        )}

        {items.map((item, index) => (
          <View key={index} style={s.card}>
            <Text style={s.optionLabel}>
              RECOMMENDED USE
            </Text>
            <Text style={s.name}>
              {item.recommendedUse}
            </Text>

            <View style={s.divider} />

            <Text style={s.detailLabel}>
              Target Industry
            </Text>
            <Text style={s.detail}>
              {item.targetIndustry}
            </Text>

            <Text style={s.detailLabel}>
              Why this may be suitable
            </Text>
            <Text style={s.detail}>
              {item.reason}
            </Text>

            <Text style={s.detailLabel}>
              Processing Required
            </Text>
            <Text style={s.detail}>
              {item.processingRequired}
            </Text>

            <Text style={s.detailLabel}>
              Suitability
            </Text>
            <Text style={s.detail}>
              {item.suitability}
            </Text>

            <Text style={s.detailLabel}>
              Safety Note
            </Text>
            <Text style={s.detail}>
              {item.safetyNote}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },
  page: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#193B28',
  },
  muted: {
    color: '#496451',
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  notice: {
    backgroundColor: '#E8F3E8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#CFE2D0',
  },
  noticeTitle: {
    color: '#234B32',
    fontWeight: '800',
    fontSize: 14,
  },
  noticeText: {
    color: '#496451',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCE5DA',
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
  button: {
    backgroundColor: '#237A45',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
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
  error: {
    color: '#8D2B2B',
    backgroundColor: '#FBEDED',
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    lineHeight: 19,
  },
  resultsHeader: {
    marginTop: 24,
    marginBottom: 4,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#193B28',
  },
  resultsHint: {
    color: '#718075',
    fontSize: 13,
    marginTop: 5,
    lineHeight: 19,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#DCE5DA',
  },
  optionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#237A45',
    marginBottom: 5,
  },
  name: {
    fontWeight: '800',
    color: '#193B28',
    fontSize: 17,
    lineHeight: 23,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4EBE3',
    marginVertical: 13,
  },
  detailLabel: {
    color: '#294534',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
  },
  detail: {
    color: '#496451',
    marginTop: 4,
    lineHeight: 19,
    fontSize: 13,
  },
});
