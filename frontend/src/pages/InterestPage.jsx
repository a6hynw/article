import { useNavigate } from 'react-router-dom';
import { InterestSelector } from '@/components/InterestSelector';

const INTERESTS_KEY = 'article-ai-interests';

const getSavedInterests = () => {
  try {
    const saved = localStorage.getItem(INTERESTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function InterestPage() {
  const navigate = useNavigate();
  const savedInterests = getSavedInterests();

  const handleComplete = (selected) => {
    localStorage.setItem(INTERESTS_KEY, JSON.stringify(selected));
    navigate('/article');
  };

  return (
    <InterestSelector
      defaultSelected={savedInterests}
      onComplete={handleComplete}
    />
  );
}
