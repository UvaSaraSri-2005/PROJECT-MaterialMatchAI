
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="explore"
        options={{ title: 'Explore' }}
      />
      <Stack.Screen name="find-materials" options={{ title: 'Find Materials' }} />
      <Stack.Screen name="resource-loop" options={{ title: 'Resource Loop' }} />
      <Stack.Screen name="industries" options={{ title: 'Industries' }} />
      <Stack.Screen name="requirements" options={{ title: 'Requirements' }} />
      <Stack.Screen
        name="list-waste"
        options={{
          title: 'List Your Waste',
          headerBackTitle: 'Home',
        }}
      />
      <Stack.Screen
        name="login"
        options={{ title: 'Industry Login' }}
      />
      <Stack.Screen
        name="register"
        options={{ title: 'Industry Registration' }}
      />
      <Stack.Screen
        name="supplier-requests"
        options={{ title: 'Supplier Requests' }}
      />
    </Stack>
  );
}
