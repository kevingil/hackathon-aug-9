from flask import Flask  # type: ignore
from app.config import Config  # type: ignore
from app.extensions import db, bcrypt, jwt, migrate, socketio, blacklist  # type: ignore
from app.routes import register_routes  # type: ignore
from flask_cors import CORS  # type: ignore


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blacklist


def create_app():
    app = Flask(__name__)
    print(f"DBURL: {Config.SQLALCHEMY_DATABASE_URI}")
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
    )

    with app.app_context():
        from app.user import models as user_models  # type: ignore

    register_routes(app)
    return app
