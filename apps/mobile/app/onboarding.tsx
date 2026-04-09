import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@/constants/theme';

const { width } = Dimensions.get('window');

const PAGES = [
  {
    title: '최신 AI · 채용 뉴스를\n자동으로 모아드려요',
    desc: '매일 아침 업데이트되는\nAI 뉴스와 채용 정보를 한눈에',
  },
  {
    title: '읽고 싶은 콘텐츠를\n내 창고에 저장하세요',
    desc: 'URL 공유만 해도 자동으로\n제목·요약·이미지를 저장해드려요',
  },
  {
    title: '채용 공고 마감일을\n절대 놓치지 마세요',
    desc: 'D-7, D-3, D-1 푸시 알림으로\n중요한 공고를 챙겨드려요',
  },
];

const OnboardingScreen = () => {
  const colors = useTheme();
  const [page, setPage] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== page) setPage(idx);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <TouchableOpacity
        style={styles.skip}
        onPress={() => router.replace('/login')}
      >
        <Text style={{ color: colors.textSecondary }}>건너뛰기</Text>
      </TouchableOpacity>

      <FlatList
        data={PAGES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <View style={[styles.illustration, { backgroundColor: colors.bgSurface }]} />
            <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.desc}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {PAGES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === page ? colors.point : colors.border },
            ]}
          />
        ))}
      </View>

      {page === PAGES.length - 1 && (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.point }]}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.startText}>시작하기</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  skip: { position: 'absolute', top: 60, right: 24, zIndex: 10 },
  page: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  illustration: { width: 280, height: 240, borderRadius: 16, marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4 },
  startButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default OnboardingScreen;
