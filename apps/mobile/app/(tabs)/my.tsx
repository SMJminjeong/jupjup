import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useScrapStore } from '@/stores/scrapStore';

/**
 * S-11 마이페이지 화면
 */
const MyPageScreen = () => {
  const colors = useTheme();
  const { user, clear } = useAuthStore();
  const { scraps } = useScrapStore();

  const total = scraps.length;
  const bookmarked = scraps.filter((s) => s.isBookmarked).length;
  const thisMonth = scraps.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const byCategory: { key: string; label: string; count: number; color: string }[] = [
    { key: 'ai_news', label: 'AI 뉴스', count: scraps.filter((s) => s.category === 'ai_news').length, color: colors.category.ai_news },
    { key: 'job_news', label: '채용 뉴스', count: scraps.filter((s) => s.category === 'job_news').length, color: colors.category.job_news },
    { key: 'job_post', label: '채용 공고', count: scraps.filter((s) => s.category === 'job_post').length, color: colors.category.job_post },
    { key: 'finance', label: '재테크', count: scraps.filter((s) => s.category === 'finance').length, color: colors.category.finance },
  ];
  const max = Math.max(1, ...byCategory.map((c) => c.count));

  const handleLogout = () => {
    clear();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>MY</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={[styles.profile, { backgroundColor: colors.bgCard }]}>
          <View style={[styles.avatar, { backgroundColor: colors.bgSurface }]} />
          <Text style={[styles.nickname, { color: colors.textPrimary }]}>
            {user?.nickname ?? '게스트'}
          </Text>
          <View style={[styles.kakaoBadge, { backgroundColor: colors.kakao }]}>
            <Text style={{ fontSize: 11, color: colors.kakaoText, fontWeight: '600' }}>kakao 연동</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="총 스크랩" value={total} color={colors.point} secondary={colors.textSecondary} bg={colors.bgCard} />
          <Stat label="이번달" value={thisMonth} color={colors.point} secondary={colors.textSecondary} bg={colors.bgCard} />
          <Stat label="북마크" value={bookmarked} color={colors.point} secondary={colors.textSecondary} bg={colors.bgCard} />
        </View>

        <Text style={[styles.section, { color: colors.textPrimary }]}>카테고리별 스크랩</Text>
        {byCategory.map((c) => (
          <View key={c.key} style={styles.barRow}>
            <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{c.label}</Text>
            <View style={[styles.barTrack, { backgroundColor: colors.bgSurface }]}>
              <View
                style={[
                  styles.barFill,
                  { backgroundColor: c.color, width: `${(c.count / max) * 100}%` },
                ]}
              />
            </View>
            <Text style={[styles.barCount, { color: colors.textSecondary }]}>{c.count}건</Text>
          </View>
        ))}

        <View style={[styles.menu, { backgroundColor: colors.bgCard }]}>
          <MenuItem label="알림 설정" onPress={() => router.push('/settings/notifications')} colors={colors} />
          <MenuItem label="관심 키워드 설정" onPress={() => router.push('/settings/keywords')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem label="이용약관" onPress={() => {}} colors={colors} />
          <MenuItem label="개인정보처리방침" onPress={() => {}} colors={colors} />
          <MenuItem label="앱 버전" trailing="1.0.0" colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem label="로그아웃" onPress={handleLogout} danger colors={colors} />
          <MenuItem label="계정 탈퇴" onPress={() => {}} danger colors={colors} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat = ({
  label,
  value,
  color,
  secondary,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  secondary: string;
  bg: string;
}) => (
  <View style={[styles.statBox, { backgroundColor: bg }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: secondary }]}>{label}</Text>
  </View>
);

const MenuItem = ({
  label,
  onPress,
  trailing,
  danger,
  colors,
}: {
  label: string;
  onPress?: () => void;
  trailing?: string;
  danger?: boolean;
  colors: ReturnType<typeof useTheme>;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <Text style={{ fontSize: 16, color: danger ? colors.danger : colors.textPrimary }}>{label}</Text>
    <Text style={{ color: colors.textTertiary }}>{trailing ?? (onPress ? '›' : '')}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { fontSize: 18, fontWeight: '700' },
  profile: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginBottom: 8 },
  nickname: { fontSize: 18, fontWeight: '700' },
  kakaoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statBox: { flex: 1, padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  section: { fontSize: 15, fontWeight: '600', marginBottom: spacing.md },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: 8 },
  barLabel: { width: 60, fontSize: 13 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%' },
  barCount: { width: 36, textAlign: 'right', fontSize: 12 },
  menu: { borderRadius: 12, marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  menuItem: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: { height: StyleSheet.hairlineWidth },
});

export default MyPageScreen;
