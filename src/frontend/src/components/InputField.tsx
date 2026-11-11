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
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from './Header';

export interface SelectOption {
  label: string;
  value: string;
}

export interface InputFieldHandle {
  focus: () => void;
  open: () => void;
}

export interface InputFieldProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  type?: 'text' | 'select';
  value: string | null;
  onChangeText?: (text: string) => void;
  options?: ReadonlyArray<SelectOption>;
  onSelectOption?: (value: string) => void;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  prefix?: string;
  error?: string;
  helperText?: string;
  showCounter?: boolean;
  maxLength?: number;
  containerStyle?: object;
  testID?: string;
}

export const InputField = forwardRef<InputFieldHandle, InputFieldProps>(
  (
    {
      label,
      type = 'text',
      value,
      onChangeText,
      options = [],
      onSelectOption,
      placeholder,
      iconName,
      prefix,
      error,
      helperText,
      showCounter = false,
      maxLength,
      multiline = false,
      onBlur,
      onFocus,
      containerStyle,
      testID,
      ...restTextInputProps
    },
    ref
  ) => {
    const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const hasError = Boolean(error && error.trim().length > 0);
    const textValue = value ?? '';

    const openSelectModal = () => {
      if (type === 'select') {
        setIsModalOpen(true);
      }
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (type === 'select') {
          setIsModalOpen(true);
        } else {
          inputRef.current?.focus();
        }
      },
      open: () => {
        if (type === 'select') {
          setIsModalOpen(true);
        } else {
          inputRef.current?.focus();
        }
      },
    }));

    const selectedOptionLabel =
      type === 'select'
        ? options.find((opt) => opt.value === value)?.label ?? value
        : null;

    const iconColor = hasError
      ? UI_THEME.error
      : isFocused || isModalOpen
      ? UI_THEME.primary
      : UI_THEME.textMuted;

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        {type === 'select' ? (
          <>
            <Pressable
              style={[
                styles.fieldContainer,
                isModalOpen && styles.fieldFocused,
                hasError && styles.fieldError,
              ]}
              onPress={openSelectModal}
              accessibilityRole="button"
              accessibilityLabel={label ?? placeholder ?? 'Pilihan dropdown'}
              accessibilityHint={hasError ? error : undefined}
              accessibilityState={{ expanded: isModalOpen }}
              testID={testID}
            >
              {iconName ? (
                <Ionicons
                  name={iconName}
                  size={20}
                  color={iconColor}
                  style={styles.leftIcon}
                />
              ) : null}

              <Text
                style={[
                  styles.selectText,
                  !selectedOptionLabel && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {selectedOptionLabel || placeholder || 'Pilih opsi'}
              </Text>

              <Ionicons
                name={isModalOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={hasError ? UI_THEME.error : UI_THEME.textMuted}
              />
            </Pressable>

            <Modal
              visible={isModalOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setIsModalOpen(false)}
            >
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setIsModalOpen(false)}
              >
                <Pressable
                  style={styles.modalSheet}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.modalHandle} />
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {label || placeholder || 'Pilih Kategori'}
                    </Text>
                    <Pressable
                      onPress={() => setIsModalOpen(false)}
                      hitSlop={8}
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
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => {
                      const isSelected = item.value === value;
                      return (
                        <Pressable
                          style={({ pressed }) => [
                            styles.optionRow,
                            isSelected && styles.optionRowSelected,
                            pressed && styles.optionRowPressed,
                          ]}
                          onPress={() => {
                            onSelectOption?.(item.value);
                            onChangeText?.(item.value);
                            setIsModalOpen(false);
                          }}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                          testID={
                            testID ? `${testID}-opt-${item.value}` : undefined
                          }
                        >
                          <Text
                            style={[
                              styles.optionLabel,
                              isSelected && styles.optionLabelSelected,
                            ]}
                          >
                            {item.label}
                          </Text>
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
              styles.fieldContainer,
              multiline && styles.fieldMultiline,
              isFocused && styles.fieldFocused,
              hasError && styles.fieldError,
            ]}
          >
            {iconName ? (
              <Ionicons
                name={iconName}
                size={20}
                color={iconColor}
                style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
              />
            ) : null}

            {prefix ? (
              <Text
                style={[styles.prefixText, hasError && styles.prefixTextError]}
              >
                {prefix}
              </Text>
            ) : null}

            <TextInput
              ref={inputRef}
              style={[
                styles.textInput,
                multiline && styles.textInputMultiline,
              ]}
              value={textValue}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={UI_THEME.textMuted}
              multiline={multiline}
              maxLength={maxLength}
              textAlignVertical={multiline ? 'top' : 'center'}
              accessibilityLabel={label ?? placeholder}
              accessibilityHint={hasError ? error : helperText}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              testID={testID}
              {...restTextInputProps}
            />
          </View>
        )}

        {hasError || helperText || (showCounter && maxLength) ? (
          <View style={styles.footerRow}>
            <View style={styles.footerMessageWrap}>
              {hasError ? (
                <View style={styles.errorRow}>
                  <Ionicons
                    name="alert-circle"
                    size={14}
                    color={UI_THEME.error}
                    style={styles.errorIcon}
                  />
                  <Text
                    style={styles.errorText}
                    testID={testID ? `${testID}-error` : undefined}
                  >
                    {error}
                  </Text>
                </View>
              ) : helperText ? (
                <Text style={styles.helperText}>{helperText}</Text>
              ) : null}
            </View>

            {showCounter && maxLength ? (
              <Text style={styles.counterText}>
                {textValue.length}/{maxLength}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }
);

InputField.displayName = 'InputField';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 8,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    backgroundColor: UI_THEME.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingHorizontal: 14,
  },
  fieldMultiline: {
    minHeight: 112,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  fieldFocused: {
    borderColor: UI_THEME.primary,
    borderWidth: 1.5,
  },
  fieldError: {
    borderColor: UI_THEME.error,
    borderWidth: 1.5,
    backgroundColor: UI_THEME.errorBg,
  },
  leftIcon: {
    marginRight: 10,
  },
  leftIconMultiline: {
    marginTop: 2,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: UI_THEME.textTitle,
    marginRight: 6,
  },
  prefixTextError: {
    color: UI_THEME.error,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: UI_THEME.textBody,
    paddingVertical: 12,
  },
  textInputMultiline: {
    minHeight: 88,
    paddingVertical: 0,
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: UI_THEME.textBody,
    paddingVertical: 14,
  },
  placeholderText: {
    color: UI_THEME.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  footerMessageWrap: {
    flex: 1,
    paddingRight: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: UI_THEME.error,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: UI_THEME.textMuted,
  },
  counterText: {
    fontSize: 12,
    color: UI_THEME.textMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: UI_THEME.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: UI_THEME.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionRowSelected: {
    backgroundColor: '#E8F7F4',
  },
  optionRowPressed: {
    opacity: 0.75,
  },
  optionLabel: {
    fontSize: 15,
    color: UI_THEME.textBody,
  },
  optionLabelSelected: {
    fontWeight: '700',
    color: UI_THEME.primary,
  },
});

export default InputField;
