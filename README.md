# Stuart CourierAPI Technical Test

## Stack

### Language:

TypeScript on Node

### Framework:

[ExpressJS](https://expressjs.com/) - Lightweight and suitable for rapid development of a small project

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
$ curl -X GET http://localhost:3000/couriers/lookup -H "Content-Type: application/json" --data '
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
$ curl -X PATCH http://localhost:3000/couriers/1234 -H "Content-Type: application/json" --data '
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

Fetch a specific a courier by ID:

```
$ curl -X GET http://localhost:3000/couriers/1234 -H "Content-Type: application/json"
```

200 Response:

```json
{
  "id": 1234,
  "max_capacity": 45,
  "available_capacity": 0
}
```

---

## Improvements and Notes

- Retrospectively, I'm not sure that the solution PATCH /couriers/:id with the new available capacity is the best possible solution. The idea was that a consumer of the API could hypothetically lookup a list of available couriers and then once if the couriers was "dispatched" the available capacity would be lowered depending on requirements. However, it is probably a bad choice to expose tha capability to just update the available capacity of a courier directly. It would probably be better to alter this setup so that the request is made to try and "dispatch" a courier with the "required capacity" and have the available capacity become the difference of what is currently and available and the required capacity.

- There is a quite an obvious dependency on Sequelize as the ORM provider. If given more time I would work on a way of abstracting this in such a way that the project is not necessarily "locked-in" to one ORM provider (or any kind ORM / ODM etc.) if for whatever reason it might need to change.

- Testing wise I have written a number of tests for the main functionality of the application however this would ideally be extended to handle less obvious use cases that I may have missed. Potentially it would be a good idea to make use of code coverage tools to see what has not been tested yet as well

- My lack of familiarity with Sequelize definitely slowed me down in this process and it's possible I have not setup the project using the most common / idiomatic design patterns while using this library.

- Given more time I would have also worked more on the solution for attempting to avoid race conditions while fetching and updating couriers capacities. I am pretty sure I have made the right first steps by introducing transactions with locks but it would require more time and research to come up with suitable tests for the solution

- The Error handling was a good start but I think there could be improvements made especially with regards to validating inputs and providing useful feedback to the API user.

- Ideally I would also add some kind of interactive API documentation like swagger
