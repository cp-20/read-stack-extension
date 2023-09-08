import type { PlasmoMessaging } from '@plasmohq/messaging';

import { supabase } from '@/lib/boundaries/supabase';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  await supabase.auth.setSession(req.body);

  res.send({ success: true });
};

export default handler;
