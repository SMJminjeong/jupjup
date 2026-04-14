import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Category } from '@jupjup/types';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrapCard from '@/components/ScrapCard';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';
import { useScrapStore } from '@/stores/scrapStore';

type Filter = 'all' | Category;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'ai_news', label: 'AI 뉴스' },
  { key: 'job_news', label: '채용 뉴스' },
  { key: 'job_post', label: '채용 공고' },
  { key: 'finance', label: '재테크' },
];

/**
 * S-04 홈 피드
 */
const HomeFeedScreen = () => {
  const colors = useTheme();
  const scraps = useScrapStore((s) => s.scraps);
  const { loading, refreshing, fetchScraps, refresh, loadMore, toggleBookmark } = useScraps();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetchScraps(filter === 'all' ? {} : { category: filter });
  }, [filter, fetchScraps]);

  const filtered = useMemo(
    () => (filter === 'all' ? scraps : scraps.filter((s) => s.category === filter)),
    [scraps, filter],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.logoText, { color: colors.textPrimary }]}>송줍줍</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/search')}
            hitSlop={8}
            accessibilityLabel="검색"
          >
            <MaterialCommunityIcons name="magnify" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/add')}
            hitSlop={8}
            accessibilityLabel="스크랩 추가"
          >
            <MaterialCommunityIcons name="plus" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          renderItem={({ item }) => {
            const active = filter === item.key;
            return (
              <TouchableOpacity onPress={() => setFilter(item.key)} style={styles.tab}>
                <Text
                  style={{
                    color: active ? colors.point : colors.textSecondary,
                    fontWeight: active ? '700' : '500',
                  }}
                >
                  {item.label}
                </Text>
                {active && <View style={[styles.tabBar, { backgroundColor: colors.point }]} />}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={[styles.updateBar, { backgroundColor: colors.bgSurface }]}>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
          오늘 {filtered.length}개의 새 콘텐츠가 업데이트됐어요
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshing={refreshing}
        onRefresh={() => refresh(filter === 'all' ? {} : { category: filter })}
        onEndReached={() => loadMore(filter === 'all' ? {} : { category: filter })}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.point} />
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              아직 스크랩이 없어요
            </Text>
          )
        }
        renderItem={({ item }) => (
          <ScrapCard
            scrap={item}
            onPress={() => router.push(`/scrap/${item.id}`)}
            onBookmark={toggleBookmark}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoText: { fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: spacing.lg },
  tabsContainer: { paddingHorizontal: spacing.lg, gap: spacing.xl, height: 44, alignItems: 'center' },
  tab: { height: 44, justifyContent: 'center' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, borderRadius: 1 },
  updateBar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  listContent: { padding: spacing.lg },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 },
});

export default HomeFeedScreen;
