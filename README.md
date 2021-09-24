# CashScheduler Web

The web application providing a convenient way of tracking and monitoring personal finances.

## Overview

The project is developed in 4 parts (Server, Database, Client, and Salesforce organization).
- the server is the ASP .NET Core application. GraphQL is used for the API
- the Microsoft SQL server is used for the database
- the client is a React application. Uses Apollo Client for communication with the server GraphQL API
- the Salesforce organization is used for handling some clients' information, building reports and dashboards, notifying clients via emails

## Run & Test

Instructions for running and testing out the project

### Prerequisites

In order to be able to run the project you need the following:
- Git
- Docker (with docker-compose support)
- .NET SDK (at least v3.1)
- Already configured Salesforce organization (can be omited if you don't need its functionality)

[How to configure the Salesforce organization?](https://github.com/IlyaMatsuev/Cash-Scheduler-Web/tree/main/src/sf)

### Running

1. Pull the project
```bash
git clone https://github.com/IlyaMatsuev/Apex-GraphQL-Client.git
```
2. Go to the root
```bash
cd ./cash-scheduler-web
```
3. Generate the HTTPS certificate and trust it
```bash
./https/generate-cert.sh
```
4. Pull the necessary docker images
```bash
docker pull ilyamatsuev/cash-scheduler-server
docker pull ilyamatsuev/cash-scheduler-client
docker pull mcr.microsoft.com/azure-sql-edge
```
5. Open a separate terminal in the same folder and start up the database
```bash
docker compose up cash-scheduler-db
```
6. Open a separate terminal in the same folder and start up client and server
```bash
docker compose up cash-scheduler-server cash-scheduler-client
```
7. Go to `https://localhost:3000/` and try

### Building

You can use the complete docker-compose file to build server and client images if you made any changes to the source code

```bash
docker compose build cash-scheduler-server cash-scheduler-client
```

## Documentation

The documentation can be found [here](https://github.com/IlyaMatsuev/Cash-Scheduler-Web/tree/main/docs). There are some demo recordings, a few diagrams, front- and back- end documentation.

### Questions

If you have any questions regarding this project, please contact me by email provided in the GitHub profile. No issues or discussions will be maintained for this repository.

## License

[MIT](https://github.com/IlyaMatsuev/Cash-Scheduler-Web/blob/main/LICENSE)
