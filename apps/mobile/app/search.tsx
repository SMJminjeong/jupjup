import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrapCard from '@/components/ScrapCard';
import { spacing, useTheme } from '@/constants/theme';
import { useScrapStore } from '@/stores/scrapStore';

/**
 * S-09 검색 화면
 */
const SearchScreen = () => {
  const colors = useTheme();
  const { scraps, toggleBookmark } = useScrapStore();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(['GPT-5', 'AI 규제', '카카오 채용', '재테크']);
  const suggestedTags = ['LLM', '생성AI', 'IT', '주식', 'ETF'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return scraps.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary?.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q),
    );
  }, [query, scraps]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="검색어를 입력하세요"
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            { backgroundColor: colors.bgSurface, color: colors.textPrimary },
          ]}
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => router.back()} style={styles.cancel}>
          <Text style={{ color: colors.point }}>취소</Text>
        </TouchableOpacity>
      </View>

      {!query.trim() ? (
        <View style={{ padding: spacing.lg }}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>최근 검색어</Text>
            <TouchableOpacity onPress={() => setRecent([])}>
              <Text style={{ color: colors.textTertiary }}>전체 삭제</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsRow}>
            {recent.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setQuery(r)}
                style={[styles.chip, { backgroundColor: colors.bgSurface }]}
              >
                <Text style={{ color: colors.textSecondary }}>{r} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
            ]}
          >
            추천 태그
          </Text>
          <View style={styles.chipsRow}>
            {suggestedTags.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setQuery(t)}
                style={[styles.chip, { backgroundColor: colors.point + '15' }]}
              >
                <Text style={{ color: colors.point, fontWeight: '600' }}>#{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
            '{query}'에 대한 결과가 없어요
          </Text>
          <Text style={{ color: colors.textTertiary, fontSize: 13, marginTop: 6 }}>
            다른 검색어를 입력해보세요
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: spacing.lg }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          renderItem={({ item }) => (
            <ScrapCard
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: 56,
    gap: spacing.md,
  },
  input: { flex: 1, height: 44, borderRadius: 10, paddingHorizontal: spacing.md, fontSize: 14 },
  cancel: { padding: 4 },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default SearchScreen;
