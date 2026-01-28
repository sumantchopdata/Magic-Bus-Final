interface PlacementTabProps {
  studentId: string;
  onProgressUpdate: () => void;
}

export default function PlacementTab({ studentId, onProgressUpdate }: PlacementTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Placement</h2>
      <div className="bg-orange-50 p-8 rounded-lg text-center">
        <div className="text-5xl mb-4">💼</div>
        <p className="text-gray-600 text-lg">
          Complete your Training first to access this section.
        </p>
        <p className="text-gray-500 mt-2">
          Find job opportunities and placement assistance.
        </p>
      </div>
    </div>
  );
}
