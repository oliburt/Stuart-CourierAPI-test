# Stuart CourierAPI Technical Test

## Stack

### Framework:

[ExpressJS](https://expressjs.com/) - Lightweight and suitable for rapid development of a small project

### Language:

TypeScript on Node

### Testing Framework

[Jest](https://jestjs.io/) - Easy to setup and get started with minimal configuration. Integrated with the "ts-jest" for typescript.

### Database

SQLite - Lightweight for a project of this size. The choice of SQL based DB came down to the fact that, while there are not related data types in the current scope, I could envision this type of API being extended to include relational data (such as deliveries) and therefore making it a suitable choice. Additionally, using ACID compliant DB is a good idea for systems where you want to use transactions to help avoid race conditions.

### ORM

[Sequelize](https://sequelize.org/master/) - Useful to speed up development as well as provide additional help for managing table schemas and validations. A secondary benefit of using an ORM such a Sequelize that integrates with other SQL dbs means that it should be relatively easy to change db provider if required later.

### Additional

- Docker - Containerization of production build.
- Winston - For Logging.

---

## Running the server

### Option 1 - Docker

The Dockerfile can be found in the root of the repository.\
Navigate to the repository directory and build the container:

```
$ docker build -t <TAG_NAME> .
```

Then run the container:

```
$ docker run -p 3000:3000 <TAG_NAME>
```

Additionally, if deploying (or for testing purposes) add a volume to maintain your sqlite db:

```
$ docker run -p 3000:3000 -v <VOLUME_NAME>:/app/src/data/ <TAG_NAME>
```

Replace ports or <TAG_NAME> and <VOLUME_NAME> with suitable names for the machine.

### Option 2 - Local Development Server

This option requires node to be installed on the system. Node version should be at v12 or above.
Run the start script:

```
$ npm start
```

---

## The API

This API has been built primarily to accept and return JSON. There are four available endpoints:

| Ref | Method | Route            | Description                                                        |
| --- | ------ | ---------------- | ------------------------------------------------------------------ |
| 1   | GET    | /couriers/:id    | Fetch a single courier by a known ID                               |
| 2   | POST   | /couriers        | Insert a courier into the DB                                       |
| 3   | PATCH  | /couriers/:id    | Update the available capacity of a courier (by ID)                 |
| 4   | GET    | /couriers/lookup | Fetch a list of couriers that have the required capacity available |

Endpoint inputs (numbers map to the above):

1. N/A
2. Courier Data

| Name         | Type    | Optional | Additional                                                   |
| ------------ | ------- | -------- | ------------------------------------------------------------ |
| id           | Integer | True     | if not provided will use autoincremented id from DB provider |
| max_capacity | Integer | False    | Must be greater than zero                                    |

3. New Available Capacity of a courier

| Name               | Type    | Optional | Additional                                                                                      |
| ------------------ | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| available_capacity | Integer | False    | Must be greater than or equal to zero and less than or equal to the courier's maximum capacity. |

4. Capacity required from a courier

| Name              | Type    | Optional | Additional |
| ----------------- | ------- | -------- | ---------- |
| capacity_required | Integer | False    |            |

## Query Examples

Create a courier:

```
$ curl -X POST http://localhost:3000/couriers -H "Content-Type: application/json" --data '
{
  "id": 1234,
  "max_capacity": 45
}'
```

201 Response:

```json
{
  "id": 1234,
  "max_capacity": 45,
  "available_capacity": 45
}
```

Lookup couriers with required available capacity

```
$ curl -X GET http://localhost:3000/couriers/lookup --data '
{
  "capacity_required": 45
}'
```

200 Response:

```json
[
  {
    "id": 1234,
    "max_capacity": 45,
    "available_capacity": 45
  }
]
```

Update a couriers available capacity:

```
$ curl -X GET http://localhost:3000/couriers/1234 --data '
{
  "available_capacity": 0
}'
```

200 Response:

```json
{
  "id": 1234,
  "max_capacity": 45,
  "available_capacity": 0
}
```
