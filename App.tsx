// App.tsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

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
import {
  EmitScreen,
  type EmitUiState,
} from "./src/screens/EmitScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { NowScreen } from "./src/screens/NowScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SearchScreen } from "./src/screens/SearchScreen";

import {
  colors,
  typography,
} from "./src/styles";

function AppContent() {
  useEffect(() => {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    document.body.style.fontFamily =
      typography.fontFamily;
  }, []);

  const {
    identity,
    isLoading,
  } = useAuth();

  const [
    activeTab,
    setActiveTab,
  ] = useState("now");

  const [
    requestedLiveId,
    setRequestedLiveId,
  ] = useState<string | null>(
    null,
  );

  const [
    emitState,
    setEmitState,
  ] = useState<EmitUiState>(
    "ready",
  );

  const [
    emitActionRequest,
    setEmitActionRequest,
  ] = useState(0);

  const handleEmitStateChange =
    useCallback(
      (state: EmitUiState) => {
        setEmitState(state);
      },
      [],
    );

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.loading}
      >
        <ActivityIndicator
          color={colors.accent}
        />
      </SafeAreaView>
    );
  }

  if (!identity) {
    return <AuthScreen />;
  }

  function openLive(
    liveId: string,
  ) {
    setRequestedLiveId(liveId);
    setActiveTab("now");
  }

  function changeTab(
    tab: string,
  ) {
    if (tab !== "now") {
      setRequestedLiveId(null);
    }

    setActiveTab(tab);
  }

  function renderScreen() {
    if (activeTab === "now") {
      return (
        <NowScreen
          requestedLiveId={
            requestedLiveId
          }
        />
      );
    }

    if (activeTab === "map") {
      return <MapScreen />;
    }

    if (activeTab === "emit") {
      return (
        <EmitScreen
          onUiStateChange={
            handleEmitStateChange
          }
          actionRequest={
            emitActionRequest
          }
        />
      );
    }

    if (activeTab === "search") {
      return (
        <SearchScreen
          onOpenLive={openLive}
        />
      );
    }

    if (activeTab === "profile") {
      return <ProfileScreen />;
    }

    return (
      <NowScreen
        requestedLiveId={
          requestedLiveId
        }
      />
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.content}>
        {renderScreen()}
      </View>

      <BottomNav
        activeTab={activeTab}
        onTabPress={changeTab}
        emitState={
          activeTab === "emit"
            ? emitState
            : "idle"
        }
        onEmitAction={() => {
          setEmitActionRequest(
            (current) => current + 1,
          );
        }}
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
    backgroundColor:
      colors.background,
  },

  content: {
    flex: 1,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      colors.background,
  },
});
