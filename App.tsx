// App.tsx

import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { BottomNav } from "./src/components/BottomNav";
import { EmitScreen } from "./src/screens/EmitScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { NowScreen } from "./src/screens/NowScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { colors } from "./src/styles";

export default function App() {
  const [activeTab, setActiveTab] = useState("now");

  function renderScreen() {
    if (activeTab === "now") {
      return <NowScreen />;
    }

    if (activeTab === "map") {
      return <MapScreen />;
    }

    if (activeTab === "emit") {
      return <EmitScreen />;
    }

    if (activeTab === "search") {
      return <SearchScreen />;
    }

    if (activeTab === "profile") {
      return <ProfileScreen />;
    }

    return <NowScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      <BottomNav
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },
});