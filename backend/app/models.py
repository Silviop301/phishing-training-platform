from . import db

class Campaign(db.Model):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email_subject = db.Column(db.String(200), nullable=False)
    email_body = db.Column(db.Text, nullable=False)
    target_emails = db.Column(db.Text, nullable=False)  # Lista de e-mails como string separada por vírgula
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f"<Campaign {self.name}>"
