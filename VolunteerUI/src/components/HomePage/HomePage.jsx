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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
            </div>
            <div>
              <button>Learn more</button>
            </div>
          </div>
          <div className="volunteering-media">
            <img
              src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQZfkSQKyEEk-bhuIk6wQs8Opzky-FKPISLt6e6wFyuzU6YzFQ9"
              alt="group of people volunteering"
              className="volunteering-media-1"
            />
            <img
              src="src/assets/pexels-shvetsa-5029919.jpg"
              alt="group of people volunteering"
              className="volunteering-media-1"
            />
            <img
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTkh8vPxT7tRX20AOzB34Zeqf0-2nJDpcLwdwz2M3VP9hkyWVn5"
              alt="group of people volunteering"
              className="volunteering-media-1"
            />
          </div>
        </div>
      </>
    );
}

export default HomePage
