import Image from "next/image";
import RegisterForm from "@/features/register-users/components/form";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center py-4">
      <div className="w-full max-w-310 min-h-175 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section: Image and Info */}
        <div className="relative w-full lg:w-1/2">
          {/* Background Image */}
          <div className="absolute inset-2 overflow-hidden rounded-[32px]">
            <Image
              src="/registro.jpg"
              alt="Cofino Usados Registration"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10" />

            {/* Content over image */}
            <div className="relative h-full flex flex-col justify-between p-10">
              <div className="space-y-12">
                <p className="font-semibold leading-tight text-white text-fluid-xxl font-display">
                  Calidad y confianza en cada vehículo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
