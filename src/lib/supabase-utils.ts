
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export async function testSupabaseConnection() {
  try {
    // Use a simple health check query instead of trying to query a specific table
    const { error } = await supabase.rpc('pg_stat_database_info');

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await testSupabaseConnection();
      setIsConnected(connectionStatus);
    };

    checkConnection();
  }, []);

  return isConnected;
}
