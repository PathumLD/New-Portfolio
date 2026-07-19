import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'pathumlk.diz@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL or VITE_SUPABASE_URL.');
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Use the service role key only in local/server environments.');
}

if (!adminPassword) {
  throw new Error('Missing ADMIN_PASSWORD.');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (listError) {
  throw listError;
}

const existingUser = listData.users.find((user) => user.email?.toLowerCase() === adminEmail.toLowerCase());

if (existingUser) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: 'admin' },
  });

  if (error) throw error;
  console.log(`Updated admin user: ${adminEmail}`);
} else {
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: 'admin' },
  });

  if (error) throw error;
  console.log(`Created admin user: ${adminEmail}`);
}
