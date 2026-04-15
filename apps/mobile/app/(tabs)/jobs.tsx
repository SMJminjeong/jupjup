import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard from '@/components/JobCard';
import ScrapCard from '@/components/ScrapCard';
import SkeletonCard from '@/components/SkeletonCard';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';
import { useScrapStore } from '@/stores/scrapStore';

type Segment = 'news' | 'post';
type PostFilter = '전체' | '프론트엔드' | '백엔드' | '모바일' | 'AI/ML' | '신입';

const FILTER_PATTERNS: Record<Exclude<PostFilter, '전체'>, RegExp> = {
  '프론트엔드': /프론트|front|react|vue|next|웹개발/i,
  '백엔드': /백엔드|back\b|server|node|java|spring|python|go\b|kotlin|\bapi\b/i,
  '모바일': /모바일|android|ios|flutter|react\s*native|kotlin|swift/i,
  'AI/ML': /\bAI\b|\bML\b|머신러닝|인공지능|딥러닝|data\s*scien|데이터/i,
  '신입': /신입|junior|주니어|entry/i,
};

const POST_FILTERS: PostFilter[] = ['전체', '프론트엔드', '백엔드', '모바일', 'AI/ML', '신입'];

/**
 * S-06 채용 화면 — 뉴스 / 공고 세그먼트
 */
const JobsScreen = () => {
  const colors = useTheme();
  const scraps = useScrapStore((s) => s.scraps);
  const { loading, refreshing, fetchScraps, refresh, loadMore, toggleBookmark } = useScraps();
  const [seg, setSeg] = useState<Segment>('news');
  const [postFilter, setPostFilter] = useState<PostFilter>('전체');

  const category = seg === 'news' ? 'job_news' as const : 'job_post' as const;

  useEffect(() => {
    fetchScraps({ category });
  }, [category, fetchScraps]);

  const news = useMemo(() => scraps.filter((s) => s.category === 'job_news'), [scraps]);
  const posts = useMemo(() => {
    let list = scraps.filter((s) => s.category === 'job_post');
    if (postFilter !== '전체') {
      const pattern = FILTER_PATTERNS[postFilter];
      list = list.filter(
        (s) =>
          pattern.test(s.title) || pattern.test(s.summary ?? '') || s.tags.some((t) => pattern.test(t)),
      );
    }
    // 마감 임박 우선 (deadline 있는 것 먼저, 가까운 순)
    return [...list].sort((a, b) => {
      const ad = a.deadlineAt ? new Date(a.deadlineAt).getTime() : Infinity;
      const bd = b.deadlineAt ? new Date(b.deadlineAt).getTime() : Infinity;
      return ad - bd;
    });
  }, [scraps, postFilter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>채용</Text>
      </View>

      <View style={[styles.segment, { backgroundColor: colors.bgSurface }]}>
        {(['news', 'post'] as Segment[]).map((key) => {
          const active = seg === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.segmentItem,
                active && { backgroundColor: colors.bgPrimary },
              ]}
              onPress={() => setSeg(key)}
            >
              <Text
                style={{
                  color: active ? colors.textPrimary : colors.textSecondary,
                  fontWeight: active ? '700' : '500',
                }}
              >
                {key === 'news' ? '채용 뉴스' : '채용 공고'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {seg === 'news' ? (
        <FlatList
          data={news}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshing={refreshing}
          onRefresh={() => refresh({ category: 'job_news' })}
          onEndReached={() => loadMore({ category: 'job_news' })}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            loading ? (
              <View>
                {[0, 1, 2].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <ScrapCard
              scrap={item}
              onPress={() => router.push(`/scrap/${item.id}`)}
              onBookmark={toggleBookmark}
            />
          )}
        />
      ) : (
        <>
          <FlatList
            horizontal
            data={POST_FILTERS}
            keyExtractor={(it) => it}
            showsHorizontalScrollIndicator={false}
            style={styles.subTabsWrap}
            contentContainerStyle={styles.subTabs}
            renderItem={({ item }) => {
              const active = postFilter === item;
              return (
                <TouchableOpacity
                  onPress={() => setPostFilter(item)}
                  style={[
                    styles.filterChip,
                    { backgroundColor: active ? colors.point : colors.bgSurface },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? '#FFFFFF' : colors.textSecondary,
                      fontSize: 13,
                      fontWeight: active ? '600' : '500',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <FlatList
            data={posts}
            keyExtractor={(item, i) => `${item.id}-${i}`}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            refreshing={refreshing}
            onRefresh={() => refresh({ category: 'job_post' })}
            onEndReached={() => loadMore({ category: 'job_post' })}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              loading ? (
                <View>
                  {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={{ marginBottom: spacing.sm }}>
                      <SkeletonCard variant="job" />
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
                  해당 조건의 공고가 없어요
                </Text>
              )
            }
            renderItem={({ item }) => (
              <JobCard
                scrap={item}
                onPress={() => router.push(`/scrap/${item.id}`)}
                onBookmark={toggleBookmark}
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { fontSize: 18, fontWeight: '700' },
  segment: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    borderRadius: 10,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { padding: spacing.lg },
  section: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  subTabsWrap: { flexGrow: 0, flexShrink: 0 },
  subTabs: { paddingHorizontal: spacing.lg, gap: 8, paddingVertical: spacing.sm, alignItems: 'center' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
});

export default JobsScreen;
