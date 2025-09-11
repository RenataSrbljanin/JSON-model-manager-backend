from flask import Blueprint, request, jsonify
from app.models.computer import Computer
from app.schemas.computer_schema import ComputerSchema
from app.extensions import db
from app.models.installed_software import InstalledSoftware

computer_bp = Blueprint("computer", __name__, url_prefix="/api/computers")
schema = ComputerSchema()
many_schema = ComputerSchema(many=True)

# Ova ruta će uhvatiti SVE OPTIONS zahteve za ovaj blueprint
# i obezbediti 200 OK odgovor za preflight.
@computer_bp.route('/<path:p>', methods=['OPTIONS'])
@computer_bp.route('/', methods=['OPTIONS']) # Za osnovnu putanju '/api/computers/'
def catch_all_options(p=None): # p=None je da bi moglo da se koristi i za rute bez parametara
    return '', 200

@computer_bp.route("/", methods=["GET"])
def get_all():
   # Dohvati 'search' parametar iz URL upita
    search_term = request.args.get('search')

    if search_term:
        # Ako postoji search_term, filtriraj računare
        # Koristi .ilike() za pretragu bez obzira na velika/mala slova
        # Pretpostavljamo da želite da pretražujete po 'idn' polju
        all_items = Computer.query.filter(
            Computer.idn.ilike(f"%{search_term}%")
        ).all()
    else:
        # Ako nema search_term-a, dohvati sve računare
        all_items = Computer.query.all()

    return jsonify(many_schema.dump(all_items)), 200

@computer_bp.route("/<path:idn>", methods=["GET"])
def get_one(idn):
    # Koristimo filter_by za robusnije pretraživanje po IDN-u
    item = Computer.query.filter_by(idn=idn).first()
    if not item:
        # Ako računar nije pronađen, vrati 404 NOT FOUND
        return jsonify({'message': 'Računar nije pronađen'}), 404
    return jsonify(schema.dump(item)), 200

@computer_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = Computer(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201

# --- IZMENJENA UPDATE RUTA ---
@computer_bp.route("/<path:previous_idn>", methods=["PUT"])
def update(previous_idn):
    try:
        # Uzimamo podatke koje frontend pošalje u PUT zahtevu
        data = request.get_json() 

        # Pronalazimo objekat u bazi po previous_idn
        item = Computer.query.filter_by(idn=previous_idn).first()
        if not item:
            return jsonify({'message': f"Računar sa IDN-om {previous_idn} nije pronađen."}), 404

        # Ažuriramo svaki field u postojećem objektu
        for key, value in data.items():
            setattr(item, key, value)
        
        # Ako se IDN promenio, potrebno je ažurirati i sve povezane softvere
        if previous_idn != item.idn:
            # Pronalazimo sve InstalledSoftware entitete povezane sa starim IDN-om
            installed_software_items = InstalledSoftware.query.filter_by(
                computer_idn=previous_idn
            ).all()

            # Ažuriramo computer_idn u svim povezanim softverima
            for software_item in installed_software_items:
                software_item.computer_idn = item.idn

        db.session.commit()
        return jsonify(schema.dump(item)), 200

    except Exception as e:
        db.session.rollback() # Vraćamo sesiju u prethodno stanje u slučaju greške
        return jsonify({"error": str(e)}), 500

@computer_bp.route("/<path:idn>", methods=["DELETE"])
def delete(idn):
    item = Computer.query.filter_by(idn=idn).first()
    if not item:
        return jsonify({'message': f"Računar sa IDN-om {idn} nije pronađen za brisanje."}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
