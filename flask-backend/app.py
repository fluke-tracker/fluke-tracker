import io
import os
import pickle
import traceback
from flask import abort
from flask import send_file
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_simple import (
    JWTManager, jwt_required, create_jwt, get_jwt_identity
)
from flask import make_response
from PIL import Image
from apscheduler.schedulers.background import BackgroundScheduler
from pathlib import Path
import atexit

app = Flask(__name__)
CORS(app)

# Setup the Flask-JWT-Simple extension
CSV_TO_SERVE = "C:\\Users\\mschaffe\\Documents\\Projekte\\Data Science Challenge\\2020\\data_science_challange_2020\\global_data_science_challenge_3_public\\src\\cosine_preds.csv"
TRAIN_DIR = "C:\\Users\\mschaffe\\Documents\\Projekte\\Data Science Challenge\\2020\\data_science_challange_2020\\global_data_science_challenge_3_public\\data\\train"
TEST_VAL = "C:\\Users\\mschaffe\\Documents\\Projekte\\Data Science Challenge\\2020\\data_science_challange_2020\\global_data_science_challenge_3_public\\data\\test_val"
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
jwt = JWTManager(app)


img_name_to_path = {}
db = None
apsched = None

def store_memory_database():
    print("dump database")
    pickle.dump(db, open("db.p", "wb"))
    # store backup just in case....
    pickle.dump(db, open("db_backup.p", "wb"))


@app.before_first_request
def init():
    global img_name_to_path
    global db
    global apsched
    paths = Path(TRAIN_DIR).glob("*/*")
    paths2 = Path(TEST_VAL).glob("*")
    img_name_to_path = {path.name: path for path in paths}
    img_name_to_path.update({path.name: path for path in paths2})
    # initialize memory database
    user1 = {'id': 1, 'name': 'John', 'surname': 'Doe', 'email': 'demo@appseed.us', 'password': 'demo'}
    user2 = {'id': 2, 'name':  'George', 'surname': 'Clooney', 'email': 'demo2@appseed.us', 'password': 'demo'}
    user3 = {'id': 2, 'name': 'George', 'surname': 'Clooney', 'email': 'asd@asd.de', 'password': 'demo'}
    users = [user1, user2, user3]
    db = {"matching_images": {}, "users": {user["email"]: user for user in users}}

    # if dump of memory database already enrich the memory database
    if os.path.exists("db.p"):
        db_ = pickle.load(open("db.p", "rb"))
        db = {**db, **db_}


    print("start apsched")
    apsched = BackgroundScheduler()
    apsched.start()
    apsched.add_job(store_memory_database, 'interval', seconds=60)
    atexit.register(lambda: apsched.shutdown())
    atexit.register(store_memory_database)


# Provide a method to create access tokens. The create_jwt()
# function is used to actually generate the token
@app.route('/api/users/login', methods=['POST'])
def login():

    try:
        params = request.get_json()

        username = params['user']['email']
        password = params['user']['password']

    # catch JSON format and missing keys (email / password)
    except:
        print(traceback.format_exc())
        return jsonify({'errors': {'general': 'Format error '}}), 400

    if not username in db["users"]:
        return jsonify({'errors': {'email': 'User or email doesn\'t exist'}}), 400

    user = db["users"][username]  # aka email

    if not password or password != user['password']:
        return jsonify({'errors': {'password': 'Password is invalid'}}), 400

        # inject token
    user["token"] = create_jwt(identity=username)

    # build response
    ret = {'user': user}

    # All good, return response
    return jsonify(ret), 200


@app.route("/csv")
def csv():
    file = open(
        CSV_TO_SERVE).read()
    output = make_response(file)
    output.headers["Content-Disposition"] = "attachment; filename=export.csv"
    output.headers["Content-type"] = "text/csv"
    return output


@app.route("/accept/<new_image>/<old_image>")
##@jwt_required
def accept_image(new_image, old_image):
    global db
    if new_image in db["matching_images"] and db["matching_images"][new_image]:
        existing_images = db["matching_images"][new_image]
    else:
        existing_images = list()
    existing_images.append(old_image)
    db["matching_images"][new_image] = list(set(existing_images))
    return jsonify({"message": "ok"}), 200


@app.route("/unaccept/<new_image>/<old_image>")
##@jwt_required
def unaccept_image(new_image, old_image):
    global db
    if new_image in db["matching_images"] and db["matching_images"][new_image] and old_image in db["matching_images"][
        new_image]:
        db["matching_images"][new_image].remove(old_image)
        if not db["matching_images"][new_image]: del db["matching_images"][new_image]
    else:
        return jsonify({"message": "already deleted"}), 200

    return jsonify({"message": "ok"}), 200


@app.route("/matches")
##@jwt_required
def matches():
    global db
    return jsonify({"matchedPictures": db["matching_images"]}), 200

@app.route("/get_status")
##@jwt_required
def get_status():
    return jsonify(db), 200


@app.route("/images/<image>")
#@jwt_required
def images(image):
    if image in img_name_to_path:
        im = Image.open(str(img_name_to_path[image]))
        im.thumbnail((520, 520))
        # make sure we have a folder for the thumbnails
        os.makedirs("thumbnails", exist_ok=True)
        thumbnail_path = "thumbnails/" + image + "thumbnail.jpg"
        # check if thumbnail already exists and create if neccessary
        if os.path.exists(thumbnail_path):
            file = open(thumbnail_path, "rb")
        else:
            im.save(thumbnail_path, format="jpeg")
            file = open(thumbnail_path, "rb")
        response = send_file(file, as_attachment=False, attachment_filename='thumbnail.jpg')
        return response
    abort(404)


# Protect a view with jwt_required, which requires a valid jwt
# to be present in the headers.
@app.route('/protected', methods=['GET'])
#@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    return jsonify({'hello_from': get_jwt_identity()}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=3000)
