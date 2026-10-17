
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getMaterials,
  getIndustries,
  getSavedUser,
  createExchange,
  type Material,
  type Industry,
} from '@/lib/api';

export default function FindMaterialsScreen() {
  const [items, setItems] = useState<Material[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const [requestedQuantities, setRequestedQuantities] = useState<
    Record<string, string>
  >({});
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [myIndustryId, setMyIndustryId] = useState<string | null>(null);

  const { createdId } = useLocalSearchParams<{
    createdId?: string;
  }>();

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(undefined);

    try {
      const [materials, industryList, savedUser] = await Promise.all([
        getMaterials(),
        getIndustries(),
        getSavedUser(),
      ]);

      setItems(materials);
      setIndustries(industryList);
      setMyIndustryId(savedUser?.industryId || null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load materials and suppliers.',
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

  const industryById = useMemo(() => {
    return new Map(
      industries.map((industry) => [industry.id, industry]),
    );
  }, [industries]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      const supplier = industryById.get(item.industryId);

      return (
        (item.materialName || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query) ||
        (item.location || '').toLowerCase().includes(query) ||
        (supplier?.industryName || '').toLowerCase().includes(query) ||
        (supplier?.industryType || '').toLowerCase().includes(query) ||
        (supplier?.location || '').toLowerCase().includes(query)
      );
    });
  }, [items, search, industryById]);

  const handleRequestExchange = async (item: Material) => {
    if (requestingId) return;

    try {
      const savedUser = await getSavedUser();
      const seekerIndustryId = savedUser?.industryId;

      if (!seekerIndustryId) {
        Alert.alert(
          'Login required',
          'Please log in again to request an exchange.',
        );
        return;
      }

      if (!item.industryId) {
        Alert.alert(
          'Supplier unavailable',
          'This listing does not have a valid supplier industry.',
        );
        return;
      }

      if (seekerIndustryId === item.industryId) {
        Alert.alert(
          'Own listing',
          'You cannot request an exchange for your own industry listing.',
        );
        return;
      }

      if (
        item.pricePerUnit == null ||
        !Number.isFinite(Number(item.pricePerUnit)) ||
        Number(item.pricePerUnit) < 0
      ) {
        Alert.alert(
          'Price unavailable',
          'This listing does not have a valid price.',
        );
        return;
      }

      const quantityText =
        requestedQuantities[item.id] ?? String(item.quantity);

      const requestedQuantity = Number(quantityText);
      const availableQuantity = Number(item.quantity);

      if (
        !quantityText.trim() ||
        !Number.isFinite(requestedQuantity) ||
        requestedQuantity <= 0
      ) {
        Alert.alert(
          'Invalid quantity',
          'Enter a quantity greater than zero.',
        );
        return;
      }

      if (
        !Number.isFinite(availableQuantity) ||
        availableQuantity <= 0
      ) {
        Alert.alert(
          'Unavailable',
          'This listing currently has no available quantity.',
        );
        return;
      }

      if (requestedQuantity > availableQuantity) {
        Alert.alert(
          'Quantity unavailable',
          `You can request up to ${availableQuantity} ${item.unit}.`,
        );
        return;
      }

      setRequestingId(item.id);

      await createExchange({
        materialId: item.id,
        supplierIndustryId: item.industryId,
        seekerIndustryId,
        requestedQuantity,
        unit: item.unit,
        agreedPrice: Number(item.pricePerUnit),
      });

      Alert.alert(
        'Request sent!',
        `Your request for ${requestedQuantity} ${item.unit} of ${item.materialName} has been sent to the supplier.`,
      );
    } catch (e) {
      Alert.alert(
        'Request failed',
        e instanceof Error
          ? e.message
          : 'Unable to send the exchange request. Please try again.',
      );
    } finally {
      setRequestingId(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#176B36" size="large" />
        <Text style={styles.muted}>
          Loading materials and suppliers...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load(true)}
            tintColor="#176B36"
          />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Find Materials</Text>

            <Text style={styles.muted}>
              Search materials and discover their supplier industries.
            </Text>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search cotton, textile, industry..."
                placeholderTextColor="#7A8B7D"
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                returnKeyType="search"
              />

              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={styles.clearButton}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.resultCount}>
              {search.trim()
                ? `${filteredItems.length} matching listings`
                : `${items.length} available listings`}
            </Text>

            {!myIndustryId && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Log in with your industry account to request an exchange.
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => void load()}
                >
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              {search.trim()
                ? 'No matching materials found'
                : 'No material listings yet'}
            </Text>
            <Text style={styles.muted}>
              {search.trim()
                ? 'Try another material name, category or supplier.'
                : 'Supplier listings will appear here when available.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const supplier = industryById.get(item.industryId);
          const savedQuantity =
            requestedQuantities[item.id] ?? String(item.quantity);

          const isOwnListing =
            !!myIndustryId && myIndustryId === item.industryId;

          const priceMissing =
            item.pricePerUnit == null ||
            !Number.isFinite(Number(item.pricePerUnit)) ||
            Number(item.pricePerUnit) < 0;

          return (
            <View
              style={[
                styles.card,
                item.id === createdId && styles.newCard,
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.materialIcon}>
                  <Text style={styles.iconText}>♻</Text>
                </View>

                <View style={styles.materialHeading}>
                  <Text style={styles.name}>{item.materialName}</Text>
                  <Text style={styles.category}>{item.category}</Text>
                </View>
              </View>

              <View style={styles.quantityBox}>
                <Text style={styles.quantityLabel}>
                  Available quantity
                </Text>
                <Text style={styles.quantity}>
                  {item.quantity} {item.unit}
                </Text>
              </View>

              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Price per unit</Text>
                <Text style={styles.priceValue}>
                  {priceMissing
                    ? 'Price not provided'
                    : `₹${item.pricePerUnit} / ${item.unit}`}
                </Text>
              </View>

              <View style={styles.separator} />

              <Text style={styles.sectionTitle}>Supplier details</Text>

              <Text style={styles.detail}>
                Industry:{' '}
                {supplier?.industryName ||
                  'Supplier details unavailable'}
              </Text>

              <Text style={styles.detail}>
                Industry type: {supplier?.industryType || 'Not provided'}
              </Text>

              <Text style={styles.detail}>
                Location:{' '}
                {item.location || supplier?.location || 'Not provided'}
              </Text>

              <Text style={styles.detail}>
                Moisture:{' '}
                {item.moisture == null
                  ? 'Unknown'
                  : `${item.moisture}%`}
              </Text>

              {item.description ? (
                <Text style={styles.description}>
                  {item.description}
                </Text>
              ) : null}

              {item.industryId ? (
                <Text style={styles.supplierId}>
                  Supplier ID: {item.industryId}
                </Text>
              ) : null}

              <View style={styles.separator} />

              <Text style={styles.sectionTitle}>Request Exchange</Text>

              <Text style={styles.detail}>
                Enter the quantity you need. The supplier's listed price
                cannot be changed.
              </Text>

              <TextInput
                style={styles.quantityInput}
                value={savedQuantity}
                onChangeText={(value) =>
                  setRequestedQuantities((previous) => ({
                    ...previous,
                    [item.id]: value.replace(/[^0-9.]/g, ''),
                  }))
                }
                keyboardType="decimal-pad"
                placeholder={`Quantity in ${item.unit}`}
                placeholderTextColor="#7A8B7D"
                editable={requestingId !== item.id}
              />

              {isOwnListing ? (
                <Text style={styles.warningText}>
                  This is your industry's listing.
                </Text>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.requestButton,
                    (!myIndustryId ||
                      requestingId !== null ||
                      priceMissing ||
                      !item.industryId) &&
                      styles.disabledButton,
                  ]}
                  disabled={
                    !myIndustryId ||
                    requestingId !== null ||
                    priceMissing ||
                    !item.industryId
                  }
                  activeOpacity={0.75}
                  onPress={() => void handleRequestExchange(item)}
                >
                  {requestingId === item.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.requestButtonText}>
                      Request Exchange
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {priceMissing && !isOwnListing && (
                <Text style={styles.warningText}>
                  Exchange request unavailable because this listing has no
                  valid price.
                </Text>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F5F8F2',
  },
  list: {
    padding: 20,
    paddingBottom: 36,
    flexGrow: 1,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#193B28',
  },
  muted: {
    color: '#718075',
    marginTop: 5,
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8D5BE',
    borderRadius: 14,
    paddingHorizontal: 13,
    marginTop: 18,
    minHeight: 54,
  },
  searchIcon: {
    fontSize: 24,
    color: '#237A45',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#193B28',
    fontSize: 14,
  },
  clearButton: {
    color: '#496451',
    fontSize: 18,
    paddingHorizontal: 5,
  },
  resultCount: {
    marginTop: 14,
    color: '#496451',
    fontWeight: '700',
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: '#FFF4D8',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  infoText: {
    color: '#76551B',
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: '#FDECEC',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  errorText: {
    color: '#8D2B2B',
  },
  retryButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#237A45',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EAE0',
    marginBottom: 14,
  },
  newCard: {
    borderColor: '#237A45',
    borderWidth: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#EAF4E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 25,
    color: '#237A45',
  },
  materialHeading: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#193B28',
  },
  category: {
    color: '#237A45',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  quantityBox: {
    backgroundColor: '#F0F7EF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  quantityLabel: {
    color: '#496451',
    fontSize: 12,
  },
  quantity: {
    fontSize: 20,
    fontWeight: '800',
    color: '#237A45',
    marginTop: 4,
  },
  priceBox: {
    backgroundColor: '#E3F1E4',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  priceLabel: {
    color: '#496451',
    fontSize: 12,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#237A45',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E6EDE3',
    marginVertical: 15,
  },
  sectionTitle: {
    color: '#193B28',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },
  detail: {
    fontSize: 13,
    color: '#496451',
    lineHeight: 22,
  },
  description: {
    color: '#496451',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  supplierId: {
    color: '#8A978B',
    fontSize: 10,
    marginTop: 12,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#B8D5BE',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#193B28',
    fontSize: 15,
    marginTop: 12,
  },
  requestButton: {
    backgroundColor: '#176B36',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#105329',
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#A7B9AA',
    borderColor: '#A7B9AA',
    elevation: 0,
    opacity: 1,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  warningText: {
    color: '#8D5B18',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  emptyBox: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 38,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#193B28',
    textAlign: 'center',
  },
});
