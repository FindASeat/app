import { View, Text } from "react-native";
import { useGlobal } from "../../context/GlobalContext";

const me = () => {
  const { user } = useGlobal();

  return (
    <View>
      <Text>profile</Text>

      <Text>{user?.username || "No User"}</Text>
    </View>
  );
};

export default me;
