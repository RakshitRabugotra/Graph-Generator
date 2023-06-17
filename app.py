from flask import Flask
from flask import render_template, request, url_for, redirect
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save", methods=["POST"])
def save():
    content_type = request.headers.get('Content-type')

    # The json data received from the frontend
    JSON = None

    if(content_type == 'application/json'):
        JSON = request.get_json()
    

    # If we didn't receive any JSON then return no content found
    if JSON is None:
        return "Empty JSON (no content)", 204
    
    # Else we will write the JSON file to the disk
    with open("./static/graph.json", "w") as outFile:
        json.dump(JSON, outFile)
    # end-with

    return "Success", 200


@app.route("/load", methods=["POST"])
def load():
    content_type = request.headers.get("Content-Type")

    if(content_type != 'application/json'):
        return "Bad request", 400
    
    # Load the JSON content
    JSON = None

    try:
        with open("./static/graph.json", "r") as readFile:
            # Read from the previous json
            JSON = json.load(readFile)
    except FileNotFoundError:
        return {}, 404 
    
    return JSON, 200 
