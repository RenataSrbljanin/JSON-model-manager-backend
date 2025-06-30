from flask import Blueprint, request, jsonify
import urllib.parse

url_encoder_bp = Blueprint("url_encoder", __name__)


@url_encoder_bp.route("/encode", methods=["GET"])
def encode():
    raw = request.args.get("value")
    if not raw:
        return jsonify({"error": "Please provide a 'value' parameter"}), 400
    encoded = urllib.parse.quote(raw)
    return jsonify({"encoded": encoded})


@url_encoder_bp.route("/decode", methods=["GET"])
def decode():
    value = request.args.get("value")
    if not value:
        return jsonify({"error": "Please provide a 'value' parameter"}), 400
    decoded = urllib.parse.unquote(value)
    return jsonify({"decoded": decoded})


# #encode:
# const rawIdn = "None:0:0>cpe:/a:microsoft:.net_framework:4.8#12345678";
# const encodedIdn = encodeURIComponent(rawIdn);
# console.log("Encoded:", encodedIdn);

# #decode:
# const decodedIdn = decodeURIComponent(encodedIdn);
# console.log("Decoded:", decodedIdn);
