import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { VideoModal } from "./VideoModal";

type Ctx = { open: (id: string, title?: string) => void };
const VideoCtx = createContext<Ctx>({ open: () => {} });

export const useVideo = () => useContext(VideoCtx);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{ id: string | null; title?: string }>({ id: null });
  const open = useCallback((id: string, title?: string) => setState({ id, title }), []);
  const close = useCallback(() => setState({ id: null }), []);
  return (
    <VideoCtx.Provider value={{ open }}>
      {children}
      <VideoModal videoId={state.id} title={state.title} onClose={close} />
    </VideoCtx.Provider>
  );
};