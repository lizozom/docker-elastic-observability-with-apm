<h2 align="center">Observability with Elasticsearch</h2>
<h3 align="center">APM Node.js and APM RUM agents on <b>Docker</b></h2>

# Introduction
Elastic Stack (**ELK**) Docker Composition, with a Node.JS application reporting APM metrics and traces to APM Server.

Suitable for Demoing and MVPs.

Stack Version: [8.5.3](https://www.elastic.co/blog/whats-new-elastic-8-5-3) 🎉  - Based on [Official Elastic Docker Images](https://www.docker.elastic.co/)
> You can change Elastic Stack version by setting `ELK_VERSION` in `.env` file and rebuild your images. Any version >= 8.0.0 is compatible with this template.

Based on [elastdocker](https://github.com/sherifabdlnaby/elastdocker)

### Main Features 📜

- Node.JS application with Node APM Agent.
- Elasticsearch, configured as a Production Single Node Cluster.
- Security Enabled on Elasticsearch and Kibana.
- APM Server receives *Non secure* connections.
- Use Docker-Compose and `.env` to configure your entire stack parameters.
- Persist Elasticsearch's Keystore and SSL Certifications.

-----

# Requirements

- [Docker 20.05 or higher](https://docs.docker.com/install/)
- [Docker-Compose 1.29 or higher](https://docs.docker.com/compose/install/)
- 4GB RAM (For Windows and MacOS make sure Docker's VM has more than 4GB+ memory.)

# Setup

1. Clone the Repository
     ```bash
     git clone https://github.com/lizozom/docker-elastic-observability-with-apm.git
     ```
2. Initialize Elasticsearch Keystore and TLS Self-Signed Certificates
    ```bash
    $ make setup
    ```
    > **For Linux's docker hosts only**. By default virtual memory [is not enough](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html) so run the next command as root `sysctl -w vm.max_map_count=262144`
3. Start Elastic Stack
    ```bash
    $ make elk           <OR>         $ docker-compose up -d		<OR>		$ docker compose up -d
    ```
4. Navigate to the web application at [http://localhost:3000/](http://localhost:3000) to generate APM traces.

5. Visit Kibana at [https://localhost:5601/app/apm](https://localhost:5601/app/apm) to see the APM traces from our `webapp`

    Default Username: `elastic`, Password: `changeme`
    
    ![image](https://user-images.githubusercontent.com/3016806/209701277-29e6ce0e-c068-4679-9a7a-ada6982d648e.png)

# Configuration

* Some Configuration are parameterized in the `.env` file.
  * `ELASTIC_PASSWORD`, user `elastic`'s password (default: `changeme` _pls_).
  * `ELK_VERSION` Elastic Stack Version (default: `8.3.2`)
  * `ELASTICSEARCH_HEAP`, how much Elasticsearch allocate from memory (default: 1GB -good for development only-)
  * Other configurations which their such as cluster name, and node name, etc.
* Elasticsearch Configuration in `elasticsearch.yml` at `./elasticsearch/config`.
* Kibana Configuration in `kibana.yml` at `./kibana/config`.

### Setting Up Keystore

You can extend the Keystore generation script by adding keys to `./setup/keystore.sh` script. (e.g Add S3 Snapshot Repository Credentials)

To Re-generate Keystore:
```
make keystore
```

### Notes

- ⚠️ Elasticsearch HTTP layer is using SSL, thus mean you need to configure your elasticsearch clients with the `CA` in `secrets/certs/ca/ca.crt`, or configure client to ignore SSL Certificate Verification (e.g `--insecure` in `curl`).

- Makefile is a wrapper around `Docker-Compose` commands, use `make help` to know every command.

- Elasticsearch will save its data to a volume named `elasticsearch-data`

- Elasticsearch Keystore (that contains passwords and credentials) and SSL Certificate are generated in the `./secrets` directory by the setup command.

- Make sure to run `make setup` if you changed `ELASTIC_PASSWORD` and to restart the stack afterwards.

- **Important**: For Linux Users it's recommended to set the following configuration (run as `root`)
    ```
    sysctl -w vm.max_map_count=262144
    ```
    By default, Virtual Memory [is not enough](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html).

# License
[MIT License](https://raw.githubusercontent.com/sherifabdlnaby/elastdocker/master/LICENSE)
Copyright (c) 2022 Sherif Abdel-Naby

# Contribution

PR(s) are Open and Welcomed.
