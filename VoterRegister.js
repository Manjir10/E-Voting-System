import React, { useState, useRef } from "react";
import axios from "axios";
import "./VoterRegister.css";
import { useNavigate } from "react-router-dom";

const VoterRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    email: "",
    voterId: "",
    password: "",
    voterIdCard: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [voterIdPreview, setVoterIdPreview] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "voterIdCard") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setVoterIdPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setCapturedPhoto(blob);
      setPhotoPreview(URL.createObjectURL(blob));
    }, "image/jpeg");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or unavailable.");
    }
  };

  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    // now accepts exactly 10 alphanumeric characters
    const voterIdRegex = /^[A-Za-z0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Invalid email format.");
      return false;
    }

    if (!voterIdRegex.test(formData.voterId)) {
      alert("Voter ID must be exactly 10 letters or digits.");
      return false;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }

    if (!formData.dob || calculateAge(formData.dob) < 18) {
      alert("You must be at least 18 years old to register.");
      return false;
    }

    if (!capturedPhoto) {
      alert("Please capture your photo using the camera.");
      return false;
    }

    if (!formData.voterIdCard) {
      alert("Please upload your Voter ID card image.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();
    const resizedCard = await resizeImage(formData.voterIdCard, 400, 400);

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "voterIdCard") {
        submitData.append(key, value);
      }
    });

    submitData.append("photo", capturedPhoto);
    submitData.append("voterIdCard", resizedCard);

    // Inside handleSubmit()
    try {
      const response = await axios.post("http://localhost:8080/api/voters/register", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const result = response.data?.toString().trim();
      console.log("Server Response:", result);

      if (result === "Voter registered successfully.") {
        alert(result);
        localStorage.setItem("voterId", formData.voterId);
        navigate("/vote");
      } else {
        alert("Registration failed: " + result);
      }
    } catch (error) {
      const msg = error.response?.data || error.message;
      if (msg.includes("already exists")) {
        alert("User already registered with this Voter ID or Email.");
      } else {
        alert("Registration failed: " + msg);
      }
      console.error("Registration error:", msg);
    }
  };

  const downloadImage = () => {
    if (!capturedPhoto) return;
    const link = document.createElement("a");
    link.href = photoPreview;
    link.download = "photo.jpg";
    link.click();
  };

  return (
    <div className="register-container">
      <h2>Voter Registration</h2>
      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <input
          type="text"
          name="voterId"
          placeholder="Voter ID (10 alphanumeric chars)"
          value={formData.voterId}
          onChange={handleChange}
          maxLength={10}
          required
        />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <div className="webcam-section">
          <label>Live Photo Capture:</label>
          <video ref={videoRef} autoPlay width="300" height="200" className="video-preview" />
          <div>
            <button type="button" onClick={startCamera}>Start Camera</button>{" "}
            <button type="button" onClick={handleCapture}>Capture</button>
          </div>
          <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }} />
          {photoPreview && <img src={photoPreview} alt="Captured" className="preview-image" />}
          {photoPreview && <button type="button" onClick={downloadImage}>Download Captured Image</button>}
        </div>

        <label>Upload Voter ID Card:</label>
        <input type="file" name="voterIdCard" accept="image/*" onChange={handleChange} required />
        {voterIdPreview && <img src={voterIdPreview} alt="Voter ID" className="preview-image" />}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default VoterRegister;
