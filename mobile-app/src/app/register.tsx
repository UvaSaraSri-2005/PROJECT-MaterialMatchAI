
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
      Alert.alert('Missing details', 'Please fill in all required fields.');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Industry</Text>
      <Text style={styles.subtitle}>
        Join MaterialMatch AI and turn waste into value.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Industry name *"
        value={industryName}
        onChangeText={setIndustryName}
      />
      <TextInput
        style={styles.input}
        placeholder="Industry type * (e.g. Textile)"
        value={industryType}
        onChangeText={setIndustryType}
      />
      <TextInput
        style={styles.input}
        placeholder="Location *"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact person *"
        value={contactName}
        onChangeText={setContactName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email address *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (minimum 8 characters) *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={styles.button}
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
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E2DA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#198754',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
