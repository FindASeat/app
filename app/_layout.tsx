import { setNotificationHandler } from 'expo-notifications';
import { Slot } from 'expo-router';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const layout = () => {
  return <Slot />;
};

export default layout;
