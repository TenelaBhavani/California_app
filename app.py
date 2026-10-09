from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
obj = joblib.load("PCA/california.joblib")

model = obj["Model"]
columns = obj["Columns"]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["GET"])
def predict():

    try:
        input_values = []

        for col in columns:
            value = request.args.get(col)

            if value is None or value.strip() == "":
                return jsonify({
                    "success": False,
                    "message": f"Please enter a value for {col}"
                }), 400

            input_values.append(float(value))

        # Convert input into numpy array
        input_data = np.array(input_values).reshape(1, -1)

        # Prediction
        prediction = model.predict(input_data)

        predicted_price = float(prediction[0])

        return jsonify({
            "success": True,
            "prediction": predicted_price
        })

    except ValueError:
        return jsonify({
            "success": False,
            "message": "Please enter valid numerical values."
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)