import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function Onboarding() {
  const { user, update } = useUser();

  const [formData, setFormData] = useState({
    avatarUrl: user.imageUrl || "https://i.postimg.cc/wT6j0qvg/Screenshot-2025-07-09-at-3-46-05-PM.png",
    username: user.username || "",
    skills: [],
    training: [],
    location: "",
    age: "",
  });

  // helper for skills/training multi-select (example with comma-separated input)
  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split(",").map(s => s.trim()).filter(Boolean),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
console.log("POST to:", `${import.meta.env.VITE_API_BASE_URL}/users/onboarding`);

  try {
    // Send data to your backend
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        name: formData.name,
        username: formData.username,
        skills: formData.skills,
        training: formData.training,
        location: formData.location,
        age: Number(formData.age),
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to save user");

    alert("Profile updated and saved!");
    // Redirect or update state if needed
  } catch (err) {
    console.error("Failed onboarding process", err);
    alert("Error during onboarding");
  }
};

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Onboarding</h2>
      
      <label>
        Avatar URL:
        <input
          type="text"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
        />
      </label>

      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Skills (comma separated):
        <input
          type="text"
          name="skills"
          value={formData.skills.join(", ")}
          onChange={handleArrayInput}
        />
      </label>

      <label>
        Training (comma separated):
        <input
          type="text"
          name="training"
          value={formData.training.join(", ")}
          onChange={handleArrayInput}
        />
      </label>

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min={0}
        />
      </label>

      <button type="submit">Complete Onboarding</button>
    </form>
  );
}
