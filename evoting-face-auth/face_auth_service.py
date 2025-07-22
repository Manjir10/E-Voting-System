from flask import Flask, request, jsonify
from deepface import DeepFace
import easyocr
import re
from datetime import datetime
from PIL import Image
import numpy as np
import io
from difflib import SequenceMatcher

app = Flask(__name__)
reader = easyocr.Reader(['en'])  # initialize OCR once

def extract_text_lines(image_bytes):
    """
    Run OCR on both the original and a binarized version to improve text coverage.
    """
    img_color = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    arr_color = np.array(img_color)
    lines_color = reader.readtext(arr_color, detail=0)

    img_gray = img_color.convert('L')
    bw = img_gray.point(lambda x: 0 if x < 128 else 255, '1')
    arr_bw = np.array(bw.convert('RGB'))
    lines_bw = reader.readtext(arr_bw, detail=0)

    return lines_color + lines_bw

def normalize_dob(dob_str):
    try:
        if "/" in dob_str:
            return datetime.strptime(dob_str, "%d/%m/%Y").date()
        return datetime.fromisoformat(dob_str).date()
    except Exception as e:
        print("DOB normalization error:", e)
        return None

def fuzzy_match(a: str, b: str, threshold: float = 0.8) -> bool:
    return SequenceMatcher(None, a, b).ratio() >= threshold

@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        # 1) Required form fields
        required = ['name', 'dob', 'voterId']
        missing = [k for k in required if not request.form.get(k)]
        if missing:
            return jsonify(error=f"Missing fields: {missing}"), 400
        if 'photo' not in request.files or 'voterIdCard' not in request.files:
            return jsonify(error="Missing photo or voterIdCard"), 400

        form_name = request.form['name'].strip()
        form_dob  = normalize_dob(request.form['dob'])
        form_vid  = request.form['voterId'].upper().strip()

        # 2) Read uploads
        photo_bytes = request.files['photo'].read()
        print("Received photo: blob")
        id_bytes    = request.files['voterIdCard'].read()
        print("Received id card: blob")

        # 3) OCR on ID card
        lines = extract_text_lines(id_bytes)
        ocr_text_raw = " ".join(lines).upper()
        print("OCR text >>>\n", ocr_text_raw)

        # 3a) Looser fuzzy header check
        header_tokens = ["ELECTION", "COMMISSION", "INDIA"]
        matches = 0
        for token in header_tokens:
            for line in lines:
                clean = re.sub(r'[^A-Z]', '', line.upper())
                if SequenceMatcher(None, token, clean).ratio() >= 0.5:
                    matches += 1
                    break
        if matches < 1:
            return jsonify(result="no match",
                           reason="ID card header not recognized"), 400

        # 4) EPIC number match (exact, mapped, then fuzzy)
        candidates = re.findall(r'\b[A-Z0-9]{10}\b', ocr_text_raw)
        print("OCR EPIC candidates:", candidates)
        vid_match = None
        for cand in candidates:
            if cand == form_vid:
                vid_match = cand
                break
            mapped = cand.replace('I', 'M').replace('L', 'I')
            if mapped == form_vid:
                vid_match = cand
                break
            if fuzzy_match(cand, form_vid, threshold=0.8):
                vid_match = cand
                break
        if not vid_match:
            return jsonify(result="no match",
                           reason="EPIC number mismatch"), 400
        print(f"Using OCR EPIC: {vid_match} (expected {form_vid})")

        # 5) Name match with fuzzy fallback
        name_found = any(form_name.lower() in line.lower() for line in lines)
        if not name_found:
            fn = form_name.replace(" ", "").lower()
            for line in lines:
                ln = line.replace(" ", "").lower()
                if fuzzy_match(fn, ln, threshold=0.7):
                    name_found = True
                    break
        if not name_found:
            return jsonify(result="no match", reason="Name mismatch"), 400

        # 6) DOB match (optional)
        dob_matches = re.findall(
            r'\b\d{2}[/-]\d{2}[/-]\d{4}\b|\b\d{4}-\d{2}-\d{2}\b',
            ocr_text_raw
        )
        if dob_matches:
            if not any(normalize_dob(d) == form_dob for d in dob_matches):
                return jsonify(result="no match", reason="DOB mismatch"), 400
        else:
            print("⚠️ No DOB found on ID card, skipping DOB check")

        # 7) DeepFace verification
        print("Running DeepFace verification…")
        photo_arr = np.array(Image.open(io.BytesIO(photo_bytes)).convert('RGB'))
        id_arr    = np.array(Image.open(io.BytesIO(id_bytes)).convert('RGB'))
        df_result = DeepFace.verify(photo_arr, id_arr, enforce_detection=False)
        print("DeepFace result:", df_result)
        if not df_result.get("verified", False):
            return jsonify(result="no match", reason="face mismatch"), 400

        # 8) All checks passed
        return jsonify(result="match"), 200

    except Exception as e:
        print("Error in verify_face:", e)
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
