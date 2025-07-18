import HomeHeader from "../HomeHeader/HomeHeader"
import "./HomePage.css"

function HomePage() {
    return (
      <>
        <HomeHeader />
        <div className="waterfall-media">
          <img
            src="https://cdn.shopify.com/s/files/1/2467/2501/files/cataract_falls.png?v=1731097283"
            alt="waterfall"
          />
        </div>
        <div className="impact-section">
          <div className="impact-text">
            <div className="headline">
              <h2>Make an Impact With Us</h2>
            </div>
            <div className="impact-paragraph">
              <p>
                VolunteerGo is a platform that connects volunteers with
                organizations in need of help. Whether you want to volunteer
                your time, skills, or resources, we have opportunities for you.
                Join us in making a difference in our communities and the world.
               </p>
            </div>
            <div>
              <button>Learn more</button>
            </div>
          </div>
          <div className="volunteering-media">
            <img
              src="https://www.parents.com/thmb/TKfsiYM0mOsnTtYnrOoug95R1fA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-626891352-99af025cafaf4e69a76cb8af44140201.jpg"
              alt="group of people volunteering"
              className="volunteering-media-1"
            />
            <img
              src="src/assets/pexels-shvetsa-5029919.jpg"
              alt="group of people volunteering"
              className="volunteering-media-1"
            />
            <img
              src="https://www.skh.com/wp-content/uploads/2025/01/SKHTreePlantingGuide1-min.jpg"
              alt="group of people volunteering"
              className="volunteering-media-1"
            />
          </div>
        </div>
      </>
    );
}

export default HomePage
