import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve static assets from public with proper headers
  app.get("/manifest.webmanifest", (req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(process.cwd(), "public/manifest.webmanifest"));
  });

  app.get("/manifest.json", (req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(process.cwd(), "public/manifest.json"));
  });

  app.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(process.cwd(), "public/sw.js"));
  });

  app.get("/registerSW.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(process.cwd(), "public/registerSW.js"));
  });

  app.use(express.static(path.join(process.cwd(), "public")));

  // Clean, zero-error Vite client module for development (eliminates WebSocket HMR connection errors in container)
  const customViteClient = `
const sheetsMap = new Map();
if (typeof document !== 'undefined') {
  document.querySelectorAll('style[data-vite-dev-id]').forEach((el) => {
    sheetsMap.set(el.getAttribute('data-vite-dev-id'), el);
  });
}
const cspNonce = typeof document !== 'undefined' ? document.querySelector('meta[property=csp-nonce]')?.nonce : undefined;
let lastInsertedStyle;

export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    if (cspNonce) {
      style.setAttribute('nonce', cspNonce);
    }
    if (!lastInsertedStyle) {
      document.head.appendChild(style);
      setTimeout(() => {
        lastInsertedStyle = undefined;
      }, 0);
    } else {
      lastInsertedStyle.insertAdjacentElement('afterend', style);
    }
    lastInsertedStyle = style;
  } else {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}

export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}

export class ErrorOverlay extends (typeof HTMLElement !== 'undefined' ? HTMLElement : Object) {}

class HMRContext {
  constructor(ownerPath) {
    this.ownerPath = ownerPath;
    this.data = {};
  }
  accept(deps, callback) {
    if (typeof deps === 'function') deps();
    else if (typeof callback === 'function') callback();
  }
  acceptExports(deps, callback) {
    if (typeof callback === 'function') callback();
  }
  dispose() {}
  prune() {}
  decline() {}
  invalidate() {}
  on() {}
  off() {}
  send() {}
}

export function createHotContext(ownerPath) {
  return new HMRContext(ownerPath);
}

export function injectQuery(url, queryToInject) {
  if (url[0] !== '.' && url[0] !== '/') {
    return url;
  }
  const pathname = url.replace(/[?#].*$/, '');
  const { search, hash } = new URL(url, 'http://vite.dev');
  return \`\${pathname}?\${queryToInject}\${search ? '&' + search.slice(1) : ''}\${hash || ''}\`;
}
`;

  app.get("/@vite/client", (req, res) => {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.send(customViteClient);
  });

  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
