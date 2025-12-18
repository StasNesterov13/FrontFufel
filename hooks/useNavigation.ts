import type { ScreenNavigationProp } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';

export const useAppNavigation = () => useNavigation<ScreenNavigationProp>();
