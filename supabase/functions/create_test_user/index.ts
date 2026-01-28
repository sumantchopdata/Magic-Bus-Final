import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingUser, error: checkError } = await adminClient.auth.admin.listUsers();

    if (checkError) throw checkError;

    const userExists = existingUser?.users?.some(
      (u) => u.email === 'Sangammagicbus@gmail.com'
    );

    if (userExists) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: 'Sangammagicbus@gmail.com',
      password: 'SangamMagicbus',
      email_confirm: true,
    });

    if (createError) throw createError;

    if (newUser?.user?.id) {
      await adminClient.from('student_profiles').insert([{ user_id: newUser.user.id }]);

      await adminClient.from('student_progress').insert([{ student_id: newUser.user.id }]);
    }

    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
