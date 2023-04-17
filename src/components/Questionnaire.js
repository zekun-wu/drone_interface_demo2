import React, { useState, useEffect,useMemo } from 'react';
import './Questionnaire.css';

const questions = [
  {
    question: 'Which of the following critical situations have occurred during the past flight?',
    options: ['Low battery', 'Extreme wind', 'Rotor off', 'No-fly warning', "I don’t know"],
  },
  {
    question: 'Which drones have experienced critical situations during the past flight?',
    options: ['Drone 1', 'Drone 2', 'Drone 3', 'Drone 4', 'Drone 5', 'Drone 6', "I don’t know"],
  },
  {
    question: 'How many different critical situations have happened?',
    options: ['1', '2', '3', "I don’t know"],
  }
];

const Questionnaire = ({ onSubmit, droneDataFiles }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(questions[Math.floor(Math.random() * questions.length)]);
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const [droneData, setDroneData] = useState({});
  const criticalSituationFolders = ['t1', 't2', 't3'];
  const [answersGenerated, setAnswersGenerated] = useState(false);

  const parseDroneAndCriticalType = (filePath, index) => {
    const criticalMatch = filePath.match(/\/critical_situations\/t(\d)\/(\d)/);
  
    return {
      drone: index + 1,
      criticalType: criticalMatch ? parseInt(criticalMatch[2]) : null,
      timeInterval: criticalMatch ? parseInt(criticalMatch[1]) : null,
    };
  };

  useEffect(() => {
    if (droneDataFiles && !answersGenerated) {
      console.log('droneDataFiles in Questionnaire',droneDataFiles)
      const criticalSituations = new Set();
      const dronesWithCriticalSituations = new Set();
  
      droneDataFiles.forEach((file, index) => {
        const { drone, criticalType, timeInterval } = parseDroneAndCriticalType(file, index);
        if (criticalType) {
          criticalSituations.add(criticalType);
          dronesWithCriticalSituations.add(drone);
        }
      });
      
  
      const uniqueCriticalSituations = Array.from(criticalSituations).map((type) => {
        switch (type) {
          case 1:
            return 'Low battery';
          case 2:
            return 'Extreme wind';
          case 3:
            return 'Rotor off';
          case 4:
            return 'No-fly warning';
          default:
            return '';
        }
      });
  
      // const numberOfDronesWithCriticalSituations = dronesWithCriticalSituations.size;
  
      setCorrectAnswers([
        uniqueCriticalSituations,
        Array.from(dronesWithCriticalSituations).map((drone) => `Drone ${drone}`),
        [criticalSituations.size],
      ]);

    setAnswersGenerated(true);
    }
  }, [droneDataFiles]);
  
  console.log(correctAnswers)

  const handleOptionChange = (option, checked) => {
    const newSelectedOptions = new Set(selectedOptions);
    if (checked) {
      newSelectedOptions.add(option);
    } else {
      newSelectedOptions.delete(option);
    }
    setSelectedOptions(newSelectedOptions);
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedOptions));
    setSelectedOptions(new Set());
  };

  return (
    <div className="questionnaire">
      <h2>{selectedQuestion.question}</h2>
      <form>
        {selectedQuestion.options.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`option-${index}`}
              name="option"
              value={option}
              checked={selectedOptions.has(option)}
              onChange={(e) => handleOptionChange(option, e.target.checked)}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default Questionnaire;
