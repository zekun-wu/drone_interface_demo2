import React, { useState, useMemo, useEffect, memo} from 'react';
import Questionnaire from './components/Questionnaire';
import DroneMonitor from './components/DroneMonitor';
import './App.css';

function App() {
  const [identifier, setIdentifier] = useState(0);
  const scenehighlightArray = [
    { scene: 1, highlight: 0 },
    'questionnaire',
    { scene: 1, highlight: 1 },
    'questionnaire',
    { scene: 1, highlight: 2 },
    'questionnaire',
    { scene: 2, highlight: 0 },
    'questionnaire',
    { scene: 2, highlight: 1 },
    'questionnaire',
    { scene: 2, highlight: 2 },
    'questionnaire',
    { scene: 3, highlight: 0 },
    'questionnaire',
    { scene: 3, highlight: 1 },
    'questionnaire',
    { scene: 3, highlight: 2 },
    'questionnaire',
    { scene: 4, highlight: 0 },
    'questionnaire',
    { scene: 4, highlight: 1 },
    'questionnaire',
    { scene: 4, highlight: 2 },
    'questionnaire',
    { scene: 5, highlight: 0 },
    'questionnaire',
    { scene: 5, highlight: 1 },
    'questionnaire',
    { scene: 5, highlight: 2 },
    'questionnaire'
    // Add more scene and highlight combinations as needed
  ];

  const { scene, highlight } = scenehighlightArray[identifier];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sceneCounter, setSceneCounter] = useState(1);

  const handleNextScene = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % scenehighlightArray.length);
    if (scenehighlightArray[currentIndex + 1] !== 'questionnaire') {
      setSceneCounter((prevSceneCounter) => prevSceneCounter + 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic here to process and submit the answers
    handleNextScene();
  };

  // const handlePrevScene = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex === 0) ? scenehighlightArray.length - 1 : prevIndex - 1);
  // };

  const currentSceneHighlight = scenehighlightArray[currentIndex];
  const key = `scene-${currentSceneHighlight.scene}-highlight-${currentSceneHighlight.highlight}`;

  const MemoizedDroneMonitor = memo(DroneMonitor);

  // Add useMemo to memoize the droneDataFiles and prevent multiple rendering
  const criticalSituationFolders = ['t1', 't2', 't3'];
  const generateDroneDataFiles = () => {
    const normalSceneFiles = [];
    for (let i = 1; i <= 3; i++) {
      const data = `${process.env.PUBLIC_URL}/data/normal_scenes/${i}/data.json`;
      normalSceneFiles.push({ data });
    }

    const criticalSituationFiles = criticalSituationFolders.map(folder => {
      const fileIndex = Math.floor(Math.random() * 4) + 1;
      return {
        data: `${process.env.PUBLIC_URL}/data/critical_situations/${folder}/${fileIndex}/data.json`
      };
    });

    const droneFiles = [...normalSceneFiles, ...criticalSituationFiles];
    droneFiles.sort(() => Math.random() - 0.5);

    return droneFiles.map((file) => file.data);
  };

  const [droneDataFiles, setDroneDataFiles] = useState(generateDroneDataFiles());
  const [prevScene, setPrevScene] = useState(currentSceneHighlight.scene);

  useEffect(() => {
    if (prevScene !== currentSceneHighlight.scene) {
      setDroneDataFiles(generateDroneDataFiles());
      setPrevScene(currentSceneHighlight.scene);
    }
  }, [currentIndex, currentSceneHighlight.scene, prevScene]);


  return (
    <div className="App">
      <div className="app_container">
        {scenehighlightArray[currentIndex] === 'questionnaire' ? (
          <Questionnaire handleSubmit={handleSubmit} droneDataFiles={droneDataFiles}/>
        ) : (
          <MemoizedDroneMonitor
            identifier={key}
            scene={currentSceneHighlight.scene}
            highlight={currentSceneHighlight.highlight}
            droneDataFiles={droneDataFiles}
          />
        )}
        <div className="content-wrapper">
          <h2>Current Scene: {sceneCounter}</h2>
          <div className="button-container">
            {/* <button onClick={handlePrevScene}>Previous Scene</button> */}
            {scenehighlightArray[currentIndex] === 'questionnaire' ? (
              <button type="submit" onClick={handleSubmit}>
                Submit and Proceed
              </button>
            ) : (
              <button onClick={handleNextScene}>Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;