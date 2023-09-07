import type { PlasmoMessaging } from '@plasmohq/messaging';

import { supabase } from '@/lib/boundaries/supabase';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  supabase.auth.onAuthStateChange((event, session) => {
    // eslint-disable-next-line no-console
    console.log(event, session);
  });

  await supabase.auth.setSession(req.body);

  res.send({ success: true });
};

export default handler;
