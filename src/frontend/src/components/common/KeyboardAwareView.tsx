import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardAwareViewProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  /**
   * Set false bila layar sudah dibungkus SafeAreaView dengan edge 'bottom',
   * supaya inset bar navigasi tidak dihitung dua kali.
   */
  includeBottomInset?: boolean;
  /**
   * Set true bila komponen dirender di dalam <Modal> RN. Di Android jendela Modal sudah
   * di-resize sendiri oleh sistem saat keyboard muncul, sehingga padding manual akan
   * menggeser layout dua kali (konten terdorong ke atas).
   */
  insideModal?: boolean;
}

/**
 * Pengganti KeyboardAvoidingView yang juga berfungsi di Android.
 * Android (edge-to-edge, wajib sejak Expo SDK 58 / RN 0.88) tidak lagi me-resize layar saat
 * keyboard muncul, sehingga KeyboardAvoidingView dengan behavior undefined tidak berbuat apa-apa
 * dan input tertutup keyboard. Di Android komponen ini memberi paddingBottom setinggi keyboard
 * (pola yang sama dengan TicketDetailScreen); di iOS tetap memakai KeyboardAvoidingView 'padding'.
 */
export const KeyboardAwareView: React.FC<KeyboardAwareViewProps> = ({
  style,
  children,
  includeBottomInset = true,
  insideModal = false,
}) => {
  const insets = useSafeAreaInsets();
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android' || insideModal) return;
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKbHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKbHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [insideModal]);

  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView style={style} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    );
  }

  // Di Android tinggi keyboard dari RN sudah dikurangi tinggi bar navigasi, padahal keyboard
  // menutupi area itu juga; tambahkan inset bawah bila belum ditangani SafeAreaView induk.
  const paddingBottom = kbHeight > 0 ? kbHeight + (includeBottomInset ? insets.bottom : 0) : 0;

  return <View style={[style, paddingBottom > 0 && { paddingBottom }]}>{children}</View>;
};

export default KeyboardAwareView;
