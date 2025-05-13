# Docker E-Commerce Override

## 🚀 Project Goal

The goal of the **Docker E-Commerce Override** project is to create a microservice-based e-commerce application with an admin panel, containerized using Docker and managed via `docker-compose` with separation into `main.yaml`, `dev.override.yaml`, `prod.override.yaml`, and `networks.yaml`.

The project provides:

* Full management of users and orders through an admin panel.
* JWT authorization.
* A pluggable microservice architecture with testing and deployment support.
* Dev and prod versions (e.g., mounted volumes vs. static files).

## 🌐 Tech Stack

* **Backend:** Node.js (Express), Prisma, PostgreSQL
* **Frontend:** React + Vite + Tailwind CSS
* **Reverse Proxy:** Nginx (gateway)
* **Testing:** TestContainers, Jest
* **Management:** Docker Compose with multiple configuration files

## 🔗 Project Structure

```
docker_ecommerce_override/
├── compose/
│   ├── main.yaml
│   ├── dev.override.yaml
│   ├── prod.override.yaml
│   ├── networks.yaml
├── common/
│   └── base.yaml             # base configuration shared between setups - in this case name of stack
├── services/
│   ├── gateway/        # Nginx reverse proxy
│   ├── auth/           # Login, JWT generation
│   ├── users/          # Users CRUD (Express)
│   ├── orders/         # Orders CRUD (Express)
│   ├── db/             # PostgreSQL database
│   └── frontend/       # React (Vite) frontend
├── secrets/            # JWT and DB secret files
├── tests/              # e2e tests with TestContainers
└── README.md           # Project documentation
```

## 🌡️ Key Features

### Frontend

* Login and registration pages
* Admin panel with tabs:

  * **Dashboard** (default)
  * **Users** (CRUD for users)
  * **Orders** (CRUD for orders)
* Forms handled with React Hook Form
* The frontend is a completely original creative addition by the author and an optional enhancement to the project. All API functionality can be freely tested using Postman or a browser without relying on the frontend.
* During development, the frontend is maintained in a separate container due to testing issues. In production, it is intended to be served as a static build within the Nginx container.

### Backend

* Microservices `auth`, `users`, `orders` with separate ports
* Prisma for database management (schema defined in auth)
* JWT generated in `auth`, validated in `users` and `orders`
* PostgreSQL database in a container
* The backend services include simplified logic and design patterns for educational purposes. They are not fully tested or validated, as the main focus of this project is on containerization and service design from a DevOps perspective rather than a pure development one.

### Gateway (Nginx)

* Proxy under `/api/auth/`, `/api/users/`, `/api/orders/`
* CORS support for all endpoints
* Frontend routing

## ⚙️ Running (dev)

From the project root directory:

```bash
docker compose -f compose/main.yaml -f compose/networks.yaml -f compose/dev.override.yaml up --build
```

Frontend launched separately:

```bash
docker run -d \
  --name frontend \
  --network compose_frontend_net \
  -p 5173:5173 \
  -v "$PWD/services/frontend":/app \
  -v /app/node_modules \
  frontend
```

## 🔍 Testing

Integration and e2e tests are run from the `tests/` folder using:

* TestContainers for spinning up test containers
* HTTP communication to validate `/login`, `/users`, `/orders` endpoints
* Post-seed functionality verification

## 📌 Deployment (prod)

The `prod.override.yaml` file enables:

* Frontend build into static files
* Serving via Nginx (gateway)
* Running the system as one integrated setup

## 💡 Note

During development, frontend fetches should target `/api/...`, and Nginx proxy must handle trailing slashes (`/api/users/`).

---

Ready for further development and production deployment ✅
