import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 text-slate-900 flex items-center justify-center p-4 pb-32">
      {/* Newsprint texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3Ccircle cx='37' cy='17' r='1'/%3E%3Ccircle cx='57' cy='17' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='17' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3Ccircle cx='57' cy='37' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Ccircle cx='17' cy='57' r='1'/%3E%3Ccircle cx='37' cy='57' r='1'/%3E%3Ccircle cx='57' cy='57' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Card className="w-full max-w-4xl bg-amber-50/90 border-4 border-red-600 shadow-2xl relative overflow-hidden">
        {/* Comic book style border decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-blue-600 to-red-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-blue-600 to-red-600"></div>

        <CardContent className="p-8 space-y-6 comic-font">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/images/616degrees-logo.png"
              alt="616 Degrees of Separation"
              width={500}
              height={150}
              className="max-w-full h-auto mx-auto drop-shadow-lg"
              priority
            />
          </div>

          {/* Stan Lee Style Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-red-600 mb-2 transform -rotate-1">TRUE BELIEVERS!</h1>
            <div className="w-32 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Main Stan Lee Text */}
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="text-slate-800">
              <span className="font-bold text-red-600">Face front, Marvelites!</span> The cosmic web of the Marvel
              Universe has been <span className="font-bold text-blue-600 uppercase">TANGLED!</span> Two mighty
              characters from across the vast expanse of Earth-616 have been mysteriously separated by the machinations
              of an unknown force!
            </p>

            <p className="text-slate-800">
              They could be the most heroic heroes, the most villainous villains, or one of each locked in eternal
              struggle! Your mission, should you choose to accept it (and we{" "}
              <span className="font-bold text-red-600 uppercase">KNOW</span> you will!), is to connect these characters
              through the amazing tapestry of Marvel Comics history!
            </p>

            <p className="text-slate-800">
              <span className="font-bold text-blue-600">Search through decades of pulse-pounding panels!</span> Navigate
              the nail-biting narratives! Find those crucial comic connections where our characters crossed paths! But
              beware, brave ones - you have only <span className="font-bold text-red-600 text-2xl">SIX</span>{" "}
              spectacular steps to bridge the gap, or the very fabric of the 616 reality could{" "}
              <span className="font-bold text-red-600 uppercase">UNRAVEL!</span>
            </p>

            <p className="text-slate-800">
              Can you rise to the challenge? Can you prove yourself worthy of the title{" "}
              <span className="font-bold text-blue-600">"Master of Marvel Connections"?</span> The fate of the
              Multiverse rests in your hands!
            </p>

            <div className="text-center py-4">
              <p className="text-2xl font-bold text-red-600 transform rotate-1">'Nuff said!</p>
              <p className="text-3xl font-bold text-blue-600 transform -rotate-1 mt-2">EXCELSIOR!</p>
            </div>

            <div className="bg-yellow-200 border-2 border-red-600 p-4 rounded-lg transform rotate-1 shadow-lg">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-red-600">P.S.</span> - Keep your eyes peeled, True Believers! New
                challenges appear daily, just like your favorite Marvel Comics! Face front and{" "}
                <span className="font-bold text-blue-600">THWIP</span> on!
              </p>
            </div>
          </div>

          {/* Comic book style burst decorations - repositioned to avoid logo */}
          <div className="absolute top-1/2 right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-red-600 transform rotate-12">
            <span className="text-red-600 font-bold text-xs">POW!</span>
          </div>
          <div className="absolute bottom-20 left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center border-3 border-yellow-400 transform -rotate-12">
            <span className="text-yellow-800 font-bold text-xs">ZAP!</span>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Angular Comic Button - Bottom Right using uploaded SVG */}
      <Link href="/marvel-game" className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <div className="w-64 h-16 transform hover:scale-105 transition-all duration-200 cursor-pointer drop-shadow-lg">
            <svg width="100%" height="100%" viewBox="0 0 1064 292" className="w-full h-full">
              {/* Button background using exact path from uploaded SVG */}
              <path d="M1060 7L40 123L8 285L1020 187L1060 7Z" fill="white" />
              <path
                d="M1024.51 190.058L0.336362 291.756L32.3268 117.389L1063.5 -1.42893e-05L1024.51 190.058ZM40.8243 126.486L12.5693 280.492L1016.19 180.834L1050.94 11.4947L40.8243 126.486Z"
                fill="black"
              />

              {/* Text tilted -4 degrees to run parallel to the bottom */}
              <text
                x="532"
                y="146"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                transform="rotate(-4 532 146)"
                className="comic-font"
                style={{
                  fontStyle: "italic",
                  fontWeight: "bold",
                  fontSize: "64px",
                }}
              >
                START TODAY'S QUEST!!!
              </text>
            </svg>
          </div>

          {/* Shadow effect */}
          <div className="absolute top-2 left-2 -z-10 w-64 h-16 opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 1064 292" className="w-full h-full">
              <path d="M1060 7L40 123L8 285L1020 187L1060 7Z" fill="black" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}
