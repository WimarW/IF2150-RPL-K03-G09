/**
 * [Naufal Hasbialhaq] UI-05 Rekomendasi Pencarian
 * Traceability: UC02 (Skenario Normal N1), KF01, KF02,
 * Kelas DPPL C14 KategoriJasaUI, Antarmuka UI-05 (UI-05-01 s.d. UI-05-05)
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from '../../components/Header';
import { RootStackScreenProps } from '../../navigation/types';
import {
  SearchSuggestion,
  useSearchRecommendationController,
} from '../../controllers/useCatalogController';

const TILE_PALETTE = [
  { bg: '#E3F5F1', iconColor: '#20AE96' },
  { bg: '#FDF1E3', iconColor: '#F5A142' },
  { bg: '#E6EEF8', iconColor: '#1B3A5C' },
] as const;

/**
 * Memetakan label rekomendasi ke nama ikon Ionicons sesuai kata kunci
 */
function getSuggestionIcon(label: string): keyof typeof Ionicons.glyphMap {
  const lower = label.toLowerCase();
  if (lower.includes('mobil')) return 'car-outline';
  if (lower.includes('motor')) return 'bicycle-outline';
  if (
    /\bac\b/.test(lower) ||
    lower.includes('cuci ac') ||
    lower.includes('servis ac')
  ) {
    return 'snow-outline';
  }
  if (lower.includes('sofa')) return 'bed-outline';
  if (
    lower.includes('baju') ||
    lower.includes('laundry') ||
    lower.includes('permak') ||
    lower.includes('jahit')
  ) {
    return 'shirt-outline';
  }
  if (lower.includes('karpet')) return 'grid-outline';
  if (lower.includes('servis') || lower.includes('elektronik')) {
    return 'construct-outline';
  }
  if (lower.includes('bersih') || lower.includes('kebersihan')) {
    return 'sparkles-outline';
  }
  if (lower.includes('pipa') || lower.includes('ledeng')) {
    return 'water-outline';
  }
  if (lower.includes('renovasi') || lower.includes('cat')) {
    return 'hammer-outline';
  }
  if (lower.includes('desain') || lower.includes('logo')) {
    return 'color-palette-outline';
  }
  return 'search-outline';
}

interface SuggestionItemCardProps {
  item: SearchSuggestion;
  index: number;
  onPress: (keyword: string) => void;
}

const SuggestionItemCardComponent: React.FC<SuggestionItemCardProps> = ({
  item,
  index,
  onPress,
}) => {
  const palette = TILE_PALETTE[index % TILE_PALETTE.length];
  const iconName = getSuggestionIcon(item.label);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.suggestionCard,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item.keyword)}
      accessibilityRole="button"
      accessibilityLabel={`Pilih ${item.label}`}
      testID={`ui05-suggestion-${index}`}
    >
      <View style={[styles.iconTile, { backgroundColor: palette.bg }]}>
        <Ionicons name={iconName} size={22} color={palette.iconColor} />
      </View>

      <Text style={styles.suggestionLabel} numberOfLines={1}>
        {item.label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={UI_THEME.textMuted}
      />
    </Pressable>
  );
};

const SuggestionItemCard = React.memo(SuggestionItemCardComponent);
SuggestionItemCard.displayName = 'SuggestionItemCard';

export const SearchRecommendationView: React.FC<
  RootStackScreenProps<'SearchRecommendation'>
> = ({ navigation, route }) => {
  const initialQuery = route.params?.initialQuery ?? '';
  const {
    query,
    setQuery,
    clearQuery,
    suggestions,
    isLoadingCategories,
    trimmedQuery,
  } = useSearchRecommendationController(initialQuery);

  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const timerId = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => {
        clearTimeout(timerId);
      };
    }, [])
  );

  // C14 KategoriJasaUI.pressKategoriJasa
  const pressKategoriJasa = useCallback(
    (keyword: string) => {
      const cleanKeyword = keyword.trim();
      if (!cleanKeyword) {
        return;
      }
      navigation.navigate('SearchResult', { keyword: cleanKeyword });
    },
    [navigation]
  );

  const handleSubmitEditing = useCallback(() => {
    if (trimmedQuery.length > 0) {
      pressKategoriJasa(trimmedQuery);
    }
  }, [pressKategoriJasa, trimmedQuery]);

  const handleClearPress = useCallback(() => {
    clearQuery();
    inputRef.current?.focus();
  }, [clearQuery]);

  const directSearchHeader =
    trimmedQuery.length > 0 ? (
      <Pressable
        style={({ pressed }) => [
          styles.suggestionCard,
          styles.directSearchCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() => pressKategoriJasa(trimmedQuery)}
        accessibilityRole="button"
        accessibilityLabel={`Cari ${trimmedQuery}`}
        testID="ui05-direct-search"
      >
        <View
          style={[
            styles.iconTile,
            { backgroundColor: TILE_PALETTE[0].bg },
          ]}
        >
          <Ionicons name="search" size={20} color={UI_THEME.primary} />
        </View>

        <Text style={styles.suggestionLabel} numberOfLines={1}>
          {`Cari "${trimmedQuery}"`}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={UI_THEME.textMuted}
        />
      </Pressable>
    ) : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* UI-05-01: Tombol Kembali */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali, kembali ke layar sebelumnya"
          testID="ui05-back-button"
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={UI_THEME.textTitle}
          />
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>

        {/* UI-05-02 & UI-05-03: Search Field dengan Auto-Focus & Tombol Clear (×) */}
        <View
          style={[
            styles.searchField,
            isInputFocused && styles.searchFieldFocused,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={UI_THEME.primary}
            style={styles.searchIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Cari jasa, pekerjaan, atau kategori..."
            placeholderTextColor={UI_THEME.textMuted}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onSubmitEditing={handleSubmitEditing}
            accessibilityLabel="Kolom input rekomendasi pencarian"
            testID="ui05-search-input"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={handleClearPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Hapus teks pencarian"
              testID="ui05-clear-button"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={UI_THEME.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        {/* UI-05-04: Label Judul Daftar Saran */}
        <View style={styles.labelRow}>
          <Text style={styles.sectionLabel} testID="ui05-section-label">
            {trimmedQuery.length > 0
              ? `Rekomendasi untuk "${trimmedQuery}"`
              : 'Kategori Populer'}
          </Text>
          {isLoadingCategories ? (
            <ActivityIndicator size="small" color={UI_THEME.primary} />
          ) : null}
        </View>

        {/* UI-05-05: Daftar Item Rekomendasi Pencarian */}
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SuggestionItemCard
              item={item}
              index={index}
              onPress={pressKategoriJasa}
            />
          )}
          ListHeaderComponent={directSearchHeader}
          ListEmptyComponent={
            trimmedQuery.length > 0 ? (
              <View
                style={styles.emptyBox}
                testID="ui05-empty-suggestion"
              >
                <Text style={styles.emptyText}>
                  {`Tidak ada rekomendasi untuk "${trimmedQuery}". Tekan cari untuk melihat semua hasil.`}
                </Text>
              </View>
            ) : undefined
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI_THEME.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 14,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: UI_THEME.textTitle,
    marginLeft: 4,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 18,
  },
  searchFieldFocused: {
    borderColor: UI_THEME.primary,
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: UI_THEME.textTitle,
    paddingVertical: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  listContent: {
    paddingBottom: 28,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    marginBottom: 10,
    gap: 14,
  },
  directSearchCard: {
    borderColor: UI_THEME.primary,
  },
  cardPressed: {
    opacity: 0.82,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  emptyBox: {
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  emptyText: {
    fontSize: 13,
    color: UI_THEME.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
});

export default SearchRecommendationView;
