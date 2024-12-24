import { Client } from '@pusher/push-notifications-web';

let beamsClient: Client | null = null;

if (typeof window !== 'undefined') {
  beamsClient = new Client({
    instanceId: '735344b7-970f-457e-a33c-95e1dbd93d7c',
  });
}

const startPusherBeams = async (userId: string) => {
  if (!beamsClient) {
    console.error('Pusher Beams client is not initialized');
    return;
  }

  try {
    await beamsClient.start();
    await beamsClient.addDeviceInterest(userId);
    console.log('Successfully registered and subscribed to notifications');
  } catch (error) {
    console.error('Error starting Pusher Beams:', error);
  }
};

export default startPusherBeams;