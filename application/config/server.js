({
  host: '0.0.0.0',
  balancer: 8000,
  protocol: 'http2',
  ports: [8001, 8002],
  nagle: false,
  timeouts: {
    bind: 2000,
    start: 30000,
    stop: 5000,
    request: 5000,
    watch: 1000,
<<<<<<< HEAD
    test: 10000,
=======
    test: 60000,
>>>>>>> 690cf409817035239ff95bb7fe7bde40addb2ff0
  },
  queue: {
    concurrency: 1000,
    size: 2000,
    timeout: 3000,
  },
  scheduler: {
    concurrency: 10,
    size: 2000,
    timeout: 3000,
  },
  workers: {
    pool: 2,
    wait: 2000,
    timeout: 5000,
  },
  cors: {
    origin: '*',
  },
});
