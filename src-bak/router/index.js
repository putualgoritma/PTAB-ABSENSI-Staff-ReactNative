import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Home from '../page/home';
import Test1 from '../Test1';

const Stack = createStackNavigator();


const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Home">

<Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />

<Stack.Screen
        name="Test1"
        component={Test1}
        options={{headerShown: false}}
      />



    </Stack.Navigator>

    
  )

}
export default Router