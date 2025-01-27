import { FaHeart, FaBook, FaUserCircle } from 'react-icons/fa';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <h1 className="font-serif text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl">
              Honor Their Memory,
              <br />
              Celebrate Their Life
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-100 sm:text-xl">
              Create a beautiful digital memorial to preserve and share precious memories of your loved ones
            </p>
            <div className="mt-10 flex justify-center gap-6">
              <ButtonLink 
                href="/login" 
                size="large"
                className="bg-white px-8 text-gray-900 hover:bg-gray-100"
              >
                Create a Memorial
              </ButtonLink>
              <ButtonLink 
                href="/about" 
                size="large"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Learn More
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-3xl font-light text-gray-900 sm:text-4xl">
            Create a Lasting Tribute
          </h2>
          
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="group flex flex-col items-center text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                <FaHeart className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-serif text-xl text-gray-900">Personal Tributes</h3>
              <p className="text-gray-600">
                Create a beautiful memorial page with photos, stories, and cherished memories
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col items-center text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <FaBook className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-serif text-xl text-gray-900">Share Stories</h3>
              <p className="text-gray-600">
                Invite family and friends to contribute their memories and photographs
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group flex flex-col items-center text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <FaUserCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-serif text-xl text-gray-900">Forever Remembered</h3>
              <p className="text-gray-600">
                Preserve precious memories in a dignified digital memorial for generations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <blockquote>
            <p className="font-serif text-2xl italic leading-relaxed text-gray-800 sm:text-3xl">
              "Those we love don't go away, they walk beside us every day. Unseen, unheard, but always near, still loved, still missed and very dear."
            </p>
            <footer className="mt-8">
              <div className="h-0.5 mx-auto w-12 bg-gray-200"></div>
              <p className="mt-4 text-base text-gray-500">Anonymous</p>
            </footer>
          </blockquote>
        </div>
      </div>
    </main>
  );
}
