import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { VideoModal } from "./VideoModal";
import { videos } from "@/lib/videos";

type OpenOpts = { poster?: string };
type Ctx = { open: (id: string, title?: string, opts?: OpenOpts) => void; close: () => void };
const VideoCtx = createContext<Ctx>({ open: () => {}, close: () => {} });

export const useVideo = () => useContext(VideoCtx);

type State = { id: string | null; title?: string; poster?: string };

const HASH_PREFIX = "#video=";

const writeHash = (id: string | null) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (id) {
    url.hash = `video=${id}`;
  } else if (url.hash.startsWith(HASH_PREFIX)) {
    url.hash = "";
  } else {
    return;
  }
  window.history.replaceState(null, "", url.toString());
};

const readHashId = (): string | null => {
  if (typeof window === "undefined") return null;
  const h = window.location.hash;
  if (!h.startsWith(HASH_PREFIX)) return null;
  const id = h.slice(HASH_PREFIX.length);
  return id || null;
};

const lookup = (id: string) => videos.find((v) => v.id === id);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>({ id: null });

  const open = useCallback((id: string, title?: string, opts?: OpenOpts) => {
    const meta = lookup(id);
    setState({
      id,
      title: title || meta?.title,
      poster: opts?.poster || meta?.poster,
    });
    writeHash(id);
  }, []);

  const close = useCallback(() => {
    setState({ id: null });
    writeHash(null);
  }, []);

  // Restore from URL on first load
  useEffect(() => {
    const id = readHashId();
    if (id) {
      const meta = lookup(id);
      setState({ id, title: meta?.title, poster: meta?.poster });
    }
  }, []);

  // React to back/forward
  useEffect(() => {
    const onPop = () => {
      const id = readHashId();
      if (id) {
        const meta = lookup(id);
        setState({ id, title: meta?.title, poster: meta?.poster });
      } else {
        setState({ id: null });
      }
    };
    window.addEventListener("hashchange", onPop);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("hashchange", onPop);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return (
    <VideoCtx.Provider value={{ open, close }}>
      {children}
      <VideoModal videoId={state.id} title={state.title} poster={state.poster} onClose={close} />
    </VideoCtx.Provider>
  );
};
