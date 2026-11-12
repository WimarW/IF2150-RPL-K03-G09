import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useAuthController } from '../../controllers/useAuthController';
import {
  PendingProviderRegistration,
  ScreenName,
} from '../../navigation/types';

export interface ServiceRegistrationViewProps {
  pendingProvider: PendingProviderRegistration | null;
  onBack: () => void;
  onNavigate: (screen: ScreenName) => void;
}

const SERVICE_CATEGORIES = [
  { id: 'kat-servis', label: 'Servis' },
  { id: 'kat-kebersihan', label: 'Kebersihan' },
  { id: 'kat-jahit', label: 'Jahit' },
  { id: 'kat-renovasi', label: 'Renovasi' },
  { id: 'kat-desain', label: 'Desain' },
  { id: 'kat-lainnya', label: 'Lainnya' },
];

/**
 * UI-16: Layar Daftar Penyedia Jasa (Alur Verifikasi / Pendaftaran Jasa dari UI-03)
 * Realisasi Kelas DPPL: C05 PemberiJasaUI, C14 KategoriJasaUI
 */
export const ServiceRegistrationView: React.FC<
  ServiceRegistrationViewProps
> = ({ pendingProvider, onBack, onNavigate }) => {
  const { user, isLoading, authError, clearAuthError, registerPemberiJasa } =
    useAuthController();

  const [namaToko, setNamaToko] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isSubmitEnabled =
    namaToko.trim().length > 0 && selectedCategory !== null;

  const handleSubmitRegistration = async () => {
    setLocalError(null);
    if (!isSubmitEnabled || !selectedCategory) {
      setLocalError('Nama toko dan jenis jasa wajib diisi.');
      return;
    }

    const baseAccount = pendingProvider ?? {
      namaPengguna: user?.namaPengguna || namaToko.trim(),
      email: user?.email || `provider_${Date.now()}@cariuang.id`,
      password: 'password123',
    };

    const result = await registerPemberiJasa({
      namaPengguna: baseAccount.namaPengguna,
      email: baseAccount.email,
      password: baseAccount.password,
      namaToko: namaToko.trim(),
      idKategoriJasa: selectedCategory.id,
      jenisJasa: selectedCategory.label,
    });

    if (result.success) {
      onNavigate(result.targetScreen || 'ProviderHistory');
    } else if (result.message) {
      setLocalError(result.message);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          {/* UI-16-01 & UI-16-02: Tombol "‹ Kembali", Judul & Subjudul */}
          <Header
            variant="back"
            title="Daftar Penyedia Jasa"
            subtitle="Lengkapi data untuk mulai menerima pesanan"
            onBackPress={onBack}
          />

          {localError || authError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                {localError || authError}
              </Text>
            </View>
          ) : null}

          {/* UI-16-03 & UI-16-04: Input Nama Toko / Penyedia Jasa */}
          <InputField
            testID="service-reg-store-name-input"
            label="Nama Toko / Penyedia Jasa"
            value={namaToko}
            onChangeText={(text) => {
              setLocalError(null);
              if (authError) clearAuthError();
              setNamaToko(text);
            }}
            placeholder="Masukkan nama toko atau usahamu"
            leftIcon="store"
            autoCapitalize="words"
          />

          {/* UI-16-05 & UI-16-06: Dropdown Jenis Jasa */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Jenis Jasa</Text>
            <TouchableOpacity
              testID="service-reg-category-dropdown"
              style={styles.dropdownTrigger}
              onPress={() => setIsDropdownOpen((prev) => !prev)}
              activeOpacity={0.75}
            >
              <View style={styles.dropdownLeftRow}>
                <Text style={styles.pinIcon}>📌</Text>
                <Text
                  style={[
                    styles.dropdownValueText,
                    !selectedCategory && styles.dropdownPlaceholderText,
                  ]}
                >
                  {selectedCategory
                    ? selectedCategory.label
                    : 'Pilih jenis jasa yang ditawarkan'}
                </Text>
              </View>
              <Text style={styles.dropdownChevron}>
                {isDropdownOpen ? '▴' : '▾'}
              </Text>
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownMenuCard}>
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      testID={`service-category-option-${cat.id}`}
                      style={[
                        styles.dropdownOptionItem,
                        isSelected && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                        setLocalError(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          isSelected && styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* UI-16-07: Button "Ajukan Pendaftaran" */}
        <View style={styles.bottomSection}>
          <Button
            testID="service-reg-submit-button"
            title="Ajukan Pendaftaran"
            onPress={handleSubmitRegistration}
            disabled={!isSubmitEnabled}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 38,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownWrapper: {
    marginTop: 4,
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#13334C',
    marginBottom: 8,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  dropdownLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  dropdownValueText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#13334C',
  },
  dropdownPlaceholderText: {
    color: '#94A3B8',
  },
  dropdownChevron: {
    fontSize: 18,
    color: '#64748B',
    marginLeft: 8,
  },
  dropdownMenuCard: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  dropdownOptionItem: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E6F7F4',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#13334C',
    fontWeight: '500',
  },
  dropdownOptionTextSelected: {
    color: '#0F8A75',
    fontWeight: '700',
  },
  bottomSection: {
    marginTop: 32,
  },
});

export default ServiceRegistrationView;
