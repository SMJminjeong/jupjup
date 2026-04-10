import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
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
  const [alarmTime] = useState('09:00');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgSurface }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              채용 공고 마감 알림
            </Text>
            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
              저장한 채용 공고의 마감일이 다가오면 알려드려요
            </Text>
          </View>
          <Switch
            value={jobAll}
            onValueChange={setJobAll}
            trackColor={{ true: colors.point, false: colors.border }}
          />
        </View>

        {jobAll && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Row label="D-7 알림" value={d7} onChange={setD7} colors={colors} />
            <Row label="D-3 알림" value={d3} onChange={setD3} colors={colors} />
            <Row label="D-1 알림" value={d1} onChange={setD1} colors={colors} />

            <View style={styles.row}>
              <Text style={{ color: colors.textPrimary, fontSize: 15 }}>알림 시간</Text>
              <TouchableOpacity
                style={[styles.timeChip, { backgroundColor: colors.bgSurface }]}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 14 }}>🕘 {alarmTime}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.bgCard, borderColor: colors.border, marginTop: spacing.lg },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>뉴스 업데이트 알림</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 15 }}>새 AI 뉴스</Text>
            <Text style={{ color: colors.textTertiary, fontSize: 12, marginTop: 2 }}>
              새로운 AI 뉴스가 수집되면 알려드려요
            </Text>
          </View>
          <Switch
            value={aiNews}
            onValueChange={setAiNews}
            trackColor={{ true: colors.point, false: colors.border }}
          />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 15 }}>새 재테크 콘텐츠</Text>
            <Text style={{ color: colors.textTertiary, fontSize: 12, marginTop: 2 }}>
              새로운 재테크 콘텐츠가 수집되면 알려드려요
            </Text>
          </View>
          <Switch
            value={finance}
            onValueChange={setFinance}
            trackColor={{ true: colors.point, false: colors.border }}
          />
        </View>
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
    <Text style={{ color: colors.textPrimary, fontSize: 15 }}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: colors.point, false: colors.border }}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 12 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  row: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default NotificationsScreen;
