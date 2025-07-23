import HomeHeader from "../HomeHeader/HomeHeader"
import "./HomePage.css"
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function HomePage() {
  const [orgs, setOrgs] = useState([]);
  const [ranIdx, setRanIdx] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedOrg, setDisplayedOrg] = useState('');
  useEffect (()=> {
    const fetchOrgs = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/organizations`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        const orgsArr = await Promise.all (
          data.map(async (org) => org.name)
        )
        setOrgs(orgsArr);
      } catch (err) {
        console.error("Error Fetching Organizations", err)
      }
    }
    fetchOrgs();
  }, []); 
    useEffect(() => {
      if (orgs.length === 0) return;
      
      const updateIdx = () => {
        const idx = Math.floor(Math.random() * orgs.length);
        const newOrg = orgs[idx];
        
        // Only animate if the org actually changes
        if (newOrg !== displayedOrg) {
          setIsAnimating(true);
          
          // After fade out, update the org and fade back in
          setTimeout(() => {
            setDisplayedOrg(newOrg);
            setRanIdx(idx);
            setIsAnimating(false);
          }, 300);
        }
      };

      // Set initial org immediately
      if (!displayedOrg && orgs.length > 0) {
        const initialIdx = Math.floor(Math.random() * orgs.length);
        setDisplayedOrg(orgs[initialIdx]);
        setRanIdx(initialIdx);
      }

      const intervalId = setInterval(updateIdx, 5000);
      return () => clearInterval(intervalId);
    }, [orgs, displayedOrg]);

return (
      <>
        <HomeHeader />
        <div className="waterfall-media">
          <img
            src="https://i.postimg.cc/prkQspDb/1-copy-3.jpg"
            alt="waterfall"
          />
        </div> 
        <div className="imprint">
          <div className="imprint-pic">
            <img src="https://i.postimg.cc/6pqKjnLz/output-onlinepngtools-Photoroom.png" className="imprint-pic"/>
          </div>
          <div>
            <h2>
              Make Your Mark, Leave a Lasting Imprint with{" "}
              <span className={`org-name ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                {displayedOrg}
              </span>
            </h2>
          </div>
        </div>
        <div className="squiggly-bg">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`squiggly-line line-${i}`}
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0,50 
              C80,0 160,100 240,50 
              S400,0 480,50 
              S640,100 720,50 
              S880,0 960,50 
              S1120,100 1200,50 
              S1360,0 1440,50"
            fill="none"
            stroke="#374f37"
            strokeWidth="3"
          />
        </svg>
      ))}
    </div>
        <div className="info-section">
          <div className="info-cat">
            <a href="#mission-statement">Our Mission</a>
            </div>
          <div className="info-cat">
            <NavLink to="/search">Help Now</NavLink></div>
            <div className="info-cat">
              <a href="#about-us">About Us</a>
              </div>
        </div>
        <div className="section-wrapper">
            <div id="mission-statement" className="mission">
          <h1>Our Mission Statement</h1>
          <div className="mission-text">
            Our mission is to inspire and empower individuals from all walks of life to make a meaningful and lasting impact in 
            their communities by transforming the traditional volunteer experience into an engaging, rewarding, and game-like 
            journey. Through our innovative platform, we connect passionate volunteers with a wide variety of opportunities that 
            align perfectly with their unique skills, interests, and availability. By incorporating elements such as challenges, 
            points, levels, and rewards, we encourage ongoing participation and foster a sense of accomplishment and community 
            among users. We believe that by making volunteering not only accessible but also fun and motivating, we can help 
            build stronger, more connected communities and cultivate a culture of generosity and social responsibility that lasts 
            well beyond a single act of service. Our goal is to redefine what it means to give back by leveraging technology and 
            gamification to spark enthusiasm and commitment for positive change in the world.
          </div>        
        <div id="about-us" className="about">
          <h1>Meet Our Founders</h1>
          <div className="about-text">
            Our founders are former FTL Salesforce interns passionate about community service and giving back. They created 
            this platform to amplify those values by adding gamified incentives, making volunteering more engaging and 
            rewarding for everyone.
            <div className="pic-container">
              <div>
              <img src="https://i.postimg.cc/Vv9MYPPR/img-5175-720.jpg" className="about-pic" alt="Jasmine Andresol"/>
              <div className="founder-info">
                <div>Jasmine Andresol</div>
                <div>email</div>
                <div>university</div>
              </div>
            </div>
            <div>
               <img src="https://i.postimg.cc/xTcnDyGk/futureforce-day-30908-720.jpg" className="about-pic" alt="Ayomide Isinkaye"/>
               <div className="founder-info">
                <div>Ayomide Isinkaye</div>
                <div>aisinkaye@salesforce.com</div>
                <div>Huston-Tillotson University</div>
               </div>
            </div>
            <div>
               <img src="https://i.postimg.cc/PxCnsdZg/headshot.jpg" className="about-pic" alt="Jada Finesilver"/>
               <div className="founder-info">
                <div>Jada Finesilver</div>
                <div>jfinesilver@salesforce.com</div>
                <div>Stanford University</div>
               </div>
            </div>
            </div>
         
          </div>
        </div>
        </div>
      </div>
              
      </>
    );
}

export default HomePage
