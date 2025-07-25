# Leave Request System

This repository belongs to a leave requests management portal with both backend and frontend codes.

The main intention of this project is to experiment with differnt types of tests including unit tests, integration tests and end-to-end tests for both backend and frontend where possible.

Make sure you run both the backend and the frontend project before running the tests. 

To run the backend project, use the code below:

```shell
cd src/back && py manage.py runserver
```

To run the frontend project, use the code below:

```shell
cd src/front && npm run dev
```



---

##### Running the Tests

To find the coverage of backend tests run the code below:

```shell
cd src/back && pytest --cov=. --cov-report=term --cov-report=html
```

To run frontend tests, run the code below(end-to-end tests):

```shell
cd src/front && npm run test:e2e
```

To find the coverage of frontend tests run the code below(unit tests):

```shell
cd src/front && npm run test -- --coverage --silent
```
