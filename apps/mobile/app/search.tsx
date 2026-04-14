import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Scrap } from '@jupjup/types';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrapCard from '@/components/ScrapCard';
import { apiJson } from '@/lib/api';
import { mapScrap } from '@/lib/mappers';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';

/**
 * S-09 검색 화면
 */
const SearchScreen = () => {
  const colors = useTheme();
  const { toggleBookmark } = useScraps();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Scrap[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recent, setRecent] = useState<string[]>(['GPT-5', 'AI 규제', '카카오 채용', '재테크']);
  const suggestedTags = ['LLM', '생성AI', 'IT', '주식', 'ETF'];
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await apiJson<{ scraps: Record<string, unknown>[] }>(
        `/api/scraps?search=${encodeURIComponent(q.trim())}`,
      );
      setResults(data.scraps.map(mapScrap));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const handleSelectRecent = (keyword: string) => {
    setQuery(keyword);
  };

  const handleRemoveRecent = (keyword: string) => {
    setRecent((r) => r.filter((k) => k !== keyword));
  };

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
                onPress={() => handleSelectRecent(r)}
                style={[styles.chip, { backgroundColor: colors.bgSurface }]}
              >
                <Text style={{ color: colors.textSecondary }}>{r}</Text>
                <TouchableOpacity onPress={() => handleRemoveRecent(r)} hitSlop={8}>
                  <MaterialCommunityIcons
                    name="close"
                    size={14}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
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
                onPress={() => handleSelectRecent(t)}
                style={[styles.chip, { backgroundColor: colors.point + '15' }]}
              >
                <Text style={{ color: colors.point, fontWeight: '600' }}>#{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.point} />
      ) : searched && results.length === 0 ? (
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
          keyExtractor={(it, i) => `${it.id}-${i}`}
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default SearchScreen;
