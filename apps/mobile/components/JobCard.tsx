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
      <View style={styles.headerRow}>
        <View style={styles.companyRow}>
          <View style={[styles.logo, { backgroundColor: colors.bgSurface }]} />
          <Text style={[styles.company, { color: colors.textPrimary }]}>
            {scrap.source ?? '회사명'}
          </Text>
        </View>
        {scrap.deadlineAt && (
          <View style={[styles.ddayBadge, { borderColor: ddayColor }]}>
            <Text style={[styles.ddayText, { color: ddayColor }]}>
              {formatDDay(scrap.deadlineAt)}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.position, { color: colors.textPrimary }]} numberOfLines={2}>
        {scrap.title}
      </Text>

      {scrap.summary ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
          {scrap.summary}
        </Text>
      ) : null}

      {scrap.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {scrap.tags.slice(0, 4).map((t) => (
            <View
              key={t}
              style={[styles.tag, { backgroundColor: colors.bgSurface }]}
            >
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {t}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footerRow}>
        <TouchableOpacity onPress={() => onBookmark(scrap.id)} hitSlop={8}>
          <Text style={{ color: scrap.isBookmarked ? colors.point : colors.textTertiary }}>
            {scrap.isBookmarked ? '★ 저장됨' : '☆ 저장하기'}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: colors.point, fontWeight: '600' }}>원문 보기 →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 32, height: 32, borderRadius: 8 },
  company: { fontSize: 14, fontWeight: '600' },
  ddayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  ddayText: { fontSize: 12, fontWeight: '700' },
  position: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  meta: { fontSize: 13, marginBottom: spacing.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontSize: 12 },
  divider: { height: 1, marginVertical: spacing.md },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default JobCard;
