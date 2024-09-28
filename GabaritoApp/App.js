import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import ImageProcessingScreen from './screens/ImageProcessingScreen';
import ResultsScreen from './screens/ResultsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Processar Imagem') {
              iconName = 'upload';
            } else if (route.name === 'Resultados') {
              iconName = 'list'; 
            }

            return <Icon name={iconName} size={size} color={focused ? '#273A96' : '#8E8E8F'} />;
          },
          tabBarActiveTintColor: '#273A96',
          tabBarInactiveTintColor: '#8E8E8F',
          tabBarLabelStyle: { fontSize: 12 },
          headerStyle: styles.header, // Estilo do cabeçalho
          tabBarStyle: styles.footer, // Estilo do footer
          headerTintColor: '#fff', // Muda a cor do texto do cabeçalho para branco
        })}
      >
        <Tab.Screen name="Processar Imagem" component={ImageProcessingScreen} />
        <Tab.Screen name="Resultados" component={ResultsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#273A96', // Cor do fundo do cabeçalho
    shadowColor: '#273A96', // Cor da sombra do cabeçalho
    shadowOffset: {
      width: 0, // Largura da sombra do cabeçalho
      height: 5, // Altura da sombra do cabeçalho
    },
    shadowOpacity: 0.6, // Opacidade da sombra do cabeçalho
    shadowRadius: 20, // Raio de desfoque da sombra do cabeçalho
    elevation: 5, // Para Android
  },
  footer: {
    backgroundColor: '#fff', // Cor do fundo do footer
    shadowColor: '#000', // Cor da sombra do footer
    shadowOffset: {
      width: 0, // Largura da sombra do footer
      height: -2, // Altura da sombra do footer
    },
    shadowOpacity: 0.31, // Opacidade da sombra do footer
    shadowRadius: 10, // Raio de desfoque da sombra do footer
    elevation: 5, // Para Android
  },
});
