import { TouchableWithoutFeedback, Keyboard, SafeAreaView } from "react-native";
import { get_buildings } from "../firebase/firebase_api";
import { useGlobal } from "../context/GlobalContext";
import LoginView from "../components/LoginView";
import { get_user_if_login } from "../utils";
import { router } from "expo-router";
import { useEffect } from "react";

const index = () => {
  const { setUser, setBuildings } = useGlobal();

  useEffect(() => {
    get_buildings().then(setBuildings);
    get_user_if_login().then(u => {
      if (!u) return;

      setUser(u);
      router.replace("/map");
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <LoginView />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default index;
