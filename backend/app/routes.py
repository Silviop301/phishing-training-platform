from flask import Blueprint, request, jsonify, redirect
from . import db, mail
from .models import Campaign, Click
from flask_mail import Message # type: ignore
from datetime import datetime

main_routes = Blueprint('main', __name__)

@main_routes.route('/campaigns', methods=['GET'])
def get_campaigns():
    campaigns = Campaign.query.all()
    campaigns_list = [
        {
            "id": campaign.id,
            "name": campaign.name,
            "email_subject": campaign.email_subject,
            "email_body": campaign.email_body,
            "target_emails": campaign.target_emails.split(","),
            "created_at": campaign.created_at
        }
        for campaign in campaigns
    ]
    return jsonify(campaigns_list), 200

@main_routes.route('/campaigns', methods=['POST'])
def create_campaign():
    data = request.json

    if not all(key in data for key in ['name', 'email_subject', 'email_body', 'target_emails']):
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400

    # Criar nova campanha
    campaign = Campaign(
        name=data['name'],
        email_subject=data['email_subject'],
        email_body=data['email_body'],
        target_emails=",".join(data['target_emails'])
    )
    db.session.add(campaign)
    db.session.commit()

    return jsonify({
        "message": "Campanha criada com sucesso!",
        "campaign_id": campaign.id
    }), 201

@main_routes.route('/campaigns/<int:campaign_id>/send', methods=['POST'], endpoint='send_campaign')
def send_campaign(campaign_id):
    campaign = Campaign.query.get(campaign_id)
    if not campaign:
        return jsonify({"error": "Campanha não encontrada"}), 404

    try:
        # Garantir que os e-mails estão formatados corretamente
        if not campaign.target_emails:
            return jsonify({"error": "Nenhum e-mail alvo definido para esta campanha."}), 400

        recipients = [email.strip() for email in campaign.target_emails.split(',') if email.strip()]
        if not recipients:
            return jsonify({"error": "Nenhum e-mail válido encontrado na campanha."}), 400

        # Debug: Imprimir destinatários
        print(f"Enviando e-mails para: {recipients}")

        # Enviar e-mail para cada destinatário
        for email in recipients:
            tracking_link = f"http://127.0.0.1:5000/track/{campaign.id}/{email}"
            body_with_link = f"{campaign.email_body}\n\nClique aqui: {tracking_link}"

            msg = Message(
                subject=campaign.email_subject,
                sender="silviop301@gmail.com",
                recipients=[email],
                body=body_with_link
            )
            mail.send(msg)


        return jsonify({"message": "E-mails enviados com sucesso!", "recipients": recipients}), 200

    except Exception as e:
        print(f"Erro ao enviar e-mails: {str(e)}")
        return jsonify({"error": "Falha ao enviar e-mails.", "details": str(e)}), 500
    
# Rota para registrar cliques
@main_routes.route('/track/<int:campaign_id>/<email>', methods=['GET'])
def track_click(campaign_id, email):
    campaign = Campaign.query.get(campaign_id)
    if not campaign:
        return jsonify({"error": "Campanha não encontrada"}), 404

    # Salvar clique no banco
    click = Click(campaign_id=campaign_id, email=email)
    db.session.add(click)
    db.session.commit()

    print(f"Clique registrado na campanha {campaign_id} para o e-mail: {email}")

    return redirect("https://example.com")  # Link de destino real

@main_routes.route('/clicks', methods=['GET'])
def get_clicks():
    clicks = Click.query.all()
    result = []
    for click in clicks:
        result.append({
            "id": click.id,
            "campaign_id": click.campaign_id,
            "email": click.email,
            "clicked_at": click.clicked_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(result)
