from flask import Flask, render_template, send_from_directory, request, jsonify
from binascii import a2b_base64
import json
import numpy as np
import cv2
import pickle


app = Flask(__name__)
app.config['DEBUG'] = True

faceshape = (80,80)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
#face_classifier = pickle.load(open("model_lgrg.p", "rb"))
face_classifier = pickle.load(open("model_svm_lin.p", "rb"))


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/photo', methods=['POST'])
def photo():
    # the photo is sent as a base64 encoded image/png
    bdata = a2b_base64(request.data)
    npdata = np.fromstring(bdata, np.int8)
    # load into cv2 image
    img  = cv2.imdecode(npdata, 1)
    
    # convert ot gs for cascades
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # facefinder
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    app.logger.info(faces)
    if faces == ():
        return 'false'
    else:
        # first face
        (x,y,w,h) = faces.tolist()[0]
        cropped = gray[y:y+h, x:x+w]
        reshaped = cv2.resize(cropped, faceshape, interpolation=cv2.INTER_LINEAR)
        flat = reshaped.flatten()
        pred = face_classifier.predict(flat)

        return 'true' if pred[0] == 1 else 'false'



if __name__ == '__main__':
    app.run()
