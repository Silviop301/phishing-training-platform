from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate # type: ignore
from flask_cors import CORS # type: ignore
from flask_mail import Mail # type: ignore

# Objetos globais
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__)
    
    # Configuração do banco de dados
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Zenith%403012012@localhost:5432/phishing_platform'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configuração CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Configuração Flask-Mail
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'cyberapps00@gmail.com'
    app.config['MAIL_PASSWORD'] = 'mgbc cbqi rqbo ljsd'
    app.config['MAIL_DEFAULT_SENDER'] = 'silviop301@gmail.com'

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    from .routes import main_routes
    app.register_blueprint(main_routes)

    return app
