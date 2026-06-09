import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaReproductor from './Pantalla/PantallaReproductor';

const Pila = createNativeStackNavigator();

export default function Aplicacion() {
  return (
    <NavigationContainer>
      <Pila.Navigator
        screenOptions={{
          headerStyle:      { backgroundColor: '#2D2D2D' },
          headerTintColor:  '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Pila.Screen
          name='Reproductor'
          component={PantallaReproductor}
          options={{ title: 'Reproductor de Musica' }}
        />
      </Pila.Navigator>
    </NavigationContainer>
  );
}