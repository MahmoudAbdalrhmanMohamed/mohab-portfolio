self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache
        .addAll([
          "/index.html",
          "/assets/styles.css",
          "/assets/script.js",
          "/assets/profile.jfif",
          "/manifest.json",
        ])
        .catch(() => {
          // Continue even if caching fails
          console.log("Cache installation failed, continuing...");
        });
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clonedResponse = response.clone();
        caches.open("v1").then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      }),
  );
});
