const cacheName = "Giffish";
const appVersion = "0.0.1";

// Cache all the files to make a PWA
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      // You can add more files as your app grows
      return cache.addAll(["./", "./index.html", "./manifest.json", "./icons/logo.png", "./styles.css"]);
    })
  );
});

// from Microsoft
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
    }
  })());
});