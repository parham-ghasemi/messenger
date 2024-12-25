
import getConversationById from '@/app/actions/getConversationById';
import getCurrentUser from '@/app/actions/getCurrentUser';
import PushNotifications from '@pusher/push-notifications-server';

const instanceId = process.env.Pusher_BEAMS_INSTANCE_ID || ''
const secretKey = process.env.Pusher_BEAMS_PRIMARY_KEY || ''

const beamsClient = new PushNotifications({
  instanceId: instanceId, // Replace with your Pusher Beams Instance ID
  secretKey: secretKey, // Replace with your Pusher Beams Secret Key
});

export async function POST(request: Request) {
  const body = await request.json()
  const { conversationId, message, sender } = body;
  const conversation = await getConversationById(conversationId);
  const users = conversation?.users;
  const currentUser = await getCurrentUser();

  console.log('Api Notify');
  try {
    if (users && users.length > 0) {
      for (const user of users) {
        if (user.id !== currentUser?.id)
          await beamsClient.publishToInterests([user.id], {
            web: {
              notification: {
                title: `New message from ${sender.name}`,
                body: message,
                deep_link: `https://messenger-delta-fawn.vercel.app/conversations/${conversationId}`,
              },
            },
          });
      }

    }
    // await beamsClient.publishToInterests(['notification'], {
    //   web: {
    //     notification: {
    //       title: 'New Notification',
    //       body: 'This is a test notification',
    //       deep_link: 'localhost:3000',
    //     },
    //   },
    // });

    return Response.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return Response.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}