import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import './Onboarding.css'
import { useNavigate } from "react-router-dom";  
import { useLeaderboard } from "../../contexts/LeaderboardContext"
import { useProfile } from "../../contexts/ProfileContext";
import badgeService from '../../utils/badgeService';
import PopupPill from "../PopupPill/PopupPill";
import BadgeModal from "../BadgeModal/BadgeModal";

export default function Onboarding() {
  const { user, token, isLoaded } = useAuth();
  const navigate = useNavigate();  
  const [currentStep, setCurrentStep] = useState(1);
  const { refreshLeaderboard } = useLeaderboard();
  const { refreshProfile } = useProfile();
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize formData from firebase if available
  const [formData, setFormData] = useState({
    avatarUrl: "https://i.ibb.co/rf6XN61Q/plant.png",
    name: user?.displayName || "",
    email: user?.email || "",
    username: user?.email?.split("@")[0] || "", // default fallback
    location: "",
    age: "",
    skills: [],
    training: [],
    interests: []
  });

  const [loading, setLoading] = useState(true);

  // Fetch user data from API if user is logged in and data is loaded
  useEffect(() => {
    if (user && isLoaded) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${user.uid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch user profile");
          const data = await res.json();
          
          // Update formData with fetched user data
          setFormData({
            name: data.name || "",
            email: data.email || user.email || "",
            username: data.username || "",
            skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(",").map(s => s.trim()) : []),
            training: Array.isArray(data.training) ? data.training : (data.training ? data.training.split(",").map(t => t.trim()) : []),
            location: data.location || "",
            age: data.age || "",
            interests: data.interests || [],
            avatarUrl: data.avatarUrl || ""
          });
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, isLoaded, token]);

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

  const commonSkills = [
  "Teaching",
  "Web Development",
  "Photography",
  "Event Planning",
  "Fundraising",
  "Writing",
  "Social Media",
  "Data Analysis",
  "Customer Service",
  "Public Speaking"
];

const commonTraining = [
  "First Aid",
  "CPR",
  "Project Management",
  "Conflict Resolution",
  "Leadership",
  "Safety Training",
  "Diversity & Inclusion",
  "Mental Health Awareness"
];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleArrayInput = (e) => {
    const { name, value } = e.target;

    const array = value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

    setFormData(prev => ({
        ...prev,
        [name]: array
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

    const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleTraining = (trainingItem) => {
    setFormData(prev => ({
      ...prev,
      training: prev.training.includes(trainingItem)
        ? prev.training.filter(t => t !== trainingItem)
        : [...prev.training, trainingItem]
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
  setSubmitting(true);
    console.log("Submitting started");

  const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
  const trainingArray = formData.training.split(",").map(t => t.trim()).filter(Boolean);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 include Firebase token
      },
      body: JSON.stringify({
        name: formData.name,
        username: formData.username,
        skills: skillsArray,
        training: trainingArray,
        location: formData.location,
        age: Number(formData.age),
        interests: formData.interests,
        avatarUrl: formData.avatarUrl,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to save user");

    // Call badge check and show modal if badge earned
    await badgeService.checkNewcomerBadge(user.uid, (badge) => {
      if (badge) {
        console.log("Newcomer badge earned!", badge);
        setEarnedBadge(badge);
      } else {
        // No badge earned, navigate immediately
        navigate("/profile");
      }
    });

    refreshLeaderboard();
    refreshProfile();
  } catch (err) {
    console.error("Failed onboarding process", err);
    alert("Error during onboarding");
  } finally {
    setSubmitting(false);
  }
};

  const isStep1Valid = formData.name && formData.email && formData.location;
  const isStep2Valid = formData.interests.length > 0;

  return (
    <>
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
                  placeholder="City, State"
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
                <label>Skills</label>
                <div className="pill-container">
                  {commonSkills.map(skill => (
                    <div
                      key={skill}
                      className={`pill ${formData.skills.includes(skill) ? "selected" : ""}`}
                      onClick={() => toggleSkill(skill)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if(e.key === 'Enter') toggleSkill(skill); }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Training & Certifications</label>
                <div className="pill-container">
                  {commonTraining.map(training => (
                    <div
                      key={training}
                      className={`pill ${formData.training.includes(training) ? "selected" : ""}`}
                      onClick={() => toggleTraining(training)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if(e.key === 'Enter') toggleTraining(training); }}
                    >
                      {training}
                    </div>
                  ))}
                </div>
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
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Complete Onboarding"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      <PopupPill
      message="Profile information saved!"
      type="success"
      duration={3000}
      isVisible={showSuccess}
      onClose={() => setShowSuccess(false)}
      position="bottom-center"
    />
    {earnedBadge && (
      <BadgeModal 
        badge={earnedBadge} 
        onClose={() => {setEarnedBadge(null); navigate("/profile")}} 
      />
    )}


    </>
  );
}
