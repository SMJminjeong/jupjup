import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, useTheme } from '@/constants/theme';

type ToastType = 'success' | 'error' | 'info';
interface ToastMsg {
  id: number;
  text: string;
  type: ToastType;
}

interface ToastApi {
  show: (text: string, type?: ToastType) => void;
  success: (text: string) => void;
  error: (text: string) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('ToastProvider 없음');
  return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const counter = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((text: string, type: ToastType = 'info') => {
    if (timer.current) clearTimeout(timer.current);
    counter.current += 1;
    setToast({ id: counter.current, text, type });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const api: ToastApi = {
    show,
    success: (t) => show(t, 'success'),
    error: (t) => show(t, 'error'),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {toast && <ToastView key={toast.id} msg={toast} />}
    </ToastCtx.Provider>
  );
};

const ToastView = ({ msg }: { msg: ToastMsg }) => {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const translate = useRef(new Animated.Value(60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translate, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [translate, opacity]);

  const icon =
    msg.type === 'success' ? 'check-circle' : msg.type === 'error' ? 'alert-circle' : 'information';
  const iconColor =
    msg.type === 'success' ? colors.success : msg.type === 'error' ? colors.danger : colors.point;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          bottom: insets.bottom + 80,
          transform: [{ translateY: translate }],
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
        <Text style={[styles.text, { color: colors.textPrimary }]} numberOfLines={2}>
          {msg.text}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 9999 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    maxWidth: '86%',
  },
  text: { fontSize: 14, fontWeight: '500', flexShrink: 1 },
});
