import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { createTable, deleteTable, getDBConnection } from "./services/database";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const InitDBTable = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    InitDBTable();
  }, [InitDBTable]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

