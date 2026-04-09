import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBadge from '@/components/CategoryBadge';
import { spacing, useTheme } from '@/constants/theme';
import { useScrapStore } from '@/stores/scrapStore';
import { calculateDDay, formatRelativeDate } from '@jupjup/utils';

/**
 * S-08 스크랩 상세 화면
 */
const ScrapDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const { scraps, toggleBookmark } = useScrapStore();
  const scrap = scraps.find((s) => s.id === id);

  if (!scrap) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
        <Text style={{ color: colors.textSecondary, padding: spacing.lg }}>
          스크랩을 찾을 수 없어요
        </Text>
      </SafeAreaView>
    );
  }

  const openOriginal = () => {
    WebBrowser.openBrowserAsync(scrap.url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <View style={styles.metaRow}>
          <CategoryBadge category={scrap.category} />
          <Text style={{ color: colors.textTertiary, fontSize: 13 }}>
            {scrap.source} · {formatRelativeDate(scrap.createdAt)}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>{scrap.title}</Text>

        <View style={[styles.thumb, { backgroundColor: colors.bgSurface }]} />

        {scrap.summary ? (
          <Text style={[styles.summary, { color: colors.textSecondary }]}>{scrap.summary}</Text>
        ) : null}

        {scrap.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {scrap.tags.map((t) => (
              <View key={t} style={[styles.tag, { backgroundColor: colors.bgSurface }]}>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>#{t}</Text>
              </View>
            ))}
          </View>
        )}

        {scrap.category === 'job_post' && scrap.deadlineAt && (
          <View style={[styles.jobBox, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textPrimary, marginBottom: 6 }}>
              마감일: {new Date(scrap.deadlineAt).toLocaleDateString('ko-KR')} (D-
              {calculateDDay(scrap.deadlineAt)})
            </Text>
            {scrap.tags.length > 0 && (
              <Text style={{ color: colors.textSecondary }}>
                기술스택: {scrap.tags.join(', ')}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.memoBox, { borderColor: colors.border }]}
          onPress={() => {}}
        >
          <Text style={{ color: colors.textTertiary }}>
            {scrap.memo ?? '+ 메모 추가'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.actionBar, { backgroundColor: colors.bgPrimary, borderTopColor: colors.border }]}>
        <TouchableOpacity onPress={() => toggleBookmark(scrap.id)} style={styles.bookmarkBtn}>
          <Text style={{ color: scrap.isBookmarked ? colors.point : colors.textSecondary }}>
            {scrap.isBookmarked ? '★ 저장됨' : '☆ 저장하기'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.point }]}
          onPress={openOriginal}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>원문 보기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.lg },
  thumb: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12, marginBottom: spacing.lg },
  summary: { fontSize: 15, lineHeight: 24 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.lg },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  jobBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  memoBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    minHeight: 48,
    justifyContent: 'center',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bookmarkBtn: { paddingVertical: 8 },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
});

export default ScrapDetailScreen;
