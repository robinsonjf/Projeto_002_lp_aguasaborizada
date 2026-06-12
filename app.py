from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from database import init_db, inserir_lead, listar_leads

app = Flask(__name__)
CORS(app)

# Inicializa o banco ao iniciar a aplicação
init_db()


@app.route("/")
def index():
    """Renderiza a landing page principal."""
    return render_template("index.html")


@app.route("/reservar", methods=["POST"])
def reservar():
    """
    Endpoint para captação de leads.
    Recebe JSON ou form-data com: nome, email, celular.
    Salva no SQLite e retorna JSON de confirmação.
    """
    data = request.get_json(silent=True) or request.form

    nome    = (data.get("nome") or "").strip()
    email   = (data.get("email") or "").strip()
    celular = (data.get("celular") or "").strip()

    # Validações básicas
    if not nome or not email or not celular:
        return jsonify({"success": False, "message": "Todos os campos são obrigatórios."}), 400

    if "@" not in email or "." not in email:
        return jsonify({"success": False, "message": "E-mail inválido."}), 400

    if len(celular) < 10:
        return jsonify({"success": False, "message": "Número de celular inválido."}), 400

    lead = inserir_lead(nome, email, celular)
    return jsonify({
        "success": True,
        "message": "Reserva realizada com sucesso! Entraremos em contato em breve. 🎉",
        "lead": lead
    }), 201


@app.route("/admin/leads", methods=["GET"])
def admin_leads():
    """Rota administrativa para listar todos os leads cadastrados."""
    leads = listar_leads()
    return jsonify({"total": len(leads), "leads": leads})


if __name__ == "__main__":
    print("="*60)
    print("  🥤 Aqua Caroline - Servidor iniciado!")
    print("  Acesse: http://localhost:5000")
    print("  Admin leads: http://localhost:5000/admin/leads")
    print("="*60)
    app.run(debug=True, port=5000)
