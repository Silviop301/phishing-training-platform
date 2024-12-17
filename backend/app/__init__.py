from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate # type: ignore
from flask_cors import CORS # type: ignore
from flask_mail import Mail  # type: ignore # Importa Flask-Mail

# Objetos globais
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()  # Inicializa o objeto Flask-Mail

def create_app():
    app = Flask(__name__)
    
    # Configuração do banco de dados
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Zenith%403012012@localhost:5432/phishing_platform'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configurações do servidor de e-mail (exemplo com Gmail)
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'silviop301@gmail.com'  # Substitua pelo seu e-mail
    app.config['MAIL_PASSWORD'] = 'fjox benc lmyh zoqw'  # Substitua pela sua senha

    # Inicialização dos objetos
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    CORS(app)

    # Registro de Blueprints
    from .routes import main_routes
    app.register_blueprint(main_routes)

    return app
