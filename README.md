<h1 align="center">💻 JSON Model Manager API</h1>

<p align="center">
  A Flask-based RESTful API for managing complex IT infrastructure models: computers, installed software, data mappings, and more.
</p>

<p align="center">
  <strong>Flask</strong> · 
  <strong>SQLAlchemy</strong> · 
  <strong>Marshmallow</strong> · 
  <strong>Pytest</strong> · 
  <strong>SQLite</strong>
</p>

<hr />

## 🚀 Features

<ul>
  <li>Modular Flask architecture using Blueprints</li>
  <li>SQLAlchemy ORM for relational data modeling</li>
  <li>Marshmallow for validation and (de)serialization</li>
  <li>Fully tested endpoints using <code>pytest</code></li>
  <li>JSON-based infrastructure entity modeling</li>
</ul>

---

## 📁 Project Structure

```plaintext
JSON-model-manager-backend/
│
├── app/
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Marshmallow schemas
│   ├── routes/                 # Blueprint route handlers
│   ├── extensions.py           # db, jwt, bcrypt, cors setup
│   └── __init__.py             # create_app()
│
├── tests/                      # Pytest test suite
├── README.md                   # This file
├── requirements.txt            # Python dependencies
└── run.py                      # Entrypoint
```
