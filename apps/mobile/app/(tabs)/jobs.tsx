import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard from '@/components/JobCard';
import ScrapCard from '@/components/ScrapCard';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';
import { useScrapStore } from '@/stores/scrapStore';

type Segment = 'news' | 'post';

/**
 * S-06 채용 화면 — 뉴스 / 공고 세그먼트
 */
const JobsScreen = () => {
  const colors = useTheme();
  const scraps = useScrapStore((s) => s.scraps);
  const { loading, refreshing, fetchScraps, refresh, loadMore, toggleBookmark } = useScraps();
  const [seg, setSeg] = useState<Segment>('news');

  const category = seg === 'news' ? 'job_news' as const : 'job_post' as const;

  useEffect(() => {
    fetchScraps({ category });
  }, [category, fetchScraps]);

  const news = useMemo(() => scraps.filter((s) => s.category === 'job_news'), [scraps]);
  const posts = useMemo(() => scraps.filter((s) => s.category === 'job_post'), [scraps]);

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
            loading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.point} /> : null
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
        <FlatList
          data={posts}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshing={refreshing}
          onRefresh={() => refresh({ category: 'job_post' })}
          onEndReached={() => loadMore({ category: 'job_post' })}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            posts.length > 0 ? (
              <Text style={[styles.section, { color: colors.textPrimary }]}>마감 임박 🔥</Text>
            ) : null
          }
          ListEmptyComponent={
            loading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.point} /> : null
          }
          renderItem={({ item }) => (
            <JobCard
              scrap={item}
              onPress={() => router.push(`/scrap/${item.id}`)}
              onBookmark={toggleBookmark}
            />
          )}
        />
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
});

export default JobsScreen;
