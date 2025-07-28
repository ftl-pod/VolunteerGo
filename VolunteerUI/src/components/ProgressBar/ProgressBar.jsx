import './ProgressBar.css';

function getLevelData(points) {
  if (points < 0) return { level: 1, progress: 0, currentLevelPoints: 0, nextLevelPoints: 10 };
  
  let level = 1;
  let totalPointsForPreviousLevels = 0;
  let pointsNeededForCurrentLevel = 15;

  // Calculate which level the user is currently in
  while (points >= totalPointsForPreviousLevels + pointsNeededForCurrentLevel) {
    totalPointsForPreviousLevels += pointsNeededForCurrentLevel;
    level++;
    pointsNeededForCurrentLevel += 5; // Each level requires 10 more points than the previous
  }

  // Calculate progress within the current level
  const currentLevelPoints = points - totalPointsForPreviousLevels;
  const progress = Math.min((currentLevelPoints / pointsNeededForCurrentLevel) * 100, 100);

  return { 
    level, 
    progress, 
    currentLevelPoints, 
    nextLevelPoints: pointsNeededForCurrentLevel 
  };
}

function ProgressBar({ points = 0, size = 'normal' }) {
  const { level, progress, nextLevelPoints, currentLevelPoints } = getLevelData(points);
  const pointsToNext = nextLevelPoints - (points - (points - currentLevelPoints));

  return (
    <div className={`progress-wrapper ${size}`}>
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          <div className="shine" />
        </div>
        <div className="level-bubble" style={{ left: `${progress}%` }}>
          {level}
        </div>
      </div>
      <div className="progress-info">
        <span className="current-points">{points} pts</span>
        <span className="next-level">· {pointsToNext} pts to next level</span>
      </div>
    </div>
  );
}

export default ProgressBar;