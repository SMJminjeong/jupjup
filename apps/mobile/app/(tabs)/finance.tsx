import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrapCard from '@/components/ScrapCard';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';
import { useScrapStore } from '@/stores/scrapStore';

const SUB_FILTERS = ['전체', '주식', 'ETF', '부동산', '절세', '예적금'];

/**
 * S-07 재테크 화면
 */
const FinanceScreen = () => {
  const colors = useTheme();
  const scraps = useScrapStore((s) => s.scraps);
  const { loading, refreshing, fetchScraps, refresh, loadMore, toggleBookmark } = useScraps();
  const [sub, setSub] = useState('전체');

  useEffect(() => {
    fetchScraps({ category: 'finance' });
  }, [fetchScraps]);

  const filtered = useMemo(() => {
    const list = scraps.filter((s) => s.category === 'finance');
    if (sub === '전체') return list;
    return list.filter((s) => s.tags.includes(sub));
  }, [scraps, sub]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>재테크</Text>
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
                { backgroundColor: active ? colors.point : colors.bgSurface },
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
        onRefresh={() => refresh({ category: 'finance' })}
        onEndReached={() => loadMore({ category: 'finance' })}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.point} />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
              아직 재테크 콘텐츠가 없어요
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
  header: { height: 56, justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { fontSize: 18, fontWeight: '700' },
  subTabs: { paddingHorizontal: spacing.lg, gap: 8, paddingVertical: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  listContent: { padding: spacing.lg },
});

export default FinanceScreen;
