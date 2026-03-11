import LoginForm from "@/features/auth-users/components/login";
import Image from "next/image";
import { Container } from "@/components/layout/container";

export default function SignIn() {
  return (
    <Container className="flex w-full bg-white overflow-hidden py-4">
      <div className="flex flex-col-reverse lg:flex-row w-full overflow-hidden rounded-[40px] bg-white">
        {/* Left Side: Form Column */}
        <LoginForm />

        {/* Right Side: Image Column */}
        <div className="relative w-full aspect-4/5 sm:aspect-3/4 lg:aspect-auto lg:w-1/2 overflow-hidden rounded-[40px]">
          <Image
            src="/login.jpg"
            alt="Cofiño Usados Login"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-end justify-start p-12 bg-linear-to-t from-black/40 via-transparent to-black/10">
            <p className="text-left font-semibold leading-tight text-white text-fluid-xxl font-display">
              Tu próximo vehículo, respaldado por Cofiño
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
