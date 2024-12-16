from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configurações básicas
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///phishing.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Rotas
    from .routes import main_routes
    app.register_blueprint(main_routes)

    return app
