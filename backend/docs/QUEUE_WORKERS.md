## Running Laravel queue workers with Redis

This project supports Redis-backed queue workers. Below are example Supervisor and systemd configs and recommended commands to keep workers running and auto-restarting.

Checklist

-   Ensure `QUEUE_CONNECTION=redis` in your `.env`.
-   Ensure Redis is running and reachable (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` in `.env`).
-   Install PHP extensions required (phpredis or predis). `.env` here uses `REDIS_CLIENT=phpredis`.

Supervisor example (recommended on many Linux servers)

1. Install supervisor (Ubuntu/Debian):

    sudo apt update
    sudo apt install supervisor

2. Create a config file: `/etc/supervisor/conf.d/cms-queue.conf`

```
[program:cms-queue-worker]
command=/usr/bin/php /home/abdelrahman/projects/cms/backend/artisan queue:work redis --sleep=3 --tries=3 --queue=default
process_name=%(program_name)s_%(process_num)02d
numprocs=2
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/cms-queue-worker.log
stopwaitsecs=3600
environment=APP_ENV="production",HOME="/var/www"
```

3. Reload supervisor and start:

    sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl start cms-queue-worker:\*

systemd example (alternative)

1. Create `/etc/systemd/system/cms-queue.service`

```
[Unit]
Description=Laravel Queue Worker
After=network.target redis.service

[Service]
User=www-data
Group=www-data
Restart=always
RestartSec=3
ExecStart=/usr/bin/php /home/abdelrahman/projects/cms/backend/artisan queue:work redis --sleep=3 --tries=3 --queue=default
TimeoutStopSec=3600

[Install]
WantedBy=multi-user.target
```

2. Enable and start:

    sudo systemctl daemon-reload
    sudo systemctl enable --now cms-queue.service

Supervisor vs systemd

-   Use Supervisor if you need multiple process instances without extra unit files (numprocs). Use systemd for simpler single-service setups.

Health & monitoring

-   Use `supervisorctl status` or `systemctl status cms-queue.service` to inspect.
-   Configure log rotation for `/var/log/cms-queue-worker.log`.

Local development

-   You can run a worker in development with:

    php artisan queue:work redis --tries=1 --sleep=3

Or run the `dev` npm script (defined in `composer.json`) which starts a queue listener during development.

Tips

-   Use `queue:restart` when deploying to gracefully reload workers after a new release.
-   If you use Horizon (not included here), prefer it to manage Redis queues with metrics.
