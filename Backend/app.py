from flask import Flask, render_template, request, jsonify
from roboflow import Roboflow
import base64
from PIL import Image, ImageDraw
from io import BytesIO

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_backend():
    return 'Hello backend!'

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    try:
        # Retrieve image data
        image_data_uri = request.json.get('uri')

        # Extract base64-encoded part
        _, image_data_base64 = image_data_uri.split(',', 1)

        # Decode base64 image string
        image_bytes = base64.b64decode(image_data_base64)

        # Use BytesIO to create a stream from the image data
        image_stream = BytesIO(image_bytes)

        # Open the image using PIL
        image = Image.open(image_stream).convert('RGB')

        # Save the image to a file
        image.save("input_image.jpg")

        rf = Roboflow(api_key="RMzZna7r8BabI0Fz7SJV")
        project = rf.workspace().project("currency_detection-2ukia")
        model = project.version(1).model

        prediction_result = model.predict("input_image.jpg", confidence=40, overlap=30)
# response['predictions'][0]['predicted_classes'][0]
        # Get predictions from the JSON response
        predictions = prediction_result.json()["predictions"][0]['predicted_classes'][0]
        return predictions
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    port=5000
    app.run(port=port)