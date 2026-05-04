import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type State = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
};

export const useAdminAuth = (): State & { refresh: () => void } => {
  const [state, setState] = useState<State>({ loading: true, session: null, isAdmin: false });

  const checkRole = async (session: Session | null) => {
    if (!session) {
      setState({ loading: false, session: null, isAdmin: false });
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    setState({ loading: false, session, isAdmin: !error && !!data });
  };

  useEffect(() => {
    // 1) Subscribe FIRST (then fetch initial session)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer to avoid deadlocks per Supabase guidance
      setTimeout(() => checkRole(session), 0);
    });
    supabase.auth.getSession().then(({ data }) => checkRole(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = () => supabase.auth.getSession().then(({ data }) => checkRole(data.session));
  return { ...state, refresh };
};