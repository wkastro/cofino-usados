import LoginForm from "@/features/auth-users/components/login";
import Image from "next/image";
import { Container } from "@/components/layout/container";

export default function SignIn() {
  return (
    <Container className="flex w-full bg-white overflow-hidden py-4">
      <div className="flex w-full overflow-hidden rounded-[40px] bg-white">
        {/* Left Side: Form Column */}
        <LoginForm />        

        {/* Right Side: Image Column */}
        <div className="relative hidden w-1/2 lg:block overflow-hidden rounded-[40px]">
          <Image
            src="/login.jpg"
            alt="Cofiño Usados Login"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 bg-linear-to-t from-black/40 via-transparent to-black/10">
            <p className="font-semibold leading-tight text-white text-fluid-xxl font-display">
              Tu próximo vehículo, respaldado por Cofiño
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
