
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getSavedUser,
  getSupplierExchanges,
  getMaterials,
  getIndustries,
  updateExchangeStatus,
  type Exchange,
  type Material,
  type Industry,
} from '@/lib/api';

export default function SupplierRequestsScreen() {
  const [requests, setRequests] = useState<Exchange[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState('');

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const user = await getSavedUser();

      if (!user?.industryId) {
        setRequests([]);
        Alert.alert('Login required', 'Please login to view supplier requests.');
        return;
      }

      setSupplierId(user.industryId);

      const [exchangeData, materialData, industryData] = await Promise.all([
        getSupplierExchanges(user.industryId),
        getMaterials(),
        getIndustries(),
      ]);

      setRequests(
        exchangeData.filter(
          (item) => item.supplierIndustryId === user.industryId,
        ),
      );
      setMaterials(materialData);
      setIndustries(industryData);
    } catch (error) {
      Alert.alert(
        'Could not load requests',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const changeStatus = (item: Exchange, status: 'ACCEPTED' | 'REJECTED') => {
    Alert.alert(
      status === 'ACCEPTED' ? 'Accept request?' : 'Reject request?',
      'Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: status === 'ACCEPTED' ? 'Accept' : 'Reject',
          onPress: async () => {
            try {
              setUpdatingId(item.id);
              await updateExchangeStatus(item.id, status);
              Alert.alert('Success', `Request ${status.toLowerCase()}.`);
              await load(true);
            } catch (error) {
              Alert.alert(
                'Update failed',
                error instanceof Error ? error.message : 'Please try again.',
              );
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ],
    );
  };

  const getMaterialName = (id: string) =>
    materials.find((material) => material.id === id)?.materialName ?? 'Material';

  const getIndustryName = (id: string) =>
    industries.find((industry) => industry.id === id)?.industryName ?? 'Industry';

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#176B36" />
        <Text style={styles.muted}>Loading supplier requests...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Supplier Requests</Text>
        <Text style={styles.subtitle}>
          Exchange requests received by your industry
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load(true)}
          />
        }
        contentContainerStyle={requests.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No exchange requests yet</Text>
            <Text style={styles.muted}>
              Requests sent to your industry will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const pending = item.status === 'PENDING';
          const busy = updatingId === item.id;

          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.material}>
                  {getMaterialName(item.materialId)}
                </Text>
                <Text
                  style={[
                    styles.status,
                    item.status === 'PENDING' && styles.pending,
                    item.status === 'ACCEPTED' && styles.accepted,
                    item.status === 'REJECTED' && styles.rejected,
                    item.status === 'COMPLETED' && styles.completed,
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <Text style={styles.detail}>
                Buyer: {getIndustryName(item.seekerIndustryId)}
              </Text>
              <Text style={styles.detail}>
                Quantity: {item.requestedQuantity} {item.unit}
              </Text>
              <Text style={styles.detail}>
                Agreed price: ₹{item.agreedPrice} / {item.unit}
              </Text>

              {item.createdAt ? (
                <Text style={styles.date}>
                  Requested: {new Date(item.createdAt).toLocaleString()}
                </Text>
              ) : null}

              {pending && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    disabled={busy}
                    onPress={() => changeStatus(item, 'ACCEPTED')}
                  >
                    <Text style={styles.buttonText}>
                      {busy ? 'Please wait...' : 'Accept'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    disabled={busy}
                    onPress={() => changeStatus(item, 'REJECTED')}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F4',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F8F4',
  },
  heading: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#174D2B',
  },
  subtitle: {
    marginTop: 5,
    color: '#657568',
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
  emptyList: {
    flexGrow: 1,
    padding: 20,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#174D2B',
  },
  muted: {
    color: '#657568',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DDE9DE',
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  material: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#1E3826',
  },
  status: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '800',
  },
  pending: {
    backgroundColor: '#FFF0C2',
    color: '#805800',
  },
  accepted: {
    backgroundColor: '#DDF5E3',
    color: '#176B36',
  },
  rejected: {
    backgroundColor: '#FCE4E4',
    color: '#A12626',
  },
  completed: {
    backgroundColor: '#E4EAFB',
    color: '#304C9B',
  },
  detail: {
    fontSize: 14,
    color: '#405246',
    marginBottom: 7,
  },
  date: {
    fontSize: 12,
    color: '#758078',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  button: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#176B36',
  },
  rejectButton: {
    backgroundColor: '#B42323',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
