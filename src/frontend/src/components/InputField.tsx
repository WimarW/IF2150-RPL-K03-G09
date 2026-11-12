import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';

export type LeftIconType = 'mail' | 'lock' | 'person' | 'store' | 'pin';

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: LeftIconType;
  isPassword?: boolean;
  errorMessage?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  testID?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  isPassword = false,
  errorMessage,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  testID,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const renderLeftIcon = () => {
    switch (leftIcon) {
      case 'mail':
        return (
          <View style={styles.mailIconBox}>
            <Text style={styles.iconGlyph}>✉</Text>
          </View>
        );
      case 'lock':
        return (
          <View style={styles.lockIconWrap}>
            <View style={styles.lockShackle} />
            <View style={styles.lockBody} />
          </View>
        );
      case 'person':
        return (
          <View style={styles.personIconWrap}>
            <View style={styles.personHead} />
            <View style={styles.personShoulders} />
          </View>
        );
      case 'store':
        return (
          <View style={styles.storeIconWrap}>
            <View style={styles.storeRoof} />
            <View style={styles.storeBase} />
          </View>
        );
      case 'pin':
        return (
          <View style={styles.mailIconBox}>
            <Text style={styles.iconGlyph}>📌</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          Boolean(errorMessage) && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIconSlot}>{renderLeftIcon()}</View>}

        <TextInput
          testID={testID}
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* UI-01-05 / UI-02-07 / UI-03-07 / UI-14-08: Ikon mata untuk show/hide password */}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'
            }
          >
            <View style={styles.eyeOutline}>
              <View
                style={[
                  styles.eyePupil,
                  isPasswordVisible && styles.eyePupilActive,
                ]}
              />
              {!isPasswordVisible && <View style={styles.eyeSlash} />}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#13334C',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  inputContainerFocused: {
    borderColor: '#14967F',
    borderWidth: 1.5,
  },
  inputContainerError: {
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },
  inputContainerDisabled: {
    backgroundColor: '#F1F5F9',
  },
  leftIconSlot: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mailIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: 18,
    color: '#94A3B8',
  },
  lockIconWrap: {
    width: 18,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockShackle: {
    width: 10,
    height: 7,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1.8,
    borderBottomWidth: 0,
    borderColor: '#94A3B8',
  },
  lockBody: {
    width: 16,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: '#94A3B8',
  },
  personIconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personHead: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.8,
    borderColor: '#94A3B8',
    marginBottom: 2,
  },
  personShoulders: {
    width: 16,
    height: 7,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1.8,
    borderBottomWidth: 0,
    borderColor: '#94A3B8',
  },
  storeIconWrap: {
    width: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeRoof: {
    width: 18,
    height: 6,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 1.6,
    borderColor: '#94A3B8',
  },
  storeBase: {
    width: 16,
    height: 10,
    borderWidth: 1.6,
    borderTopWidth: 0,
    borderColor: '#94A3B8',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#13334C',
    fontWeight: '500',
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOutline: {
    width: 22,
    height: 14,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  eyePupilActive: {
    backgroundColor: '#14967F',
    borderColor: '#14967F',
  },
  eyeSlash: {
    position: 'absolute',
    width: 22,
    height: 1.6,
    backgroundColor: '#94A3B8',
    transform: [{ rotate: '-25deg' }],
    opacity: 0,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 4,
  },
});

export default InputField;
