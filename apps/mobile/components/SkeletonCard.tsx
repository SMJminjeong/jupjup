import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { radius, spacing, useTheme } from '@/constants/theme';

interface Props {
  variant?: 'scrap' | 'job';
}

const SkeletonCard = ({ variant = 'scrap' }: Props) => {
  const colors = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const Bar = ({ w, h = 12, style }: { w: number | string; h?: number; style?: object }) => (
    <Animated.View
      style={[
        { width: w as number, height: h, backgroundColor: colors.bgSurface, borderRadius: 4, opacity },
        style,
      ]}
    />
  );

  if (variant === 'job') {
    return (
      <View style={[styles.card, styles.jobCard, { backgroundColor: colors.bgCard }]}>
        <View style={styles.rowBetween}>
          <Bar w={80} h={10} />
          <Bar w={40} h={10} />
        </View>
        <Bar w={'90%'} h={14} style={{ marginTop: 10 }} />
        <Bar w={'60%'} h={14} style={{ marginTop: 6 }} />
        <View style={styles.tagRow}>
          <Bar w={50} h={10} />
          <Bar w={60} h={10} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
      <View style={styles.rowBetween}>
        <Bar w={60} h={18} />
        <Bar w={100} h={10} />
      </View>
      <View style={styles.bodyRow}>
        <View style={{ flex: 1, gap: 8 }}>
          <Bar w={'95%'} h={14} />
          <Bar w={'70%'} h={14} />
          <Bar w={'85%'} h={12} style={{ marginTop: 6 }} />
        </View>
        <Bar w={80} h={80} style={{ borderRadius: 8 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  jobCard: { padding: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bodyRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
});

export default SkeletonCard;
