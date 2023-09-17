import SDKClient from './sdk/client.js';
import open from 'open';

const initialData = {
  pluginId: 'logi_pomodoro',
  pluginCode: "123",
  pluginVersion: "1.2.3"
};

const clientApp = new SDKClient(initialData);
clientApp.init();

clientApp.onTriggerAction = async ({ id, message }) => {
  if (message.actionId === 'start_mindtrics') {
    open('http://localhost:3000');
  }
};
