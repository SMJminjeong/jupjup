import { CATEGORY_LABEL, type Category } from '@jupjup/types';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme';

interface CategoryBadgeProps {
  category: Category;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const colors = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: colors.category[category] }]}>
      <Text style={styles.text}>{CATEGORY_LABEL[category]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CategoryBadge;
