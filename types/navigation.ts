import { StackNavigationProp } from '@react-navigation/stack';

// Типы для экранов вашего стека
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  CreateProfile: undefined; 
  // добавьте другие экраны при необходимости
};


export type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList
>;


