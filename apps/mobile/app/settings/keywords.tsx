import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Category } from '@jupjup/types';
import { CATEGORY_EMOJI, CATEGORY_LABEL } from '@jupjup/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiJson } from '@/lib/api';
import { spacing, useTheme } from '@/constants/theme';

interface Keyword {
  id: string;
  text: string;
  category: Category;
}

const CATEGORIES: Category[] = ['ai_news', 'job_news', 'job_post', 'finance'];

/**
 * S-13 관심 키워드 설정
 */
const KeywordsScreen = () => {
  const colors = useTheme();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category>('ai_news');

  const fetchKeywords = useCallback(async () => {
    try {
      const data = await apiJson<{ keywords: Array<{ id: string; keyword: string; category: Category }> }>(
        '/api/keywords',
      );
      setKeywords(
        data.keywords.map((k) => ({ id: k.id, text: k.keyword, category: k.category })),
      );
    } catch (err) {
      console.error('키워드 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      items: keywords.filter((k) => k.category === cat),
    })).filter((g) => g.items.length > 0);
  }, [keywords]);

  const addKeyword = async () => {
    if (!input.trim()) return;
    try {
      const data = await apiJson<{ keyword: { id: string; keyword: string; category: Category } }>(
        '/api/keywords',
        {
          method: 'POST',
          body: JSON.stringify({ keyword: input.trim(), category: selectedCat }),
        },
      );
      setKeywords((k) => [
        ...k,
        { id: data.keyword.id, text: data.keyword.keyword, category: data.keyword.category },
      ]);
    } catch (err) {
      console.error('키워드 추가 실패:', err);
    }
    setInput('');
    setModalOpen(false);
  };

  const removeKeyword = async (id: string) => {
    try {
      await apiJson(`/api/keywords/${id}`, { method: 'DELETE' });
      setKeywords((k) => k.filter((it) => it.id !== id));
    } catch (err) {
      console.error('키워드 삭제 실패:', err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.bgPrimary }}>
        <ActivityIndicator color={colors.point} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: spacing.lg }}>
        등록한 키워드가 포함된 새 콘텐츠가 수집되면 알림을 보내드려요
      </Text>

      <TouchableOpacity
        onPress={() => setModalOpen(true)}
        style={[styles.addButton, { borderColor: colors.point }]}
      >
        <MaterialCommunityIcons name="plus" size={18} color={colors.point} />
        <Text style={{ color: colors.point, fontSize: 15, fontWeight: '600' }}>
          키워드 추가
        </Text>
      </TouchableOpacity>

      {grouped.map((group) => (
        <View key={group.category} style={{ marginTop: spacing.xl }}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupEmoji}>{CATEGORY_EMOJI[group.category]}</Text>
            <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>
              {CATEGORY_LABEL[group.category]}
            </Text>
            <Text style={[styles.groupCount, { color: colors.textTertiary }]}>
              {group.items.length}개
            </Text>
          </View>
          <View style={styles.chipsRow}>
            {group.items.map((k) => (
              <TouchableOpacity
                key={k.id}
                onPress={() => removeKeyword(k.id)}
                style={[
                  styles.chip,
                  { backgroundColor: colors.category[k.category] + '20' },
                ]}
              >
                <Text style={{ color: colors.category[k.category], fontWeight: '600' }}>
                  {k.text}
                </Text>
                <MaterialCommunityIcons
                  name="close"
                  size={14}
                  color={colors.category[k.category]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.bgCard }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>키워드 추가</Text>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="키워드 입력"
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.input,
                { backgroundColor: colors.bgSurface, color: colors.textPrimary },
              ]}
              onSubmitEditing={addKeyword}
              autoFocus
            />
            <View style={styles.catRow}>
              {CATEGORIES.map((c) => {
                const active = selectedCat === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setSelectedCat(c)}
                    style={[
                      styles.catChip,
                      { backgroundColor: active ? colors.category[c] : colors.bgSurface },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? '#FFFFFF' : colors.textSecondary,
                        fontSize: 12,
                      }}
                    >
                      {CATEGORY_EMOJI[c]} {CATEGORY_LABEL[c]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[styles.modalBtn, { backgroundColor: colors.bgSurface }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addKeyword}
                style={[styles.modalBtn, { backgroundColor: colors.point }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  groupEmoji: { fontSize: 18 },
  groupTitle: { fontSize: 15, fontWeight: '700' },
  groupCount: { fontSize: 13 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
    borderRadius: 16,
    padding: spacing.lg,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: spacing.md },
  input: { height: 44, borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  catChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KeywordsScreen;
