import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  CreateProfile: undefined;
  CreateMeasurements: undefined;
  CreateGoals: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Tabs: undefined;
};

export type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
