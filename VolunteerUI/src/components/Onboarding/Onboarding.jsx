import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import './onboarding.css'
import { useNavigate } from "react-router-dom";  

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initialize formData from Clerk user publicMetadata if available
  const [formData, setFormData] = useState({
    avatarUrl: "https://i.postimg.cc/wT6j0qvg/Screenshot-2025-07-09-at-3-46-05-PM.png",
    name: "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    username: user?.username || "",
    location: "",
    age: "",
    skills: [],
    training: [],
    interests: []
  });

  useEffect(() => {
    if (user?.publicMetadata) {
      const md = user.publicMetadata;
      setFormData({
        avatarUrl: md.avatarUrl || formData.avatarUrl,
        name: md.name || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        username: user.username || "",
        location: md.location || "",
        age: md.age ? String(md.age) : "",
        skills: Array.isArray(md.skills) ? md.skills : [],
        training: Array.isArray(md.training) ? md.training : [],
        interests: Array.isArray(md.interests) ? md.interests : [],
      });
    }
  }, [user]);

  const causes = [
    { id: 'environment', label: 'Environmental Protection', icon: '🌍' },
    { id: 'education', label: 'Education & Learning', icon: '📚' },
    { id: 'healthcare', label: 'Healthcare & Wellness', icon: '🏥' },
    { id: 'poverty', label: 'Poverty & Hunger', icon: '🤝' },
    { id: 'animals', label: 'Animal Welfare', icon: '🐾' },
    { id: 'elderly', label: 'Elderly Care', icon: '👴' },
    { id: 'youth', label: 'Youth Development', icon: '🎓' },
    { id: 'community', label: 'Community Building', icon: '🏘️' },
    { id: 'technology', label: 'Technology for Good', icon: '💻' },
    { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
    { id: 'disaster', label: 'Disaster Relief', icon: '🚨' },
    { id: 'human-rights', label: 'Human Rights', icon: '⚖️' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split(",").map(s => s.trim()).filter(Boolean),
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("POST to:", `${import.meta.env.VITE_API_BASE_URL}/users/onboarding`);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: formData.email,
          name: formData.name,
          username: formData.username,
          skills: formData.skills,
          training: formData.training,
          location: formData.location,
          age: Number(formData.age),
          interests: formData.interests,
          avatarUrl: formData.avatarUrl
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save user");

      alert("Profile updated and saved!");
      navigate("/profile");
    } catch (err) {
      console.error("Failed onboarding process", err);
      alert("Error during onboarding");
    }
  };

  const isStep1Valid = formData.name && formData.email && formData.location;
  const isStep2Valid = formData.interests.length > 0;

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Interests</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Skills</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Avatar</div>
            </div>
          </div>
          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
          </div>
        </div>

        <div>
          {currentStep === 1 && (
            <div className="step-content fade-in">
              <h2>Welcome! Let's get to know you</h2>
              <p className="step-subtitle">Tell us a bit about yourself to personalize your experience</p>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="City, State/Country"
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  placeholder="Your age"
                />
              </div>

              <div className="button-group">
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="btn-primary"
                  disabled={!isStep1Valid}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content fade-in">
              <h2>What causes do you care about?</h2>
              <p className="step-subtitle">Select the areas where you'd like to make a difference</p>

              <div className="interests-grid">
                {causes.map(cause => (
                  <div
                    key={cause.id}
                    className={`interest-card ${formData.interests.includes(cause.id) ? 'selected' : ''}`}
                    onClick={() => handleInterestToggle(cause.id)}
                  >
                    <div className="interest-icon">{cause.icon}</div>
                    <div className="interest-label">{cause.label}</div>
                    {formData.interests.includes(cause.id) && (
                      <div className="check-mark">✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="button-group">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="btn-primary"
                  disabled={!isStep2Valid}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content fade-in">
              <h2>Share your skills and experience</h2>
              <p className="step-subtitle">Help us match you with the right opportunities</p>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleArrayInput}
                  placeholder="e.g., Teaching, Web Development, Photography"
                />
              </div>

              <div className="form-group">
                <label>Training & Certifications (comma separated)</label>
                <input
                  type="text"
                  name="training"
                  value={formData.training.join(", ")}
                  onChange={handleArrayInput}
                  placeholder="e.g., First Aid, CPR, Project Management"
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary">
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content fade-in">
              <h2>Choose your profile picture</h2>
              <p className="step-subtitle">Enter a URL and preview your avatar</p>

              <div className="form-group">
                 <div className="avatar-preview">
                <img src={formData.avatarUrl} alt="Avatar preview" />
              </div>
            <label>Profile Picture URL</label>


                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </div>


              <div className="button-group">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Back
                </button>
                <button type="button" onClick={handleSubmit} className="btn-primary">
                  Complete Onboarding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
