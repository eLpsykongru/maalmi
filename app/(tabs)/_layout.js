import { Tabs } from "expo-router";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E07" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="home-variant"
                size={24}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={24}
                color="black"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarLabel: "Services",
          tabBarLabelStyle: { color: "#008E07" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons name="toolbox" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons
                name="toolbox-outline"
                size={24}
                color="black"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#008E07" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person-circle" size={24} color="black" />
            ) : (
              <Ionicons name="person-circle" size={24} color="black" />
            ),
         
        }}
      />
    </Tabs>
  );
}
