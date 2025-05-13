import BridgeForm from '@/components/BridgeForm';

export default function BridgePage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Send Funds / Bridge Assets
      </h1>
      <BridgeForm />
    </div>
  );
}