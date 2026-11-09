import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CreateTicketScreen({ navigation }: any) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const issueOptions = ['Laporan Pembayaran', 'Kendala Aplikasi', 'Perilaku Pengguna', 'Lainnya'];

  const handleBackPress = () => {
    if (issueType || description || imageUri) {
      Alert.alert(
        "Konfirmasi",
        "Anda memiliki isian yang belum dikirim. Yakin ingin keluar?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Keluar", onPress: () => navigation.goBack(), style: "destructive" }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handlePickImage = () => {
    // Simulasi pemilihan gambar & validasi ukuran
    Alert.alert("Unggah Foto", "Pilih sumber foto", [
      { text: "Kamera", onPress: () => setImageUri('https://via.placeholder.com/150') },
      { text: "Galeri", onPress: () => setImageUri('https://via.placeholder.com/150') },
      { text: "Batal", style: "cancel" }
    ]);
  };

  const handleSubmit = () => {
    if (!issueType || !description) {
      Alert.alert("Error", "Mohon isi jenis permasalahan dan penjelasan.");
      return;
    }
    Alert.alert("Sukses", "Tiket berhasil dikirim! Mengalihkan ke halaman obrolan...", [
      { text: "OK", onPress: () => navigation.navigate('ChatList') } // Asumsi UI-07
    ]);
  };

  const showIssuePicker = () => {
    Alert.alert(
      "Pilih Jenis Permasalahan",
      "Pilih salah satu:",
      issueOptions.map(opt => ({
        text: opt,
        onPress: () => setIssueType(opt)
      }))
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#1A237E" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Buat Tiket Laporan</Text>
        <Text style={styles.subtitle}>Laporkan kendala yang kamu alami ke CS</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        {/* Dropdown Jenis Permasalahan */}
        <Text style={styles.label}>Jenis Permasalahan</Text>
        <TouchableOpacity style={styles.dropdown} onPress={showIssuePicker}>
          <Feather name="alert-triangle" size={18} color="#9E9E9E" style={styles.inputIcon} />
          <Text style={[styles.dropdownText, issueType ? styles.textBlack : null]}>
            {issueType || 'Pilih jenis permasalahan'}
          </Text>
          <Feather name="chevron-down" size={20} color="#9E9E9E" />
        </TouchableOpacity>

        {/* Text Area Penjelasan */}
        <Text style={styles.label}>Penjelasan</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder="Jelaskan detail permasalahan yang kamu alami secara kronologis..."
          placeholderTextColor="#9E9E9E"
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        {/* Unggah Foto */}
        <Text style={styles.label}>Unggah Foto / Bukti</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
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

      {/* Tombol Kirim */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Kirim Laporan</Text>
      </TouchableOpacity>
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
  previewContainer: { width: '100%', alignItems: 'center', position: 'relative' },
  imagePreview: { width: 150, height: 150, borderRadius: 10 },
  removeImageBtn: { position: 'absolute', top: 0, right: '25%', backgroundColor: 'red', borderRadius: 15, padding: 5 },
  privacyText: { fontSize: 12, color: '#9E9E9E', marginTop: 15, marginBottom: 30 },
  submitButton: { backgroundColor: '#1ABC9C', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});