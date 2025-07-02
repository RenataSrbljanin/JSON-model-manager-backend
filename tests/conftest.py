# import pytest
# from app import create_app


# @pytest.fixture
# def app():
#     app = create_app()
#     app.config.update(
#         {
#             "TESTING": True,
#         }
#     )
#     return app


# @pytest.fixture
# def client(app):
#     return app.test_client()

import pytest
from app import create_app
from app.extensions import db as _db


@pytest.fixture(scope="module")
def app():
    app = create_app()
    app.config.update(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "JWT_SECRET_KEY": "test-secret",
        }
    )

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="module")
def client(app):
    return app.test_client()


@pytest.fixture(scope="function")
def session(app):
    with app.app_context():
        connection = _db.engine.connect()
        transaction = connection.begin()

        options = dict(bind=connection, binds={})
        sess = _db.create_scoped_session(options=options)

        _db.session = sess

        yield sess

        transaction.rollback()
        connection.close()
        sess.remove()
