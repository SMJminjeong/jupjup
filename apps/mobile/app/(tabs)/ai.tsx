import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrapCard from '@/components/ScrapCard';
import SkeletonCard from '@/components/SkeletonCard';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';
import { useScrapStore } from '@/stores/scrapStore';

const SUB_FILTERS = ['전체', 'LLM', '생성AI', '로봇', '규제', '연구'];

/**
 * S-05 AI 뉴스 화면
 */
const AiNewsScreen = () => {
  const colors = useTheme();
  const scraps = useScrapStore((s) => s.scraps);
  const { loading, refreshing, fetchScraps, refresh, loadMore, toggleBookmark } = useScraps();
  const [sub, setSub] = useState('전체');

  useEffect(() => {
    fetchScraps({ category: 'ai_news' });
  }, [fetchScraps]);

  const filtered = useMemo(() => {
    const ai = scraps.filter((s) => s.category === 'ai_news');
    if (sub === '전체') return ai;
    return ai.filter((s) => s.tags.includes(sub));
  }, [scraps, sub]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>AI 뉴스</Text>
      </View>

      <FlatList
        horizontal
        data={SUB_FILTERS}
        keyExtractor={(it) => it}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subTabs}
        renderItem={({ item }) => {
          const active = sub === item;
          return (
            <TouchableOpacity
              onPress={() => setSub(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.point : colors.bgSurface,
                },
              ]}
            >
              <Text style={{ color: active ? '#FFFFFF' : colors.textSecondary }}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshing={refreshing}
        onRefresh={() => refresh({ category: 'ai_news' })}
        onEndReached={() => loadMore({ category: 'ai_news' })}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          loading ? (
            <View>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
                아직 수집된 AI 뉴스가 없어요
              </Text>
              <Text style={{ color: colors.textTertiary, marginTop: 8 }}>
                잠시 후 자동으로 업데이트돼요
              </Text>
            </View>
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
  header: { height: 56, justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { fontSize: 18, fontWeight: '700' },
  subTabs: { paddingHorizontal: spacing.lg, gap: 8, paddingVertical: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16 },
  listContent: { padding: spacing.lg },
});

export default AiNewsScreen;
