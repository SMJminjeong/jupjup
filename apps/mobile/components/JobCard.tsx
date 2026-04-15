import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Scrap } from '@jupjup/types';
import { calculateDDay, formatDDay } from '@jupjup/utils';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { radius, spacing, useTheme } from '@/constants/theme';

interface JobCardProps {
  scrap: Scrap;
  onPress: () => void;
  onBookmark: (id: string) => void;
}

const JobCard = ({ scrap, onPress, onBookmark }: JobCardProps) => {
  const colors = useTheme();
  const dday = scrap.deadlineAt ? calculateDDay(scrap.deadlineAt) : null;

  const ddayColor = (() => {
    if (dday === null) return colors.textTertiary;
    if (dday < 0) return colors.textTertiary;
    if (dday <= 2) return colors.danger;
    if (dday <= 6) return colors.warning;
    return colors.textSecondary;
  })();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.bgCard }]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.company, { color: colors.textSecondary }]} numberOfLines={1}>
          {scrap.source ?? '회사명'}
        </Text>
        <View style={styles.topRight}>
          {scrap.deadlineAt && (
            <Text style={[styles.dday, { color: ddayColor }]}>{formatDDay(scrap.deadlineAt)}</Text>
          )}
          <TouchableOpacity onPress={() => onBookmark(scrap.id)} hitSlop={8}>
            <MaterialCommunityIcons
              name={scrap.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={scrap.isBookmarked ? colors.point : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.position, { color: colors.textPrimary }]} numberOfLines={2}>
        {scrap.title}
      </Text>

      {scrap.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {scrap.tags.slice(0, 3).map((t) => (
            <Text key={t} style={[styles.tagText, { color: colors.textTertiary }]}>
              #{t}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  company: { fontSize: 12, fontWeight: '500', flex: 1, marginRight: 8 },
  dday: { fontSize: 12, fontWeight: '700' },
  position: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  tagText: { fontSize: 11 },
});

export default JobCard;
