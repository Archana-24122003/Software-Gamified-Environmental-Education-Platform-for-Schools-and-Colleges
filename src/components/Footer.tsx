export default function Footer() {
  return (
    <footer className="border-t border-[#3f2c1d]/10 bg-[#fbf7f1]/70">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[#6f6258]">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="font-semibold text-[#2d241f]">LearnBee</div>
            <p className="mt-2">
              Gamified environmental education for schools and colleges.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[#2d241f]">Links</div>
            <ul className="mt-2 space-y-1">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#2d241f]">Social</div>
            <ul className="mt-2 space-y-1">
              <li>GitHub</li>
              <li>LinkedIn</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-[#8d7f73]">© {new Date().getFullYear()} LearnBee</p>
      </div>
    </footer>
  );
}
