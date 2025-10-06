import TabBar from "@/src/components/navigation/TabBar";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{headerShown: false}}
      tabBar={props=> <TabBar {...props} />}
    >
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Home'
        }}
      />
      <Tabs.Screen 
        name="forecast"
        options={{
          title: 'Forecast'
        }}
      />
      <Tabs.Screen 
        name="map"
        options={{
          title: 'Map'
        }}
      />
      <Tabs.Screen 
        name="chatbot"
        options={{
          title: 'Chatbot'
        }}
      />
    </Tabs>
  );
}