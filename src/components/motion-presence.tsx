"use client";

import { type ReactNode, useEffect, useEffectEvent, useState } from "react";

type Props = {
  show: boolean;
  children: ReactNode;
  className?: string;
  duration?: number;
  contentKey?: string | number;
  role?: "status" | "alert";
  ariaLive?: "polite" | "assertive";
};

export function MotionPresence({ show, children, className = "", duration = 180, contentKey = 0, role, ariaLive }: Props) {
  const [rendered, setRendered] = useState(show);
  const [visible, setVisible] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const syncDisplayedChildren = useEffectEvent(() => setDisplayedChildren(children));

  useEffect(() => {
    let enterFrame = 0;
    let visibleFrame = 0;
    let exitTimer = 0;

    if (show) {
      enterFrame = window.requestAnimationFrame(() => {
        syncDisplayedChildren();
        setRendered(true);
        visibleFrame = window.requestAnimationFrame(() => setVisible(true));
      });
    } else if (rendered) {
      enterFrame = window.requestAnimationFrame(() => setVisible(false));
      exitTimer = window.setTimeout(() => setRendered(false), duration);
    }

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.cancelAnimationFrame(visibleFrame);
      window.clearTimeout(exitTimer);
    };
  }, [contentKey, duration, rendered, show]);

  if (!rendered) return null;

  return <div
    className={`motion-presence ${visible ? "is-visible" : "is-leaving"} ${className}`.trim()}
    role={role}
    aria-live={ariaLive}
    aria-hidden={!visible}
  >
    {show ? children : displayedChildren}
  </div>;
}
