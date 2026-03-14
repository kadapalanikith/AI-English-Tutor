import PronouncePractice from '../components/pronounce/PronouncePractice';
import PersonalizedExercise from '../components/ui/PersonalizedExercise';

const PronouncePage = ({ story, onSessionComplete, personalizedExercise, clearExercise }) => (
  <div>
    <PronouncePractice text={story.text} onSessionComplete={onSessionComplete} />
    <PersonalizedExercise exercise={personalizedExercise} onDismiss={clearExercise} />
  </div>
);

export default PronouncePage;
