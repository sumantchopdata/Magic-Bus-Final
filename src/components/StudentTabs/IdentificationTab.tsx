interface IdentificationTabProps {
  studentId: string;
  onProgressUpdate: () => void;
}

export default function IdentificationTab({ studentId, onProgressUpdate }: IdentificationTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Identification</h2>
      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <div className="text-5xl mb-4">🆔</div>
        <p className="text-gray-600 text-lg">
          Complete your Registration first to access this section.
        </p>
        <p className="text-gray-500 mt-2">
          This section will help verify your identity and validate your information.
        </p>
      </div>
    </div>
  );
}
