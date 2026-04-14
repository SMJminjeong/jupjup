import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Scrap } from '@jupjup/types';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBadge from '@/components/CategoryBadge';
import { spacing, useTheme } from '@/constants/theme';
import { useScraps } from '@/hooks/useScraps';
import { apiJson } from '@/lib/api';
import { mapScrap } from '@/lib/mappers';
import { useScrapStore } from '@/stores/scrapStore';
import { calculateDDay, formatRelativeDate } from '@jupjup/utils';

/**
 * S-08 스크랩 상세 화면
 */
const ScrapDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const storeScrap = useScrapStore((s) => s.scraps.find((it) => it.id === id));
  const { toggleBookmark, markRead } = useScraps();

  const [scrap, setScrap] = useState<Scrap | undefined>(storeScrap);
  const [memoEditing, setMemoEditing] = useState(false);
  const [memoText, setMemoText] = useState(scrap?.memo ?? '');

  // store에 없으면 서버에서 조회 (RSS 공용 풀 등)
  useEffect(() => {
    if (storeScrap) {
      setScrap(storeScrap);
      setMemoText(storeScrap.memo ?? '');
    }
  }, [storeScrap]);

  // 읽음 처리
  useEffect(() => {
    if (id && scrap && !scrap.isRead) {
      markRead(id);
    }
  }, [id, scrap, markRead]);

  const handleToggleBookmark = async () => {
    if (!id) return;
    await toggleBookmark(id);
    setScrap((prev) => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : prev);
  };

  const handleSaveMemo = async () => {
    if (!id) return;
    try {
      await apiJson(`/api/scraps/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ memo: memoText }),
      });
      setScrap((prev) => prev ? { ...prev, memo: memoText } : prev);
      setMemoEditing(false);
    } catch {
      Alert.alert('저장 실패', '메모 저장에 실패했습니다');
    }
  };

  if (!scrap) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.point} />
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

        {scrap.thumbnail ? (
          <Image source={{ uri: scrap.thumbnail }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, { backgroundColor: colors.bgSurface }]} />
        )}

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

        {memoEditing ? (
          <View style={[styles.memoBox, { borderColor: colors.point }]}>
            <TextInput
              value={memoText}
              onChangeText={setMemoText}
              placeholder="메모를 입력하세요"
              placeholderTextColor={colors.textTertiary}
              multiline
              autoFocus
              style={{ color: colors.textPrimary, fontSize: 14, minHeight: 60 }}
            />
            <View style={styles.memoActions}>
              <TouchableOpacity onPress={() => { setMemoEditing(false); setMemoText(scrap.memo ?? ''); }}>
                <Text style={{ color: colors.textTertiary }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveMemo}>
                <Text style={{ color: colors.point, fontWeight: '700' }}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.memoBox, { borderColor: colors.border }]}
            onPress={() => setMemoEditing(true)}
          >
            <Text style={{ color: scrap.memo ? colors.textPrimary : colors.textTertiary }}>
              {scrap.memo ?? '+ 메모 추가'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.actionBar, { backgroundColor: colors.bgPrimary, borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={handleToggleBookmark}
          style={styles.bookmarkBtn}
          accessibilityLabel={scrap.isBookmarked ? '북마크 해제' : '북마크'}
        >
          <MaterialCommunityIcons
            name={scrap.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={scrap.isBookmarked ? colors.point : colors.textSecondary}
          />
          <Text
            style={{
              color: scrap.isBookmarked ? colors.point : colors.textSecondary,
              fontWeight: '600',
            }}
          >
            {scrap.isBookmarked ? '저장됨' : '저장하기'}
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
  memoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: spacing.sm,
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
  bookmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
});

export default ScrapDetailScreen;
