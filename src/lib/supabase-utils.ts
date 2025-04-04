
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export async function testSupabaseConnection() {
  try {
    // Use a simple health check query instead of trying to query a specific table or RPC
    const { error } = await supabase.from('_non_existent_table_')
      .select('*')
      .limit(1)
      .single();

    // If we get here, it means the connection was established even if the query failed
    // We specifically want to catch table-not-found errors but not connection errors
    if (error && !error.message.includes('does not exist')) {
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
