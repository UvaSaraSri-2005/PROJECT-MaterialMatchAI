import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { registerIndustry } from '@/lib/api';
export default function RegisterScreen() {
  const [industryName, setIndustryName] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleRegister() {
    if (
      !industryName.trim() ||
      !industryType.trim() ||
      !location.trim() ||
      !contactName.trim() ||
      !email.trim() ||
      !password
    ) {
      Alert.alert('Missing details', 'Please fill in all required fields marked with *.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Invalid password', 'Password must contain at least 8 characters.');
      return;
    }
    try {
      setLoading(true);
      await registerIndustry({
        industryName: industryName.trim(),
        industryType: industryType.trim(),
        location: location.trim(),
        contactName: contactName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
      });
      Alert.alert('Success', 'Industry account created successfully.', [
        {
          text: 'Continue',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Registration failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Register Your Industry</Text>
      <Text style={styles.subtitle}>
        Enter your industry details to join MaterialMatch AI.
        Fields marked * are required.
      </Text>
      <Text style={styles.label}>Industry Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. ABC Textile Industries"
        placeholderTextColor="#84928A"
        value={industryName}
        onChangeText={setIndustryName}
        autoCapitalize="words"
      />
      <Text style={styles.label}>Industry Type *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Textile, Plastic, Metal"
        placeholderTextColor="#84928A"
        value={industryType}
        onChangeText={setIndustryType}
      />
      <Text style={styles.label}>Industry Location *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city or industrial area"
        placeholderTextColor="#84928A"
        value={location}
        onChangeText={setLocation}
      />
      <Text style={styles.label}>Contact Person *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact person's full name"
        placeholderTextColor="#84928A"
        value={contactName}
        onChangeText={setContactName}
        autoCapitalize="words"
      />
      <Text style={styles.label}>Email Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="name@company.com"
        placeholderTextColor="#84928A"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.label}>Password *</Text>
      <TextInput
        style={styles.input}
        placeholder="Create a password (8+ characters)"
        placeholderTextColor="#84928A"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Text style={styles.label}>Phone Number (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact phone number"
        placeholderTextColor="#84928A"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already registered? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 36,
    backgroundColor: '#F7FAF8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#174C37',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#174C37',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E2DA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#198754',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#198754',
    fontWeight: '600',
    marginTop: 22,
  },
});
