import os
from dotenv import load_dotenv
from flask import Flask
from extensions import db
from routes import register_routes

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}

db.init_app(app)
register_routes(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)