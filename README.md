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
## 🧰 Installation

<pre><code>git clone https://github.com/RenataSrbljanin/JSON-model-manager-backend
cd json-model-manager-backend
python -m venv venv
source venv/bin/activate     # or venv\Scripts\activate on Windows
pip install -r requirements.txt
</code></pre>

---

## ⚙️ Run the API

<pre><code>flask run
</code></pre>

<p>Or from Python directly:</p>

<pre><code>python run.py
</code></pre>

<p>The API will be available at: <a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>

---

## 🧪 Run Tests

<h4>Set environment (once):</h4>

<b>Windows:</b>

<pre><code>set FLASK_APP=app
set FLASK_ENV=testing
set PYTHONPATH=.
</code></pre>

<b>Linux / macOS:</b>

<pre><code>export FLASK_APP=app
export FLASK_ENV=testing
export PYTHONPATH=.
</code></pre>

<h4>Then run tests:</h4>

<pre><code>pytest
</code></pre>

---

## ✅ Sample Computer JSON

<pre><code class="json">{
  "idn": "comp123",
  "data": {"os": "Ubuntu", "version": "22.04"},
  "installed_software_idns": ["soft1", "soft2"],
  "stored_credentials": ["cred1"],
  "software_data_links": {"soft1": ["data1", "data2"]},
  "software_idn_mapping": {"soft1": "id1"},
  "network_idn": {"segment": "internal"},
  "provides_hardware_quota": 100.0,
  "used_hardware_quota": 25.0
}
</code></pre>

---

## 💡 Tech Stack Summary

<table>
  <tr>
    <td><strong>Framework</strong></td>
    <td>Flask</td>
  </tr>
  <tr>
    <td><strong>ORM</strong></td>
    <td>SQLAlchemy</td>
  </tr>
  <tr>
    <td><strong>Validation</strong></td>
    <td>Marshmallow</td>
  </tr>
  <tr>
    <td><strong>Testing</strong></td>
    <td>Pytest</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>SQLite (default)</td>
  </tr>
</table>

---

## 🤝 Contribution

<p>Want to contribute? Awesome! 🙌</p>

<ul>
  <li>Fork the repository</li>
  <li>Create a new branch <code>git checkout -b feature-name</code></li>
  <li>Commit your changes</li>
  <li>Push to your branch</li>
  <li>Open a pull request 🚀</li>
</ul>

---

## 📬 Contact

<ul>
  <li>📧 <a href="mailto:renatasrbljanin@gmail.com">renatasrbljanin@gmail.com</a></li>
  <li>🌐 <a href="https://github.com/RenataSrbljanin" target="_blank">GitHub: @RenataSrbljanin</a></li>
</ul>
