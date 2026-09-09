// App.tsx

import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import {
  AuthProvider,
  useAuth,
} from "./src/auth/AuthContext";
import { BottomNav } from "./src/components/BottomNav";
import { AuthScreen } from "./src/screens/AuthScreen";
import { EmitScreen } from "./src/screens/EmitScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { NowScreen } from "./src/screens/NowScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { colors } from "./src/styles";

function AppContent() {
  const { identity, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("now");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

if (!identity) {
  return <AuthScreen />;
}

  function renderScreen() {
    if (activeTab === "now") return <NowScreen />;
    if (activeTab === "map") return <MapScreen />;
    if (activeTab === "emit") return <EmitScreen />;
    if (activeTab === "search") return <SearchScreen />;
    if (activeTab === "profile") return <ProfileScreen />;

    return <NowScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      <BottomNav
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
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

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});