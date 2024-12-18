
from flask import Blueprint, request, jsonify
from . import db, mail
from .models import Campaign
from flask_mail import Message # type: ignore

main_routes = Blueprint('main', __name__)

# Rota para criar campanhas
@main_routes.route('/campaigns', methods=['POST'])
def create_campaign():
    data = request.json

    # Validação dos dados recebidos
    required_fields = ['name', 'email_subject', 'email_body', 'target_emails']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    if not isinstance(data['target_emails'], list) or not all(isinstance(email, str) for email in data['target_emails']):
        return jsonify({"error": "'target_emails' deve ser uma lista de strings."}), 400

    # Criar nova campanha
    campaign = Campaign(
        name=data['name'],
        email_subject=data['email_subject'],
        email_body=data['email_body'],
        target_emails=",".join(data['target_emails'])  # Lista de e-mails separados por vírgula
    )
    db.session.add(campaign)
    db.session.commit()

    return jsonify({
        "message": "Campanha criada com sucesso!",
        "campaign_id": campaign.id
    }), 201

# Rota para listar campanhas
@main_routes.route('/campaigns', methods=['GET'])
def get_campaigns():
    campaigns = Campaign.query.all()
    return jsonify([
        {
            "id": campaign.id,
            "name": campaign.name,
            "email_subject": campaign.email_subject,
            "created_at": campaign.created_at
        }
        for campaign in campaigns
    ])

@main_routes.route('/campaigns/<int:id>/send', methods=['POST'])
def send_campaign_emails(id):
    campaign = Campaign.query.get_or_404(id)

    emails = campaign.target_emails.split(',')
    for email in emails:
        msg = Message(
            subject=campaign.email_subject,
            body=campaign.email_body,
            recipients=[email]
        )
        mail.send(msg)

    return jsonify({"message": "E-mails enviados com sucesso!"}), 200