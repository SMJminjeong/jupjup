import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard from '@/components/JobCard';
import ScrapCard from '@/components/ScrapCard';
import { MOCK_SCRAPS } from '@/constants/mockData';
import { spacing, useTheme } from '@/constants/theme';
import { useScrapStore } from '@/stores/scrapStore';

type Segment = 'news' | 'post';

/**
 * S-06 채용 화면 — 뉴스 / 공고 세그먼트
 */
const JobsScreen = () => {
  const colors = useTheme();
  const { scraps, setScraps, toggleBookmark } = useScrapStore();
  const [seg, setSeg] = useState<Segment>('news');

  useEffect(() => {
    if (scraps.length === 0) setScraps(MOCK_SCRAPS);
  }, [scraps.length, setScraps]);

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
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListHeaderComponent={
            <Text style={[styles.section, { color: colors.textPrimary }]}>마감 임박 🔥</Text>
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
