import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { spacing, useTheme } from '@/constants/theme';

/**
 * S-12 알림 설정 화면
 */
const NotificationsScreen = () => {
  const colors = useTheme();
  const [jobAll, setJobAll] = useState(true);
  const [d7, setD7] = useState(true);
  const [d3, setD3] = useState(true);
  const [d1, setD1] = useState(true);
  const [aiNews, setAiNews] = useState(false);
  const [finance, setFinance] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={[styles.section, { backgroundColor: colors.bgCard }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          채용 공고 마감 알림
        </Text>
        <Row label="전체 알림" value={jobAll} onChange={setJobAll} colors={colors} />
        {jobAll && (
          <>
            <Row label="D-7 알림" value={d7} onChange={setD7} colors={colors} />
            <Row label="D-3 알림" value={d3} onChange={setD3} colors={colors} />
            <Row label="D-1 알림" value={d1} onChange={setD1} colors={colors} />
          </>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.bgCard, marginTop: spacing.lg }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          뉴스 업데이트 알림
        </Text>
        <Row label="새 AI 뉴스" value={aiNews} onChange={setAiNews} colors={colors} />
        <Row label="새 재테크 콘텐츠" value={finance} onChange={setFinance} colors={colors} />
      </View>
    </ScrollView>
  );
};

const Row = ({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.row}>
    <Text style={{ color: colors.textPrimary, fontSize: 16 }}>{label}</Text>
    <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.point, false: colors.border }} />
  </View>
);

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  sectionTitle: { fontSize: 13, marginBottom: spacing.sm },
  row: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default NotificationsScreen;
