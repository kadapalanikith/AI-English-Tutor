
import React from 'react';
import Card from './Card';

interface PersonalizedExerciseProps {
  exercise: string | null;
  onDismiss: () => void;
}

const PersonalizedExercise: React.FC<PersonalizedExerciseProps> = ({ exercise, onDismiss }) => {
  if (!exercise) return null;

  return (
    <Card className="mt-4 border-teal-500 border-2 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-teal-700 m-0">Personalized Practice ✨</h3>
        <button onClick={onDismiss} className="text-sm font-semibold text-slate-500 hover:text-slate-800">Dismiss</button>
      </div>
      <p className="text-slate-600 m-0 mb-3">Here's a special exercise based on your last session to help you improve:</p>
      <div className="p-4 bg-teal-50 rounded-lg text-xl leading-relaxed text-slate-700">
        {exercise}
      </div>
    </Card>
  );
};

export default PersonalizedExercise;
