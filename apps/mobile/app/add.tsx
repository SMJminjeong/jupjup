import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CATEGORY_EMOJI, CATEGORY_LABEL, type Category } from '@jupjup/types';
import { isValidUrl } from '@jupjup/utils';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { apiJson } from '@/lib/api';
import { spacing, useTheme } from '@/constants/theme';

const CATEGORIES: Category[] = ['ai_news', 'job_news', 'job_post', 'finance'];

interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

/**
 * S-10 URL 저장 화면 (수동 스크랩 추가)
 */
const AddScrapScreen = () => {
  const colors = useTheme();
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [memo, setMemo] = useState('');
  const [og, setOg] = useState<OgData | null>(null);
  const [ogLoading, setOgLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const urlValid = url.length === 0 || isValidUrl(url);
  const canSave = isValidUrl(url) && category !== null && !saving;

  // URL 입력 시 OG 메타데이터 자동 조회
  const fetchOg = useCallback(async (targetUrl: string) => {
    if (!isValidUrl(targetUrl)) {
      setOg(null);
      return;
    }
    setOgLoading(true);
    try {
      const data = await apiJson<OgData>(
        `/api/og?url=${encodeURIComponent(targetUrl)}`,
      );
      setOg(data);
    } catch {
      setOg(null);
    } finally {
      setOgLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOg(url), 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [url, fetchOg]);

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await apiJson('/api/scraps', {
        method: 'POST',
        body: JSON.stringify({
          url,
          category,
          memo: memo || undefined,
        }),
      });
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다';
      Alert.alert('저장 실패', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.handle, { backgroundColor: colors.border }]} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>새 스크랩 추가</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.close}
          accessibilityLabel="닫기"
        >
          <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>URL 입력</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            {
              backgroundColor: colors.bgSurface,
              color: colors.textPrimary,
              borderColor: urlValid ? 'transparent' : colors.danger,
            },
          ]}
        />
        {!urlValid && (
          <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
            올바른 URL을 입력해주세요
          </Text>
        )}

        {/* OG 미리보기 */}
        {ogLoading && (
          <View style={[styles.ogCard, { backgroundColor: colors.bgSurface }]}>
            <ActivityIndicator color={colors.point} />
            <Text style={{ color: colors.textTertiary, marginLeft: 8 }}>미리보기 로딩 중...</Text>
          </View>
        )}
        {og && !ogLoading && (
          <View style={[styles.ogCard, { backgroundColor: colors.bgSurface }]}>
            {og.image && (
              <Image source={{ uri: og.image }} style={styles.ogImage} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.ogTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                {og.title ?? '제목 없음'}
              </Text>
              {og.description && (
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={2}>
                  {og.description}
                </Text>
              )}
              {og.siteName && (
                <Text style={{ color: colors.textTertiary, fontSize: 11, marginTop: 4 }}>
                  {og.siteName}
                </Text>
              )}
            </View>
          </View>
        )}

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.lg }]}>
          카테고리
        </Text>
        <View style={styles.grid}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.gridItem,
                  {
                    borderColor: active ? colors.category[c] : colors.border,
                    backgroundColor: active ? colors.category[c] + '20' : 'transparent',
                  },
                ]}
              >
                <Text style={styles.gridEmoji}>{CATEGORY_EMOJI[c]}</Text>
                <Text
                  style={{
                    color: active ? colors.category[c] : colors.textSecondary,
                    fontWeight: '600',
                  }}
                >
                  {CATEGORY_LABEL[c]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.lg }]}>
          메모 (선택)
        </Text>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          placeholder="이 콘텐츠에 대한 메모를 남겨보세요"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          style={[
            styles.textarea,
            { backgroundColor: colors.bgSurface, color: colors.textPrimary },
          ]}
        />
      </ScrollView>

      <View style={{ padding: spacing.lg }}>
        <TouchableOpacity
          disabled={!canSave}
          onPress={handleSave}
          style={[
            styles.saveBtn,
            { backgroundColor: canSave ? colors.point : colors.border },
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>저장하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  handle: { width: 32, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: { fontSize: 18, fontWeight: '700' },
  close: { position: 'absolute', right: spacing.lg, top: spacing.md },
  label: { fontSize: 13, marginBottom: spacing.sm },
  input: { height: 44, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, borderWidth: 1 },
  ogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: spacing.md,
    gap: 12,
  },
  ogImage: { width: 64, height: 64, borderRadius: 8 },
  ogTitle: { fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridItem: {
    width: '48%',
    height: 72,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  gridEmoji: { fontSize: 22 },
  textarea: {
    minHeight: 96,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  saveBtn: { height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export default AddScrapScreen;
