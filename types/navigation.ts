import { StackNavigationProp } from '@react-navigation/stack'

// Типы для экранов вашего стека
export type RootStackParamList = {
  CreateProfile: undefined 
  CreateMeasurements:undefined
  CreateGoals:undefined
  Login: undefined
  Register: undefined
  Profile: undefined
  Tabs:undefined

  // добавьте другие экраны при необходимости
}


export type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList
>


