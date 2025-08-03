// UserAnalysisBlock component for displaying user financial analysis
interface UserAnalysisBlockProps {
  userAnalysis: any;
}

const UserAnalysisBlock = ({ userAnalysis }: UserAnalysisBlockProps) => {
  return (
    <div className="border-t border-gray-100 bg-blue-50">
      <div className="px-4 py-3">
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">
            💰 Financial Analysis Complete
          </h3>
          <p className="text-blue-700 text-sm">
            User financial analysis has been processed and is available in the dashboard. 
            The analysis includes account overviews, spending patterns, and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAnalysisBlock;
