import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Scrap } from '@jupjup/types';
import { formatRelativeDate } from '@jupjup/utils';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { radius, spacing, useTheme } from '@/constants/theme';
import CategoryBadge from './CategoryBadge';

interface ScrapCardProps {
  scrap: Scrap;
  onPress: () => void;
  onBookmark: (id: string) => void;
}

const ScrapCard = ({ scrap, onPress, onBookmark }: ScrapCardProps) => {
  const colors = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.bgCard }]}
    >
      <View style={styles.metaRow}>
        <CategoryBadge category={scrap.category} />
        <Text style={[styles.metaText, { color: colors.textTertiary }]}>
          {scrap.source ?? ''} · {formatRelativeDate(scrap.createdAt)}
        </Text>
      </View>

      <View style={styles.bodyRow}>
        <View style={styles.bodyText}>
          <Text
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={2}
          >
            {scrap.title}
          </Text>
          {scrap.summary ? (
            <Text
              style={[styles.summary, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {scrap.summary}
            </Text>
          ) : null}
        </View>
        {scrap.thumbnail ? (
          <Image source={{ uri: scrap.thumbnail }} style={styles.thumb} />
        ) : (
          <View
            style={[
              styles.thumb,
              { backgroundColor: colors.category[scrap.category] + '33' },
            ]}
          />
        )}
      </View>

      <View style={styles.footerRow}>
        <View style={styles.tagsRow}>
          {!scrap.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.point }]} />
          )}
          {scrap.tags.slice(0, 2).map((t) => (
            <View
              key={t}
              style={[styles.tag, { backgroundColor: colors.bgSurface }]}
            >
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                #{t}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => onBookmark(scrap.id)}
          hitSlop={8}
          accessibilityLabel={scrap.isBookmarked ? '북마크 해제' : '북마크'}
        >
          <MaterialCommunityIcons
            name={scrap.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={scrap.isBookmarked ? colors.point : colors.textTertiary}
          />
        </TouchableOpacity>
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaText: { fontSize: 13 },
  bodyRow: { flexDirection: 'row', gap: spacing.md },
  bodyText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  summary: { fontSize: 14, lineHeight: 20 },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unreadDot: { width: 6, height: 6, borderRadius: 3 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontSize: 12 },
});

export default ScrapCard;
