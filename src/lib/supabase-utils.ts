
import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')  // Replace with an existing table in your project
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Unexpected error during Supabase connection test:', err);
    return false;
  }
}

// Optional: Add a connection status hook
export function useSupabaseConnectionStatus() {
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await testSupabaseConnection();
      setIsConnected(connectionStatus);
    };

    checkConnection();
  }, []);

  return isConnected;
}
