import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

export function configurarOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      const hayInternet = Boolean(state.isConnected && state.isInternetReachable !== false);
      setOnline(hayInternet);
    });
  });
}
