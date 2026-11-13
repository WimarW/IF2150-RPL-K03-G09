import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from './Header';

export interface SelectOption {
  label: string;
  value: string;
  subtitle?: string;
}

export type InputFieldIconType = 'mail' | 'lock' | 'person' | 'store' | 'pin';

export interface InputFieldHandle {
  focus: () => void;
  open: () => void;
  openPicker: () => void;
}

export interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** Error message string (mendukung prop `error` maupun `errorMessage`) */
  error?: string | null;
  errorMessage?: string;
  helperText?: string;
  required?: boolean;
  /** Nama ikon Ionicons secara langsung */
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  /** Ikon semantik kiri untuk layar Auth & Profil */
  leftIcon?: InputFieldIconType;
  /** Mode password dengan tombol mata untuk show/hide (UI-01-05, UI-02-07, UI-03-07, UI-14-08) */
  isPassword?: boolean;
  prefix?: string;
  type?: 'text' | 'select';
  options?: SelectOption[];
  onSelectOption?: (value: string, option?: SelectOption) => void;
  showCounter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

function mapLeftIconToIonicon(
  leftIcon?: InputFieldIconType
): React.ComponentProps<typeof Ionicons>['name'] | undefined {
  switch (leftIcon) {
    case 'mail':
      return 'mail-outline';
    case 'lock':
      return 'lock-closed-outline';
    case 'person':
      return 'person-outline';
    case 'store':
      return 'storefront-outline';
    case 'pin':
      return 'location-outline';
    default:
      return undefined;
  }
}

export const InputField = forwardRef<InputFieldHandle, InputFieldProps>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      error,
      errorMessage,
      helperText,
      required = false,
      iconName,
      leftIcon,
      isPassword = false,
      prefix,
      type = 'text',
      options = [],
      onSelectOption,
      showCounter = false,
      maxLength,
      multiline = false,
      containerStyle,
      disabled = false,
      onBlur,
      onFocus,
      testID,
      ...restTextInputProps
    },
    ref
  ) => {
    const textInputRef = useRef<TextInput | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (type === 'select') {
          if (!disabled) {
            setIsPickerOpen(true);
          }
          return;
        }
        textInputRef.current?.focus();
      },
      open: () => {
        if (type === 'select' && !disabled) {
          setIsPickerOpen(true);
        }
      },
      openPicker: () => {
        if (type === 'select' && !disabled) {
          setIsPickerOpen(true);
        }
      },
    }));

    const effectiveError = error ?? errorMessage ?? null;
    const hasError = Boolean(effectiveError && effectiveError.trim().length > 0);
    const resolvedIconName = iconName ?? mapLeftIconToIonicon(leftIcon);
    const selectedOption = options.find((opt) => opt.value === value);
    const displaySelectLabel = selectedOption ? selectedOption.label : value;

    const borderColor = hasError
      ? UI_THEME.error
      : isFocused
      ? UI_THEME.primary
      : UI_THEME.border;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            {label}
            {required ? <Text style={styles.requiredMark}> *</Text> : null}
          </Text>

          {showCounter && typeof maxLength === 'number' ? (
            <Text style={styles.counter}>
              {value.length}/{maxLength}
            </Text>
          ) : null}
        </View>

        {type === 'select' ? (
          <>
            <Pressable
              onPress={() => {
                if (!disabled) {
                  setIsPickerOpen(true);
                }
              }}
              disabled={disabled}
              style={({ pressed }) => [
                styles.inputWrapper,
                { borderColor },
                disabled && styles.disabledWrapper,
                pressed && !disabled && styles.pressedWrapper,
              ]}
              accessibilityRole="button"
              accessibilityLabel={label}
              testID={testID}
            >
              {resolvedIconName ? (
                <Ionicons
                  name={resolvedIconName}
                  size={18}
                  color={UI_THEME.textMuted}
                  style={styles.leadingIcon}
                />
              ) : null}

              <Text
                style={[
                  styles.selectText,
                  !displaySelectLabel && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {displaySelectLabel || placeholder || 'Pilih opsi'}
              </Text>

              <Ionicons
                name="chevron-down"
                size={18}
                color={UI_THEME.textMuted}
              />
            </Pressable>

            <Modal
              visible={isPickerOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setIsPickerOpen(false)}
            >
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setIsPickerOpen(false)}
              >
                <Pressable
                  style={styles.modalSheet}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{label}</Text>
                    <Pressable
                      onPress={() => setIsPickerOpen(false)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Tutup pilihan"
                    >
                      <Ionicons
                        name="close"
                        size={22}
                        color={UI_THEME.textTitle}
                      />
                    </Pressable>
                  </View>

                  <FlatList
                    data={options}
                    keyExtractor={(item) => `${item.value}-${item.label}`}
                    style={styles.optionsList}
                    renderItem={({ item }) => {
                      const isSelected =
                        item.value === value || item.label === value;
                      return (
                        <Pressable
                          onPress={() => {
                            onSelectOption?.(item.value, item);
                            onChangeText?.(item.value);
                            setIsPickerOpen(false);
                          }}
                          style={({ pressed }) => [
                            styles.optionItem,
                            isSelected && styles.optionItemSelected,
                            pressed && styles.optionItemPressed,
                          ]}
                          testID={
                            testID ? `${testID}-option-${item.value}` : undefined
                          }
                        >
                          <View style={styles.optionTextContainer}>
                            <Text
                              style={[
                                styles.optionLabel,
                                isSelected && styles.optionLabelSelected,
                              ]}
                            >
                              {item.label}
                            </Text>
                            {item.subtitle ? (
                              <Text style={styles.optionSubtitle}>
                                {item.subtitle}
                              </Text>
                            ) : null}
                          </View>

                          {isSelected ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color={UI_THEME.primary}
                            />
                          ) : null}
                        </Pressable>
                      );
                    }}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          </>
        ) : (
          <View
            style={[
              styles.inputWrapper,
              multiline && styles.multilineWrapper,
              { borderColor },
              hasError && styles.inputWrapperError,
              disabled && styles.disabledWrapper,
            ]}
          >
            {resolvedIconName ? (
              <Ionicons
                name={resolvedIconName}
                size={18}
                color={
                  hasError
                    ? UI_THEME.error
                    : isFocused
                    ? UI_THEME.primary
                    : UI_THEME.textMuted
                }
                style={[
                  styles.leadingIcon,
                  multiline && styles.multilineLeadingIcon,
                ]}
              />
            ) : null}

            {prefix ? <Text style={styles.prefixText}>{prefix}</Text> : null}

            <TextInput
              ref={textInputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#9BAEB5"
              editable={!disabled}
              multiline={multiline}
              maxLength={maxLength}
              secureTextEntry={isPassword && !isPasswordVisible}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              style={[styles.textInput, multiline && styles.multilineTextInput]}
              testID={testID}
              {...restTextInputProps}
            />

            {isPassword ? (
              <TouchableOpacity
                testID={testID ? `${testID}-toggle-visibility` : undefined}
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  isPasswordVisible
                    ? 'Sembunyikan password'
                    : 'Tampilkan password'
                }
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={isPasswordVisible ? UI_THEME.primary : UI_THEME.textMuted}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {hasError ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={UI_THEME.error} />
            <Text
              style={styles.errorText}
              testID={testID ? `${testID}-error` : undefined}
            >
              {effectiveError}
            </Text>
          </View>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

InputField.displayName = 'InputField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  requiredMark: {
    color: UI_THEME.error,
  },
  counter: {
    fontSize: 12,
    color: UI_THEME.textMuted,
  },
  inputWrapper: {
    minHeight: 52,
    backgroundColor: UI_THEME.surface,
    borderWidth: 1.5,
    borderColor: UI_THEME.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperError: {
    backgroundColor: '#FFFDFD',
  },
  multilineWrapper: {
    minHeight: 112,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  disabledWrapper: {
    backgroundColor: '#EEF3F2',
    opacity: 0.75,
  },
  pressedWrapper: {
    opacity: 0.85,
  },
  leadingIcon: {
    marginRight: 10,
  },
  multilineLeadingIcon: {
    marginTop: 3,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: UI_THEME.textBody,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: UI_THEME.textBody,
    paddingVertical: 10,
  },
  multilineTextInput: {
    minHeight: 84,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  eyeButton: {
    paddingLeft: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: UI_THEME.textBody,
    paddingVertical: 12,
  },
  placeholderText: {
    color: '#9BAEB5',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    marginLeft: 5,
    fontSize: 12.5,
    color: UI_THEME.error,
    fontWeight: '600',
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: UI_THEME.textMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 29, 35, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: UI_THEME.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: UI_THEME.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  optionsList: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionItemSelected: {
    backgroundColor: '#E8F5F3',
  },
  optionItemPressed: {
    opacity: 0.75,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: UI_THEME.textBody,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: UI_THEME.primary,
    fontWeight: '700',
  },
  optionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: UI_THEME.textMuted,
  },
});

export default InputField;
