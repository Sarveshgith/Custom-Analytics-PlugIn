#  Centralized Analytics Microservice (Universal GET Tracker)

A plug-and-play analytics microservice designed to **log, track, and analyze GET requests** across any service or route. Works independently of your application structure — just POST request metadata to this service and query powerful aggregated insights on visitors, devices, countries, and more.

---

##  Features

* 🌐 Works with **any GET endpoint** — just send a tracking payload
* 📍 Captures IP, user-agent, referer, device, browser, OS, and geo-location
* 🔍 Aggregates **unique visitors**, total views, top devices & countries
* 📊 REST API to fetch **per-slug** and **global** analytics
* 📦 Easy to plug into existing backend services or proxies
* 📈 Designed as a **microservice** for scalable distributed architecture

---

## 🧱 Architecture

```text
+-----------+      GET /route       +--------------------+      POST /track       +----------------------------+
|  Browser  | ───────────────────▶  |  Any Service (A-Z)  | ────────────────────▶ |   Analytics Microservice    |
|  Client   |                      | (ImageHost, Blog,   |                      |   (Logs requests centrally) |
|           |                      |  FoodApp, etc.)     |                      +-------------┬----------------+
+-----------+                      +---------------------+                                    │
                                                                                              │
                                                                                              ▼
                                                                                     +------------------+
                                                                                     |   PostgreSQL DB  |
                                                                                     | (click metadata) |
                                                                                     +------------------+
                                                                                              │
                                                                                              ▼
                                                            GET /analytics or /analytics/:slug for reports
                                                                                              │
                                                                                              ▼
                                                                                   +---------------------------+
                                                                                   |   Analytics Summary API   |
                                                                                   | (views, devices, country) |
                                                                                   +---------------------------+

```
