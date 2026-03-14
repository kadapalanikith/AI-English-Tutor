import LearnSection from '../components/learn/LearnSection';
import PersonalizedExercise from '../components/ui/PersonalizedExercise';

const LearnPage = ({ story, lang, dictionary, fetchNewStory, isLoading, loadingProgress, personalizedExercise, clearExercise }) => (
  <div>
    <LearnSection
      story={story}
      lang={lang}
      dictionary={dictionary}
      fetchNewStory={fetchNewStory}
      isLoading={isLoading}
      loadingProgress={loadingProgress}
    />
    <PersonalizedExercise exercise={personalizedExercise} onDismiss={clearExercise} />
  </div>
);

export default LearnPage;
