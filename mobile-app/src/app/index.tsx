
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { getSavedUser, logout } from '@/lib/api';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getSavedUser()
        .then((savedUser) => {
          if (active) setUser(savedUser);
        })
        .catch(() => {
          if (active) setUser(null);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      Alert.alert('Logged out', 'You have logged out successfully.');
    } catch {
      Alert.alert('Error', 'Unable to log out. Please try again.');
    }
  }

  function openProtectedScreen(path: '/list-waste' | '/requirements') {
    if (!user) {
      Alert.alert(
        'Login required',
        'Please log in or register your industry account to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/login') },
          { text: 'Register', onPress: () => router.push('/register') },
        ]
      );
      return;
    }

    router.push(path);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8F2" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

          <View style={styles.brand}>
            <Text style={styles.appName}>MaterialMatch AI</Text>
            <Text style={styles.tagline}>TURN WASTE INTO VALUE</Text>
          </View>
        </View>

        {/* Account buttons */}
        <View style={styles.accountBar}>
          {user ? (
            <>
              <View style={styles.accountInfo}>
                <Text style={styles.accountWelcome}>Welcome back!</Text>
                <Text style={styles.accountName} numberOfLines={1}>
                  {user.industryName || user.email || 'Industry user'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={handleLogout}
              >
                <Text style={styles.outlineButtonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.outlineButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Welcome section */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>WELCOME TO A CIRCULAR FUTURE</Text>

          <Text style={styles.heroTitle}>
            One industry's waste,{'\n'}another's resource.
          </Text>

          <Text style={styles.heroDescription}>
            Connect industries, discover reusable materials,
            and build a more sustainable future together.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/find-materials')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Find Materials  →</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/industries')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#E1F3E5' }]}>
            <Text style={styles.iconText}>🏭</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Industries</Text>
            <Text style={styles.actionDescription}>
              Create and view supplier or seeker organizations.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => openProtectedScreen('/list-waste')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#E1F3E5' }]}>
            <Text style={styles.iconText}>♻️</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>List Your Waste</Text>
            <Text style={styles.actionDescription}>
              Turn your industrial by-products into useful resources.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => openProtectedScreen('/requirements')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FFF0D8' }]}>
            <Text style={styles.iconText}>📋</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Requirements</Text>
            <Text style={styles.actionDescription}>
              Tell suppliers which materials your industry needs.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/find-materials')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#E5EDFF' }]}>
            <Text style={styles.iconText}>🔎</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Find Materials</Text>
            <Text style={styles.actionDescription}>
              Discover materials your industry needs.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/resource-loop')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FFF0D8' }]}>
            <Text style={styles.iconText}>🌱</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Resource Loop</Text>
            <Text style={styles.actionDescription}>
              Explore reuse ideas and sustainability insights.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            if (!user) {
              Alert.alert(
                'Login required',
                'Please login to view supplier requests.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Login', onPress: () => router.push('/login') },
                ],
              );
              return;
            }

            router.push('/supplier-requests');
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#DDF5E3' }]}>
            <Text style={styles.iconText}>📩</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Supplier Requests</Text>
            <Text style={styles.actionDescription}>
              View incoming exchange requests and accept or reject them.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Better resources. Less waste.</Text>
          <Text style={styles.footerText}>
            Building a more circular industrial future.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },
  container: {
    padding: 22,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#237A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },
  brand: {
    marginLeft: 12,
  },
  appName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#193B28',
  },
  tagline: {
    marginTop: 3,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: '#5E8067',
  },
  accountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 22,
    gap: 10,
  },
  accountInfo: {
    flex: 1,
  },
  accountWelcome: {
    fontSize: 12,
    color: '#718075',
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#193B28',
    marginTop: 2,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#237A45',
    paddingVertical: 10,
    paddingHorizontal: 19,
    borderRadius: 11,
  },
  outlineButtonText: {
    color: '#237A45',
    fontWeight: '700',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#237A45',
    paddingVertical: 11,
    paddingHorizontal: 19,
    borderRadius: 11,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  hero: {
    backgroundColor: '#E3F1E4',
    borderRadius: 24,
    padding: 22,
    marginBottom: 30,
  },
  eyebrow: {
    color: '#237A45',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '800',
    color: '#173B26',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#496451',
    marginBottom: 22,
  },
  primaryButton: {
    backgroundColor: '#237A45',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#193B28',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E8EEE6',
  },
  actionIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 23,
  },
  actionContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },
  actionTitle: {
    color: '#193B28',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  actionDescription: {
    color: '#718075',
    fontSize: 12,
    lineHeight: 18,
  },
  arrow: {
    color: '#237A45',
    fontSize: 28,
  },
  footer: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 18,
  },
  footerTitle: {
    color: '#193B28',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    color: '#718075',
    fontSize: 12,
    marginTop: 7,
  },
});
