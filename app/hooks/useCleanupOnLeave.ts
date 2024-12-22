import { useEffect } from 'react';
import axios from 'axios';

const useCleanupOnLeave = (phoneNumber: string | null, isVerifying: boolean) => {
  useEffect(() => {
    const cleanup = async () => {
      if (phoneNumber && isVerifying) {
        try {
          await axios.post('/api/register/delete', {
            phoneNumber: phoneNumber
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      cleanup();
      // Cancel the event
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  }, [phoneNumber, isVerifying]);
};

export default useCleanupOnLeave;