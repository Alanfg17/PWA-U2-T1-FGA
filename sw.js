console.log('SW: Limpio');
const CACHE_STATIC_NAME = 'static-v1'
const CACHE_NAME = 'cache-v1'
const DYMAMIC_CACHE_NAME = 'dynamic-v1'
const CACHE_INMUTABLE_NAME = 'inmutable-v1'

function cleanCache(cacheName,sizeItems) {
    caches.open(cacheName)
        .then(cache =>{
            cache.keys().then(keys =>{
                console.log(keys)
                if (keys.length > sizeItems) {
                    cache.delete(keys[0].then(()=>{
                        cleanCache(cacheName,sizeItems)
                    }))
                }
            })
            
        })
}

self.addEventListener('install',(event) =>{
    //Crear el caché y almacenar el APPSHELL
    const promesaCache = caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll([
                '/PWA-U2-T1-FGA/',
                '/PWA-U2-T1-FGA/index.html',
                '/PWA-U2-T1-FGA/images/noticia1.png',
                '/PWA-U2-T1-FGA/images/noticia2.png',
                '/PWA-U2-T1-FGA/images/noticia3.png',
                '/PWA-U2-T1-FGA/images/noticia4.png',
                '/PWA-U2-T1-FGA/js/app.js'
            ])
        })

    const promInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => {
            return cache.addAll([
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
                'https://code.jquery.com/jquery-3.5.1.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js'
            ])
        })
    event.waitUntil(Promise.all([promesaCache,promInmutable]))
})

self.addEventListener('fetch',(event) =>{

    //2. Caché cith network fallback
    //Busca en caché y si no lo encuentra va a la red
    const respuestaCache = caches.match(event.request)
        .then(resp =>{
            if (resp) {
                return resp
            }
            console.log("No esta en caché ",event.request.url);

            return fetch(event.request)
                .then(respNet => {
                    caches.open(DYMAMIC_CACHE_NAME)
                        .then(cache =>{
                            cache.put(event.request,respNet).then(ok =>{
                                cleanCache(DYMAMIC_CACHE_NAME,10)
                            })
                            
                        })
                    return respNet.clone()
                })
        })
    event.respondWith(respuestaCache)

    //1. Only Caché
    //event.respondWith(caches.match(event.request))
})

