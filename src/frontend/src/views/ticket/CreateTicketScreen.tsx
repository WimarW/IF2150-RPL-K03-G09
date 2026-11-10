import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../services/ticketService';

const MAX_BYTES = 5 * 1024 * 1024;
const issueOptions = ['Laporan Pembayaran', 'Kendala Aplikasi', 'Perilaku Pengguna', 'Lainnya'];

export default function CreateTicketScreen({ navigation }: any) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<{ uri: string; type: string } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dirty = !!(issueType || description.trim() || image);

  const handleBackPress = () => {
    if (!dirty) return navigation.goBack();
    Alert.alert('Konfirmasi', 'Anda memiliki isian yang belum dikirim. Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const handleAsset = (res: ImagePicker.ImagePickerResult) => {
    if (res.canceled) return;
    const a = res.assets[0];
    const mime = a.mimeType ?? (a.uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
    if (mime !== 'image/jpeg' && mime !== 'image/png') return Alert.alert('Format tidak sesuai', 'Foto harus berformat JPG atau PNG.');
    if (a.fileSize && a.fileSize > MAX_BYTES) return Alert.alert('Ukuran terlalu besar', 'Ukuran foto maksimal 5MB.');
    setImage({ uri: a.uri, type: mime });
  };

  const pickFrom = async (source: 'camera' | 'gallery') => {
    const perm = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Izin diperlukan', 'Izinkan akses untuk mengunggah foto.');
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
    handleAsset(source === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts));
  };

  const handlePickImage = () =>
    Alert.alert('Unggah Foto', 'Pilih sumber foto', [
      { text: 'Kamera', onPress: () => pickFrom('camera') },
      { text: 'Galeri', onPress: () => pickFrom('gallery') },
      { text: 'Batal', style: 'cancel' },
    ]);

  const canSubmit = !!issueType && !!description.trim() && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return Alert.alert('Error', 'Mohon isi jenis permasalahan dan penjelasan.');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('jenisTiket', issueType);
      form.append('keteranganTiket', description.trim());
      if (image) form.append('bukti', { uri: image.uri, name: image.type === 'image/png' ? 'bukti.png' : 'bukti.jpg', type: image.type } as any);
      const { tiket } = await api('/tickets', { method: 'POST', form });
      Alert.alert('Sukses', 'Tiket berhasil dikirim! Mengalihkan ke ruang obrolan tiket...', [
        { text: 'OK', onPress: () => navigation.replace('TicketDetail', { ticketId: tiket.id }) },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal mengirim tiket', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#1A237E" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Buat Tiket Laporan</Text>
        <Text style={styles.subtitle}>Laporkan kendala yang kamu alami ke CS</Text>
      </View>

      <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Jenis Permasalahan</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setPickerOpen(true)}>
          <Feather name="alert-triangle" size={18} color="#9E9E9E" style={styles.inputIcon} />
          <Text style={[styles.dropdownText, issueType ? styles.textBlack : null]}>{issueType || 'Pilih jenis permasalahan'}</Text>
          <Feather name="chevron-down" size={20} color="#9E9E9E" />
        </TouchableOpacity>

        <Text style={styles.label}>Penjelasan</Text>
        <TextInput
          style={styles.textArea} multiline numberOfLines={6} maxLength={1000}
          placeholder="Jelaskan detail permasalahan yang kamu alami secara kronologis..."
          placeholderTextColor="#9E9E9E" value={description} onChangeText={setDescription} textAlignVertical="top"
        />

        <Text style={styles.label}>Unggah Foto / Bukti (opsional)</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage} activeOpacity={image ? 1 : 0.7}>
          {image ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                <Feather name="x" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <MaterialCommunityIcons name="camera-outline" size={40} color="#9E9E9E" />
              <Text style={styles.uploadText}>Ketuk untuk mengunggah foto</Text>
              <Text style={styles.uploadSubtext}>Maksimal 5MB (JPG, PNG)</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.privacyText}>Data laporanmu akan dijaga kerahasiaannya.</Text>
      </ScrollView>

      <TouchableOpacity style={[styles.submitButton, !canSubmit && styles.submitDisabled]} onPress={handleSubmit} disabled={!canSubmit}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Kirim Laporan</Text>}
      </TouchableOpacity>

      {/* Picker jenis masalah (Alert maks 3 tombol di Android, jadi pakai Modal) */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setPickerOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Pilih Jenis Permasalahan</Text>
            {issueOptions.map((opt) => (
              <TouchableOpacity key={opt} style={styles.sheetItem} onPress={() => { setIssueType(opt); setPickerOpen(false); }}>
                <Text style={[styles.sheetText, opt === issueType && { color: '#1ABC9C', fontWeight: 'bold' }]}>{opt}</Text>
                {opt === issueType && <Feather name="check" size={18} color="#1ABC9C" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 50 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backText: { color: '#1A237E', fontSize: 16, fontWeight: '600', marginLeft: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A237E' },
  subtitle: { fontSize: 14, color: '#78909C', marginTop: 5 },
  formContainer: { paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A237E', marginBottom: 8, marginTop: 15 },
  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  inputIcon: { marginRight: 10 },
  dropdownText: { flex: 1, color: '#9E9E9E', fontSize: 14 },
  textBlack: { color: '#333' },
  textArea: { backgroundColor: 'white', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 14, color: '#333', minHeight: 120 },
  uploadBox: { backgroundColor: 'white', borderRadius: 10, padding: 30, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', alignItems: 'center', marginTop: 5, justifyContent: 'center' },
  uploadText: { marginTop: 10, fontSize: 14, color: '#1A237E', fontWeight: '600' },
  uploadSubtext: { fontSize: 12, color: '#9E9E9E', marginTop: 5 },
  previewContainer: { width: 150, height: 150 },
  imagePreview: { width: 150, height: 150, borderRadius: 10 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: 'red', borderRadius: 15, padding: 5 },
  privacyText: { fontSize: 12, color: '#9E9E9E', marginTop: 15, marginBottom: 30 },
  submitButton: { backgroundColor: '#1ABC9C', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  submitDisabled: { opacity: 0.5 },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 30 },
  sheetTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E', marginBottom: 10 },
  sheetItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  sheetText: { fontSize: 15, color: '#333' },
});
