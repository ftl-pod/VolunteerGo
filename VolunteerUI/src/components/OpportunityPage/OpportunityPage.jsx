import { useParams } from 'react-router-dom';
import opportunities from '../../data/opportunities';
import DraggableCard from '../DraggableCard/DraggableCard';

const OpportunityPage = () => {
  const { id } = useParams();
  const opportunity = opportunities.find(op => op.id === Number(id));

  return (
    <DraggableCard
      opportunity={opportunity}
      formatDate={(date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })}
    />
  );
};
export default OpportunityPage;
