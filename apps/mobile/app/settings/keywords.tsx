import type { Category } from '@jupjup/types';
import { CATEGORY_LABEL } from '@jupjup/types';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { spacing, useTheme } from '@/constants/theme';

interface Keyword {
  id: string;
  text: string;
  category: Category;
}

/**
 * S-13 관심 키워드 설정
 */
const KeywordsScreen = () => {
  const colors = useTheme();
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: '1', text: 'GPT', category: 'ai_news' },
    { id: '2', text: '토스', category: 'job_post' },
  ]);
  const [input, setInput] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category>('ai_news');

  const addKeyword = () => {
    if (!input.trim()) return;
    setKeywords((k) => [...k, { id: String(Date.now()), text: input.trim(), category: selectedCat }]);
    setInput('');
  };

  const removeKeyword = (id: string) => {
    setKeywords((k) => k.filter((it) => it.id !== id));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgPrimary }} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: spacing.lg }}>
        등록한 키워드가 포함된 새 콘텐츠가 수집되면 알림을 보내드려요
      </Text>

      <View style={styles.chipsRow}>
        {keywords.map((k) => (
          <TouchableOpacity
            key={k.id}
            onPress={() => removeKeyword(k.id)}
            style={[styles.chip, { backgroundColor: colors.category[k.category] + '20' }]}
          >
            <Text style={{ color: colors.category[k.category], fontWeight: '600' }}>
              {k.text} ✕
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.addBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.addTitle, { color: colors.textPrimary }]}>키워드 추가</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="키워드 입력"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { backgroundColor: colors.bgSurface, color: colors.textPrimary }]}
          onSubmitEditing={addKeyword}
        />
        <View style={styles.catRow}>
          {(['ai_news', 'job_news', 'job_post', 'finance'] as Category[]).map((c) => {
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
                <Text style={{ color: active ? '#FFFFFF' : colors.textSecondary, fontSize: 12 }}>
                  {CATEGORY_LABEL[c]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={addKeyword}
          style={[styles.addBtn, { backgroundColor: colors.point }]}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>추가</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.xl },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBox: { borderRadius: 12, borderWidth: 1, padding: spacing.lg },
  addTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  input: { height: 44, borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  catChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  addBtn: { height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
});

export default KeywordsScreen;
