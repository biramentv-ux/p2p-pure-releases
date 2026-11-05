/* Retires the service worker the messenger used to register at the site root. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const root = self.registration.scope; // e.g. https://host/
      for (const name of await caches.keys()) {
        // workbox names its caches after the scope: only the root scope is the old app
        if (name.endsWith(root) || name === root) await caches.delete(name);
      }
    } catch (e) { /* nothing to clear */ }
    await self.registration.unregister();
    const tabs = await self.clients.matchAll({ type: "window" });
    for (const tab of tabs) tab.navigate(tab.url);
  })());
});
