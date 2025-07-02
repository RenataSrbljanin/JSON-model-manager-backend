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

## 🔌 API Endpoints Overview

<h3>/api/computers</h3>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>GET</code></td>
      <td><code>/</code></td>
      <td>Get all computers</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/&lt;idn&gt;</code></td>
      <td>Get a specific computer by ID</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/</code></td>
      <td>Create a new computer</td>
    </tr>
    <tr>
      <td><code>PUT</code></td>
      <td><code>/&lt;idn&gt;</code></td>
      <td>Update existing computer</td>
    </tr>
    <tr>
      <td><code>DELETE</code></td>
      <td><code>/&lt;idn&gt;</code></td>
      <td>Delete computer by ID</td>
    </tr>
  </tbody>
</table>

<br />

<h3>/api/installed-software</h3>

<p>Standard CRUD operations for managing installed software objects:</p>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/</code></td><td>Get all software entries</td></tr>
    <tr><td><code>GET</code></td><td><code>/&lt;idn&gt;</code></td><td>Get one software entry by ID</td></tr>
    <tr><td><code>POST</code></td><td><code>/</code></td><td>Create new software entry</td></tr>
    <tr><td><code>PUT</code></td><td><code>/&lt;idn&gt;</code></td><td>Update existing software entry</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/&lt;idn&gt;</code></td><td>Delete software entry</td></tr>
  </tbody>
</table>

<br />

<h3>/software-data-links</h3>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/</code></td><td>Get all software-data links</td></tr>
    <tr><td><code>GET</code></td><td><code>/&lt;software_idn&gt;/&lt;data_type_id&gt;</code></td><td>Get one by composite key</td></tr>
    <tr><td><code>POST</code></td><td><code>/</code></td><td>Create a new link</td></tr>
    <tr><td><code>PUT</code></td><td><code>/&lt;software_idn&gt;/&lt;data_type_id&gt;</code></td><td>Update existing link</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/&lt;software_idn&gt;/&lt;data_type_id&gt;</code></td><td>Delete link</td></tr>
  </tbody>
</table>
