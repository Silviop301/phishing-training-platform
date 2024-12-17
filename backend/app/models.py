from . import db
from datetime import datetime

# Modelo Campaign
class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email_subject = db.Column(db.String(255), nullable=False)
    email_body = db.Column(db.Text, nullable=False)
    target_emails = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    clicks = db.relationship('Click', backref='campaign', lazy=True)

# Modelo Click
class Click(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    clicked_at = db.Column(db.DateTime, default=datetime.utcnow)
