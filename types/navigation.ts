import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  CreateProfile: undefined;
  CreateMeasurements: undefined;
  CreateGoals: undefined;
  CreateFoodIntakes: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Tabs: undefined;
};

export const useAppNavigation = () => useNavigation<StackNavigationProp<RootStackParamList>>();
