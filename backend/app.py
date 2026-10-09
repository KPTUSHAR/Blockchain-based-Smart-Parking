# =========================================================
# IMPORTS & APP SETUP
# =========================================================
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from datetime import datetime
from pdf_generator import generate_receipt
import hashlib
import math
import json
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Firebase Setup
firebase_config = os.environ.get("FIREBASE_CONFIG")

if firebase_config:
    cred_dict = json.loads(firebase_config)
    cred = credentials.Certificate(cred_dict)
else:
    cred = credentials.Certificate("firebase-key.json")

firebase_admin.initialize_app(cred)

db = firestore.client()

# -------------------------
# Config
# -------------------------
CHAIN_FILE = "chain.json"   # persisted chain
PARKING_RATE = 10.0         # rupees per hour
MINIMUM_CHARGE = 1.0        # minimum charge in rupees
SLOT_COUNT = 15

# -------------------------
# Block & Blockchain
# -------------------------
class Block:
    def __init__(self, index: int, timestamp: str, data: str, previous_hash: str, hash_value: str = None):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = hash_value if hash_value else self.calculate_hash()

    def calculate_hash(self) -> str:
        text = f"{self.index}|{self.timestamp}|{self.data}|{self.previous_hash}"
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash,
        }

    @classmethod
    def from_dict(cls, d):
        return cls(
            index=d["index"],
            timestamp=d["timestamp"],
            data=d["data"],
            previous_hash=d["previous_hash"],
            hash_value=d.get("hash")
        )

class Blockchain:
    def __init__(self):
        self.chain = []
        if os.path.exists(CHAIN_FILE):
            try:
                self.load_chain()
            except Exception as e:
                print("Failed to load chain.json — creating a fresh genesis block. Error:", e)
                self.create_genesis_block()
                self.save_chain()
        else:
            self.create_genesis_block()
            self.save_chain()

    def create_genesis_block(self):
        genesis = Block(0, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "🚀 Genesis Block", "0")
        genesis.hash = genesis.calculate_hash()
        self.chain = [genesis]

    def add_block(self, data: str):
        prev = self.chain[-1]
        new_index = prev.index + 1
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_block = Block(new_index, timestamp, data, prev.hash)
        new_block.hash = new_block.calculate_hash()
        self.chain.append(new_block)
        self.save_chain()
        return new_block

    def get_chain(self):
        return [b.to_dict() for b in self.chain]

    def is_valid(self):
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            if curr.hash != curr.calculate_hash():
                return False, {"index": i, "reason": "Invalid hash"}
            if curr.previous_hash != prev.hash:
                return False, {"index": i, "reason": "Previous hash mismatch"}
        return True, None

    def save_chain(self):
        with open(CHAIN_FILE, "w", encoding="utf-8") as f:
            json.dump(self.get_chain(), f, indent=2, ensure_ascii=False)

    def load_chain(self):
        with open(CHAIN_FILE, "r", encoding="utf-8") as f:
            raw = json.load(f)
        loaded = []
        for item in raw:
            b = Block.from_dict(item)
            if not b.hash:
                b.hash = b.calculate_hash()
            loaded.append(b)
        self.chain = loaded

# Instantiate blockchain
blockchain = Blockchain()

# -------------------------
# Parking State
# -------------------------
SLOTS = [{"id": i, "booked": False, "user": None, "start_time": None, "end_time": None} for i in range(1, SLOT_COUNT + 1)]
users = {}       # username -> password
vehicles = {}    # username -> {vehicles: [...], slot_limit: n}

# -------------------------
# Helpers
# -------------------------
def compute_bill_minutes(start_iso: str, end_iso: str):
    fmt = "%Y-%m-%d %H:%M:%S"
    start = datetime.strptime(start_iso, fmt)
    end = datetime.strptime(end_iso, fmt)
    seconds = (end - start).total_seconds()
    minutes = max(1, math.ceil(seconds / 60.0))
    price_per_min = PARKING_RATE / 60.0
    bill = round(minutes * price_per_min, 2)
    if bill < MINIMUM_CHARGE:
        bill = MINIMUM_CHARGE
    return minutes, bill

# =========================================================
# AUTHENTICATION & USER
# =========================================================

@app.route("/register", methods=["POST"])
def register():

    data = request.json or {}

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({
            "message": "Provide username and password"
        }), 400

    user_ref = db.collection("users").document(username)

    if user_ref.get().exists:
        return jsonify({
            "message": "Username already exists"
        }), 400

    user_ref.set({
        "username": username,
        "password": password
    })

    blockchain.add_block(
        f"👤 New user registered: {username}"
    )

    return jsonify({
        "message": "Registration successful!"
    })


@app.route("/login", methods=["POST"])
def login():

    data = request.json or {}

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    user_ref = db.collection("users").document(username)

    user = user_ref.get()

    if user.exists:

        user_data = user.to_dict()

        if user_data["password"] == password:

            blockchain.add_block(
                f"🔐 {username} logged in."
            )

            return jsonify({
                "message": "Login successful!"
            })

    return jsonify({
        "message": "Invalid username/password"
    }), 401

# =========================================================
# VEHICLE DETAILS
# =========================================================

@app.route("/set_vehicle", methods=["POST"])
def set_vehicle():

    data = request.json or {}

    username = data.get("username")

    if not username:
        return jsonify({
            "message": "Provide username"
        }), 400

    # -----------------------------------------------------
    # Multi-vehicle format
    # -----------------------------------------------------

    if isinstance(data.get("vehicles"), list):

        vehicles_list = data.get("vehicles")

        slot_limit = int(
            data.get("slot_limit") or len(vehicles_list)
        )

        if slot_limit > len(vehicles_list):
            return jsonify({
                "message":
                "slot_limit cannot exceed number of vehicles"
            }), 400

        vehicles[username] = {
            "vehicles": vehicles_list,
            "slot_limit": slot_limit
        }

        blockchain.add_block(
            f"🚗 {username} registered "
            f"{len(vehicles_list)} vehicle(s), "
            f"slot limit = {slot_limit}"
        )

        return jsonify({
            "message": "Vehicle(s) saved"
        })

    # -----------------------------------------------------
    # Single vehicle format
    # -----------------------------------------------------

    plate = data.get("plate")
    vtype = data.get("vtype")

    if plate and vtype:

        vehicles[username] = {
            "vehicles": [
                {
                    "plate": plate,
                    "type": vtype
                }
            ],
            "slot_limit": 1
        }

        blockchain.add_block(
            f"🚗 {username} saved vehicle: "
            f"{plate} ({vtype})"
        )

        return jsonify({
            "message": "Vehicle saved"
        })

    return jsonify({
        "message": "Provide vehicle details"
    }), 400


# =========================================================
# PARKING SLOTS
# =========================================================

@app.route("/slots", methods=["GET"])
def get_slots():

    return jsonify(SLOTS)


@app.route("/book/<int:slot_id>", methods=["POST"])
def book_slot(slot_id):

    data = request.json or {}

    username = data.get("username")

    if not username:
        return jsonify({
            "message": "Provide username"
        }), 400

    # Enforce user's slot limit
    user_info = vehicles.get(username)

    if user_info:

        booked_by_user = sum(
            1
            for s in SLOTS
            if s["booked"] and s["user"] == username
        )

        if booked_by_user >= user_info.get(
            "slot_limit",
            len(user_info.get("vehicles", []))
        ):
            return jsonify({
                "message":
                "Slot booking limit reached for your account"
            }), 403

    for s in SLOTS:

        if s["id"] == slot_id:

            if s["booked"]:
                return jsonify({
                    "message":
                    f"Slot {slot_id} already booked"
                }), 400

            s["booked"] = True
            s["user"] = username
            s["start_time"] = datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            s["end_time"] = None

            blockchain.add_block(
                f"🅿️ {username} booked "
                f"Slot {slot_id} at {s['start_time']}"
            )

            return jsonify({
                "message":
                f"Slot {slot_id} booked"
            })

    return jsonify({
        "message": "Slot not found"
    }), 404


# =========================================================
# BILL CALCULATION
# =========================================================

@app.route("/calculate_bill/<int:slot_id>", methods=["GET"])
def calculate_bill(slot_id):

    username = request.args.get("username")

    for s in SLOTS:

        if s["id"] == slot_id:

            if not s["booked"]:
                return jsonify({
                    "message": "Slot not booked"
                }), 400

            if s["user"] != username:
                return jsonify({
                    "message":
                    "You do not own this booking"
                }), 403

            end_iso = datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )

            minutes, bill = compute_bill_minutes(
                s["start_time"],
                end_iso
            )

            return jsonify({
                "minutes": minutes,
                "expected": bill
            })

    return jsonify({
        "message": "Slot not found"
    }), 404


# =========================================================
# RELEASE SLOT / PAYMENT
# =========================================================

@app.route("/release/<int:slot_id>", methods=["POST"])
def release_slot(slot_id):

    data = request.json or {}

    username = data.get("username")
    paid = data.get("paid", None)

    if username is None:
        return jsonify({
            "message": "Provide username"
        }), 400

    for s in SLOTS:

        if s["id"] == slot_id:

            if not s["booked"]:
                return jsonify({
                    "message": "Slot not booked"
                }), 400

            if s["user"] != username:
                return jsonify({
                    "message":
                    f"🚫 You cannot release this slot — "
                    f"it belongs to {s['user']}!"
                }), 403

            # Set end time
            s["end_time"] = datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )

            minutes, bill = compute_bill_minutes(
                s["start_time"],
                s["end_time"]
            )

            # Payment not supplied
            if paid is None:
                return jsonify({
                    "message": "Payment required",
                    "amount_due": bill
                }), 402

            # Convert payment to float
            try:
                paid_val = float(paid)

            except Exception:
                return jsonify({
                    "message":
                    "Provide a numeric paid amount",
                    "expected": bill
                }), 400

            # Check payment
            if paid_val + 1e-9 < bill:
                return jsonify({
                    "message":
                    f"Incorrect payment amount! "
                    f"Expected ₹{bill}.",
                    "expected": bill
                }), 400

            # Store username before clearing slot
            username_released = s["user"]

            # Release slot
            s["booked"] = False
            s["user"] = None
            s["start_time"] = None
            s["end_time"] = None

            # Add transaction to blockchain
            blockchain.add_block(
                f"💰 {username_released} released "
                f"Slot {slot_id}. "
                f"Duration: {minutes} min, "
                f"Paid ₹{paid_val}"
            )

            return jsonify({
                "message":
                f"Slot {slot_id} released. "
                f"Bill: ₹{bill} ({minutes} min). "
                f"Paid: ₹{paid_val}"
            })

    return jsonify({
        "message": "Slot not found"
    }), 404


# =========================================================
# PAYMENT SUCCESS / PDF RECEIPT
# =========================================================

@app.route("/payment/success", methods=["POST"])
def payment_success():
    try:
        slot_number = request.form.get("slot_number")
        start_time = request.form.get("start_time")
        end_time = request.form.get("end_time")
        amount = request.form.get("amount")
        transaction_id = request.form.get("transaction_id")

        # Validate required fields
        if not slot_number or not start_time or not end_time or not amount or not transaction_id:
            return jsonify({"message": "Missing required fields"}), 400

        # Convert amount to float
        amount = float(amount)

        # Add payment transaction to blockchain
        blockchain.add_block(
            f"💳 Payment successful | "
            f"Slot: {slot_number} | "
            f"Amount: ₹{amount:.2f} | "
            f"Transaction ID: {transaction_id}"
        )

        # Generate and return PDF receipt
        return generate_receipt(
            slot_number,
            start_time,
            end_time,
            amount,
            transaction_id
        )

    except Exception as e:
        # Log error to console and return JSON
        print("Receipt generation error:", e)
        return jsonify({"message": f"Receipt generation failed: {e}"}), 500




# =========================================================
# FRONTEND ROUTES
# =========================================================
@app.route("/")
def index():
    return render_template("login.html")

@app.route("/register_page")
def register_page():
    return render_template("register.html")

@app.route("/vehicle_form")
def vehicle_form():
    return render_template("vehicle_form.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# =========================================================
# LEDGER PAGE
# =========================================================
@app.route("/ledger_page")
def ledger_page():
    return render_template("ledger.html")

# =========================================================
# LEDGER ENDPOINT
# =========================================================
@app.route("/ledger", methods=["GET"])
def get_ledger():
    # Ensure blockchain object exists before calling get_chain()
    return jsonify(blockchain.get_chain())


@app.route("/firebase-test")
def firebase_test():

    db.collection("test").document("sample").set(
        {
            "message": "Firebase Connected Successfully"
        }
    )

    return "Firebase Working Successfully!"



# =========================================================
# RUN FLASK
# =========================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)