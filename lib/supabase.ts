/**
 * @fileoverview Supabase client configuration for client-side usage
 * 
 * This module exports a Supabase client instance configured with the anon key.
 * This client is safe to use in client-side components as it uses the public
 * anon key with Row Level Security (RLS) policies.
 * 
 * For server-side operations requiring elevated permissions, use the service
 * role key directly in API routes or server components.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client instance for client-side usage
 * 
 * Uses the public anon key which respects Row Level Security policies.
 * Safe to use in React components and client-side code.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

