import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MenuPlanData } from './data';

type RootStackParamList = {
  CreateProfile: undefined;
  CreateMeasurements: undefined;
  CreateGoals: undefined;
  CreateFoodIntakes: { data: MenuPlanData; day: string };
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Tabs: undefined;
};

export const useAppNavigation = () => useNavigation<StackNavigationProp<RootStackParamList>>();

export const useAppRoute = () => useRoute<RouteProp<RootStackParamList>>();
