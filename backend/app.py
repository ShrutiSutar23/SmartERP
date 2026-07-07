import os
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask
from extensions import db
from routes import register_routes
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy import create_engine


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def resolve_database_uri():
    configured = (os.getenv("DATABASE_URL") or "").strip()
    if configured.startswith("postgresql://") or configured.startswith("postgres://"):
        try:
            engine = create_engine(configured)
            with engine.connect() as connection:
                connection.execute("SELECT 1")
            return configured
        except Exception:
            pass

    if configured and not configured.startswith("postgresql://") and not configured.startswith("postgres://"):
        return configured

    return f"sqlite:///{os.path.join(BASE_DIR, 'smart_erp.db')}"


app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=20)
app.config["SQLALCHEMY_DATABASE_URI"] = resolve_database_uri()
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}

jwt = JWTManager(app)

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Route not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error", "details": str(e)}), 500

db.init_app(app)
register_routes(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)