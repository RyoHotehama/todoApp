import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import TabScreen from '../../screens/TabScreen';
import MapScreen from '../../screens/MapScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: 'white', headerStyle: { backgroundColor: '#167476' } }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'ホーム' }} />
      <Stack.Screen name="Tab" component={TabScreen} options={{ headerTitle: 'タブ管理' }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ headerTitle: '経路登録' }} />
    </Stack.Navigator>
  );
}
