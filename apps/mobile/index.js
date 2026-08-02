import { registerRootComponent } from 'expo';
import notifee from '@notifee/react-native';

import App from './App';
import { handleNotificationEvent } from './src/services/notificationService';

notifee.onBackgroundEvent(handleNotificationEvent);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
