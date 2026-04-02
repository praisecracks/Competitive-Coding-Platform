export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl font-semibold mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-300 text-sm leading-7">

          <p>
            We collect basic account information such as your username,
            email address, and activity on the platform to improve your
            experience.
          </p>

          <p>
            Your data is never sold. It is used strictly for platform
            functionality, analytics, and improving CODEMASTER.
          </p>

          <p>
            You can request deletion of your account and data at any time.
          </p>

        </div>
      </div>
    </div>
  );
}