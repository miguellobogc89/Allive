// App.tsx

import { useState } from "react";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";

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

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [activeTab, setActiveTab] = useState("now");
  const [requestedLiveId, setRequestedLiveId] =
    useState<string | null>(null);

  if (isLoading || !fontsLoaded) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!identity) {
    return <AuthScreen />;
  }

  function openLive(liveId: string) {
    setRequestedLiveId(liveId);
    setActiveTab("now");
  }

  function changeTab(tab: string) {
    if (tab !== "now") {
      setRequestedLiveId(null);
    }

    setActiveTab(tab);
  }

  function renderScreen() {
    if (activeTab === "now") {
      return <NowScreen requestedLiveId={requestedLiveId} />;
    }

    if (activeTab === "map") {
      return <MapScreen />;
    }

    if (activeTab === "emit") {
      return <EmitScreen />;
    }

    if (activeTab === "search") {
      return <SearchScreen onOpenLive={openLive} />;
    }

    if (activeTab === "profile") {
      return <ProfileScreen />;
    }

    return <NowScreen requestedLiveId={requestedLiveId} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {activeTab !== "emit" ? (
        <BottomNav
          activeTab={activeTab}
          onTabPress={changeTab}
        />
      ) : null}
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