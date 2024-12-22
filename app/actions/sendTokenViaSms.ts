import axios from 'axios';
import { getVerificationTokenByNumber } from './getVerificationTokenByNumber';

const sendTokenViaSms = async (phoneNumber: string, token: string) => {
  // const token = await getVerificationTokenByNumber(phoneNumber);

  const username = process.env.MELIPAYAMAK_USERNAME;
  const password = process.env.MELIPAYAMAK_PASSWORD;
  const bodyId = process.env.MELIPAYAMAK_BODYID;
  const text = token;
  const to = phoneNumber;

  if (!token){
    throw new Error('Token not found');
  }

  const url = `http://api.payamak-panel.com/post/Send.asmx/SendByBaseNumber2?username=${username}&password=${password}&text=${text}&to=${to}&bodyId=${bodyId}`;

  try {
    await axios.get(url);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export default sendTokenViaSms;