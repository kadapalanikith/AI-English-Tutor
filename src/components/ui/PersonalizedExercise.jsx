import Card from './Card';

/**
 * Shows a personalised exercise card after a practice session.
 * @param {{ exercise: string | null; onDismiss: () => void }} props
 */
const PersonalizedExercise = ({ exercise, onDismiss }) => {
  if (!exercise) return null;

  return (
    <Card className="mt-4 border-brand-500 border-2 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-brand-700">Personalised Practice ✨</h3>
        <button
          onClick={onDismiss}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Dismiss personalised exercise"
        >
          Dismiss
        </button>
      </div>
      <p className="text-slate-600 mb-3">
        Here&apos;s a special exercise based on your last session to help you improve:
      </p>
      <div className="p-4 bg-brand-50 rounded-xl text-xl leading-relaxed text-slate-700">
        {exercise}
      </div>
    </Card>
  );
};

export default PersonalizedExercise;
