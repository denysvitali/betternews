"use client";

import { useState } from "react";

/** Site icon with a letter fallback so rows never shift while it loads. */
export function Favicon({ host }: { host: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const letter = (host.replace(/^www\./, "")[0] || "?").toUpperCase();

  return (
    <span className="favicon" data-loaded={loaded} aria-hidden="true">
      {letter}
      {!failed && host.includes(".") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
          alt=""
          width={14}
          height={14}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
