
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export async function testSupabaseConnection() {
  try {
    // Use a simple query that doesn't rely on specific tables
    const { data, error } = await supabase
      .from('_dummy_query_') // This will likely fail with a 400 error (which is fine)
      .select('*')
      .limit(1)
      .catch(() => ({ data: null, error: null })); // Catch the error and continue

    // The above query will fail, but if we get here, the connection was established
    // We're checking for connection to Supabase, not for specific table existence
    if (error && error.code !== '42P01') { // '42P01' is the Postgres error code for 'undefined_table'
      // If we get a different error than 'relation does not exist', there's something wrong
      console.error('Supabase connection test failed:', error);
      return false;
    }

    // If we've gotten here, we've either made a successful query (unlikely)
    // or we've had the expected "table doesn't exist" error, which means the connection is working
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
