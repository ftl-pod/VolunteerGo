import "./ProfilePage.css";
import { IoLocationSharp } from "react-icons/io5";
import { MdCake } from "react-icons/md";
import { GiThreeLeaves } from "react-icons/gi";
import { FaBarsProgress } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { TbTargetArrow } from "react-icons/tb";
import { PiCertificateFill } from "react-icons/pi";
import { FaFireFlameCurved } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";


function ProfilePage({user}) {
    
      if (!user) {
        return (
        <div className="page-container">
            <div className="section">
            <p>Please log in to view your profile.</p>
            </div>
        </div>
        );
    }

    return (
        <>
            <div className="page-container">
                <div className="section">
                    <div className="profile">
                        <div className="name">{user.username}</div>
                        <div className="img-container">
                            {/* hardcoded for now, user will have 12 options */}
                            <img src={user.imageUrl} alt="Profile" className="profile-img" />
                        </div>
                        <div className="bio">
                            <div className="info">
                                <div>
                                    <IoLocationSharp className="icon"/>
                                    <b>Location</b></div>
                                <div>
                                    <MdCake className="icon"/>
                                    <b>Age</b></div>
                                <div>
                                    <GiThreeLeaves className="icon"/>
                                    <b>Points</b></div>
                                <div>
                                    <FaBarsProgress className="icon"/>
                                    <b>Level</b></div>
                                <div>
                                    <IoCalendarSharp className="icon"/>
                                    <b>Joined</b></div>
                            </div>
                            <div className="info">
                                {/* this stuff will come from the db after user registers */}
                                <div>{user.location}</div>
                                <div>{user.age}</div>
                                <div>{user.points}</div>
                                <div>{user.level}</div>
                                <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* when registering, user will be limited to x amount of things for each section */}
                <div className="section">
                    <div className="box">
                        <div className="box-header">
                            <BsBookmarkHeartFill className="icon"/>
                            <b>Interests</b>
                            </div>
                        <div className="box-content">
                            <div>thing1</div>
                            <div>thing2</div>
                            <div>thing3</div>
                        </div>
                    </div>
                     <div className="box">
                        <div className="box-header">
                            <TbTargetArrow className="icon"/>
                            <b>Skills</b>
                            </div>
                        <div className="box-content">
                        {user.skills && user.skills.length > 0 ? (
                            user.skills.map((skill, index) => (
                            <div key={index}>{skill}</div>
                            ))
                        ) : (
                            <div>No skills listed.</div>
                        )}
                        </div>
                     </div>
                      <div className="box">
                        <div className="box-header">
                            <PiCertificateFill className="icon"/>
                            <b>Certifications</b></div>
                        <div className="box-content">
                        {user.training && user.training.length > 0 ? (
                            user.training.map((training, index) => (
                            <div key={index}>{training}</div>
                            ))
                        ) : (
                            <div>No skills listed.</div>
                        )}                        </div>
                      </div>
                </div>
                <div className="section">
                    <div className="box">
                        <div className="box-header">
                            <FaFireFlameCurved className="icon"/>
                            <b>Leaderboard status</b>
                            </div>
                            <div className="box-content">
                            <div className="rank-label">
                                Leaderboard Rank: #{user.leaderboardRank}
                            </div>
                            </div>
                    </div>
                    <div className="section2">
                        <div className="s2-header">
                            <BiSolidDonateHeart className="icon"/>
                            <b>You Have Made A Difference With</b>
                            </div>
                        <div className="s2-content">
                            {/* hardcoded for now, will be dynamically updated with db*/}
                            <div>org</div>
                            <div>org</div>
                            <div>org</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage
