# Leave Request System

Full‑stack leave management portal built for a Software Testing course to showcase disciplined testing across backend and frontend layers.

## Highlights
- Role-based experience for employees and supervisors with dedicated dashboards, leave creation, approval/rejection, and remaining-balance tracking.
- Django REST Framework API with token and session authentication; React Router v7 + TypeScript + Material UI on the client.
- Validation on overlapping dates and leave quotas baked into the domain models.
- Comprehensive tests: backend unit/integration (models, serializers, permissions, API views), frontend unit/UI tests, and Selenium end-to-end flows that drive the real UI.
- Lightweight local setup (SQLite, Vite dev server) so reviewers can run the project quickly.

## Project Structure
- `src/back/`: Django app exposing the REST API (`app/api`) and pytest suite.
- `src/front/`: React Router app using MUI components plus Jest/RTL for unit tests and Selenium WebDriver for end-to-end tests.
- `leave-request-sys-erd.drawio`: Entity relationship diagram used during design.

## Running the App
Make sure you have Python 3.12+ and Node 20+ available.

**Backend**
```bash
cd src/back
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend**
```bash
cd src/front
npm install
npm run dev  # Vite/React Router dev server
```

## Testing Strategy
All tests expect both servers to be running.

- **Backend coverage (unit + integration):**
  ```bash
  cd src/back
  pytest --cov=. --cov-report=term --cov-report=html
  ```
- **Frontend unit/UI tests with coverage (Jest + React Testing Library):**
  ```bash
  cd src/front
  npm test -- --coverage --silent
  ```
- **End-to-end UI tests (Selenium WebDriver):**
  ```bash
  cd src/front
  npm run test:e2e
  ```
  Update `src/front/tests/e2e/constants.ts` if you need to point to a different `BASE_URL`, Chrome binary, or chromedriver path.

## Skills Demonstrated
- Ability to design a small but complete product (auth, roles, validation, dashboards).
- Strong testing mindset with layered coverage: model validations, API correctness, UI behavior, and real-browser journeys.
- Familiarity with modern tooling across the stack (Django REST, React Router v7, Vite, Jest/RTL, Selenium, coverage tooling).
