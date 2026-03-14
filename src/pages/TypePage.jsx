import TypingPractice from '../components/type/TypingPractice';
import PersonalizedExercise from '../components/ui/PersonalizedExercise';

const TypePage = ({ story, onSessionComplete, personalizedExercise, clearExercise }) => (
  <div>
    <TypingPractice text={story.text} onSessionComplete={onSessionComplete} />
    <PersonalizedExercise exercise={personalizedExercise} onDismiss={clearExercise} />
  </div>
);

export default TypePage;
