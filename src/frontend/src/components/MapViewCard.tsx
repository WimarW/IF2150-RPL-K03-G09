/**
 * [Naufal Hasbialhaq] Komponen Peta Pin Penyedia Jasa
 * Traceability: UC02 (Skenario Normal N2, N3), KF03, KF08,
 * Kelas DPPL C05 PemberiJasaUI (showPemberiJasaMap, pressPemberiJasa), Antarmuka UI-06 (Hasil Pencarian)
 * Catatan: react-native-maps tidak mendukung web; aplikasi menargetkan Android (DPPL §2.1).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from './Header';
import { PemberiJasaDetail } from '../services/serviceCatalogService';
import {
  Coordinates,
  DEFAULT_MAP_REGION,
  formatJarak,
  formatRating,
  getProviderDisplayName,
  hasValidCoordinates,
} from '../controllers/useCatalogController';

const PIN_COLOR_SELECTED = '#F5A142';
const PIN_COLOR_OFFLINE = '#9AA5B1';
const SINGLE_PIN_DELTA = 0.04;
const EDGE_PADDING = {
  top: 48,
  right: 48,
  bottom: 48,
  left: 48,
};

export interface MapViewCardProps {
  userCoordinates: Coordinates | null;
  providers: PemberiJasaDetail[];
  selectedProviderId?: string | null;
  onPressProvider: (idPemberiJasa: string) => void;
  height?: number;
  testID?: string;
}

const MapViewCardComponent: React.FC<MapViewCardProps> = ({
  userCoordinates,
  providers,
  selectedProviderId = null,
  onPressProvider,
  height = 220,
  testID = 'map-view-card',
}) => {
  const mapRef = useRef<MapView | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const pins = useMemo(
    () => providers.filter(hasValidCoordinates),
    [providers]
  );

  const initialRegion: Region = useMemo(() => {
    if (userCoordinates) {
      return {
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
        latitudeDelta: SINGLE_PIN_DELTA,
        longitudeDelta: SINGLE_PIN_DELTA,
      };
    }
    if (pins.length > 0) {
      return {
        latitude: pins[0].latitude,
        longitude: pins[0].longitude,
        latitudeDelta: SINGLE_PIN_DELTA,
        longitudeDelta: SINGLE_PIN_DELTA,
      };
    }
    return DEFAULT_MAP_REGION;
  }, [pins, userCoordinates]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      return;
    }

    const coordinatesToFit: Coordinates[] = pins.map((pin) => ({
      latitude: pin.latitude,
      longitude: pin.longitude,
    }));

    if (userCoordinates) {
      coordinatesToFit.push({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      });
    }

    if (coordinatesToFit.length >= 2) {
      mapRef.current.fitToCoordinates(coordinatesToFit, {
        edgePadding: EDGE_PADDING,
        animated: true,
      });
    } else if (coordinatesToFit.length === 1) {
      mapRef.current.animateToRegion(
        {
          latitude: coordinatesToFit[0].latitude,
          longitude: coordinatesToFit[0].longitude,
          latitudeDelta: SINGLE_PIN_DELTA,
          longitudeDelta: SINGLE_PIN_DELTA,
        },
        350
      );
    }
  }, [isMapReady, pins, userCoordinates]);

  return (
    <View style={[styles.container, { height }]} testID={testID}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={Boolean(userCoordinates)}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onMapReady={() => setIsMapReady(true)}
      >
        {/* Pin Lokasi Pengguna */}
        {userCoordinates ? (
          <Marker
            coordinate={{
              latitude: userCoordinates.latitude,
              longitude: userCoordinates.longitude,
            }}
            title="Lokasi Kamu"
            pinColor={UI_THEME.textTitle}
            accessibilityLabel="Pin Lokasi Kamu"
            testID={`${testID}-user-pin`}
          />
        ) : null}

        {/* KF03 & KF08: Pin Lokasi Penyedia Jasa */}
        {pins.map((provider) => {
          const displayName = getProviderDisplayName(provider);
          const isSelected = selectedProviderId === provider.idPemberiJasa;
          const pinColor = isSelected
            ? PIN_COLOR_SELECTED
            : provider.isOnline
              ? UI_THEME.primary
              : PIN_COLOR_OFFLINE;

          return (
            <Marker
              key={provider.idPemberiJasa}
              coordinate={{
                latitude: provider.latitude,
                longitude: provider.longitude,
              }}
              title={displayName}
              description={`★ ${formatRating(provider.akumulasiRating)} · ${formatJarak(provider.jarakKm)}`}
              pinColor={pinColor}
              onPress={() => onPressProvider(provider.idPemberiJasa)}
              accessibilityLabel={`Pin ${displayName}`}
              testID={`map-pin-${provider.idPemberiJasa}`}
            />
          );
        })}
      </MapView>

      {/* Overlay Chip Jumlah Penyedia di Kiri Atas */}
      <View style={styles.topLeftOverlay} pointerEvents="none">
        <View style={styles.countChip} testID={`${testID}-count-chip`}>
          <Ionicons name="location" size={14} color={UI_THEME.primary} />
          <Text style={styles.countChipText}>
            {pins.length} penyedia di sekitarmu
          </Text>
        </View>
      </View>

      {/* Overlay Tengah jika tidak ada pin koordinat penyedia */}
      {pins.length === 0 ? (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <View style={styles.emptyBadge} testID={`${testID}-empty-overlay`}>
            <Ionicons
              name="map-outline"
              size={16}
              color={UI_THEME.textTitle}
            />
            <Text style={styles.emptyBadgeText}>
              Lokasi penyedia belum tersedia
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export const MapViewCard = React.memo(MapViewCardComponent);
MapViewCard.displayName = 'MapViewCard';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: UI_THEME.border,
    backgroundColor: '#E8EEF1',
    marginBottom: 16,
    position: 'relative',
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  topLeftOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    gap: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: UI_THEME.textTitle,
  },
  emptyOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 238, 241, 0.55)',
  },
  emptyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    gap: 6,
  },
  emptyBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: UI_THEME.textTitle,
  },
});

export default MapViewCard;
