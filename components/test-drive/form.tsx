"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestDriveFormData {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  contactMethod: string;
  testDriveType: string;
  testDate: Date;
  startTime: string;
  endTime: string;
  branch: string;
  acceptContact: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

const STEP_1_FIELDS = [
  "name",
  "email",
  "phoneCode",
  "phone",
  "contactMethod",
] as const;

export default function FormTestDrive() {
  const [step, setStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TestDriveFormData>({
    defaultValues: {
      phoneCode: "+502",
    },
  });

  async function handleNext() {
    const valid = await trigger([...STEP_1_FIELDS]);
    if (valid) setStep(1);
  }

  function onSubmit(data: TestDriveFormData) {
    console.log("Form submitted:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Title */}
        <div className="space-y-1 text-center">
          <h1 className="font-bold text-foreground text-fluid-xl">
            Agenda aquí tu cita
          </h1>
          <p className="text-fluid-base text-muted-foreground">
            Vive la experiencia de conocer y manejar el auto que desees.
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant={step === 0 ? "dark" : "outline"}
            size="lg"
            className="px-5"
            onClick={() => setStep(0)}
          >
            Información de contacto
          </Button>
          <Button
            type="button"
            variant={step === 1 ? "lime" : "outline"}
            size="lg"
            className="px-5"
            onClick={handleNext}
          >
            Tipo de test drive
          </Button>
        </div>

        {/* Step 1: Contact Info */}
        <div className={step === 0 ? "space-y-5" : "hidden"}>
          {/* Nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre completo<span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Juan Roberto"
              aria-invalid={!!errors.name}
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              })}
            />
            <FieldError message={errors.name?.message} />
          </div>

          {/* Correo electrónico */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="juan.roberto@example.com"
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un correo electrónico válido",
                },
              })}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono<span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Controller
                control={control}
                name="phoneCode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-30 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+502">🇬🇹 +502</SelectItem>
                      <SelectItem value="+503">🇸🇻 +503</SelectItem>
                      <SelectItem value="+504">🇭🇳 +504</SelectItem>
                      <SelectItem value="+52">🇲🇽 +52</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                id="phone"
                type="tel"
                placeholder="5987 - 2409"
                aria-invalid={!!errors.phone}
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^[\d\s\-+()]{7,15}$/,
                    message: "Ingresa un número de teléfono válido",
                  },
                })}
              />
            </div>
            <FieldError message={errors.phone?.message} />
          </div>

          {/* Método de contacto */}
          <div className="space-y-2">
            <Label>
              ¿Cómo desea que le contactemos?
              <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="contactMethod"
              rules={{ required: "Selecciona un método de contacto" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.contactMethod}
                  >
                    <SelectValue placeholder="Selecciona el método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="llamada">Llamada telefónica</SelectItem>
                    <SelectItem value="correo">Correo electrónico</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.contactMethod?.message} />
          </div>
        </div>

        {/* Step 2: Test Drive Type */}
        <div className={step === 1 ? "space-y-5" : "hidden"}>
          {/* Tipo de test drive */}
          <div className="space-y-2">
            <Label>
              Tipo de test drive
              <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="testDriveType"
              rules={{ required: "Selecciona un tipo de test drive" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.testDriveType}
                  >
                    <SelectValue placeholder="Selecciona el método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="domicilio">A domicilio</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.testDriveType?.message} />
          </div>

          {/* Fecha del test */}
          <div className="space-y-2">
            <Label>
              Fecha del test<span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="testDate"
              rules={{ required: "La fecha es obligatoria" }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start border-foreground bg-transparent text-left font-normal focus:border-transparent ${
                        !field.value ? "text-muted-foreground" : ""
                      }`}
                      aria-invalid={!!errors.testDate}
                    >
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        style={{ width: 16, height: 16 }}
                        className="mr-2 text-muted-foreground"
                      />
                      {field.value
                        ? format(field.value, "dd/MM/yyyy", { locale: es })
                        : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError message={errors.testDate?.message} />
          </div>

          {/* Horario del test */}
          <div className="space-y-2">
            <Label>
              Horario del test
              <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name="startTime"
                rules={{ required: "Selecciona hora de inicio" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.startTime}
                    >
                      <SelectValue placeholder="Hora de inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="endTime"
                rules={{ required: "Selecciona hora final" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.endTime}
                    >
                      <SelectValue placeholder="Hora final" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldError
              message={errors.startTime?.message || errors.endTime?.message}
            />
          </div>

          {/* Sucursal */}
          <div className="space-y-2">
            <Label>
              Sucursal<span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="branch"
              rules={{ required: "Selecciona una sucursal" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.branch}
                  >
                    <SelectValue placeholder="Selecciona una agencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roosevelt">
                      Agencia Calzada Roosevelt
                    </SelectItem>
                    <SelectItem value="yurrita">Agencia Yurrita</SelectItem>
                    <SelectItem value="arrazola">Agencia Arrazola</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.branch?.message} />
          </div>

          {/* Checkbox de aceptación */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="acceptContact"
                rules={{
                  validate: (v) =>
                    v === true || "Debes aceptar ser contactado para continuar",
                }}
                render={({ field }) => (
                  <Checkbox
                    id="accept"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={!!errors.acceptContact}
                  />
                )}
              />
              <Label
                htmlFor="accept"
                className="text-sm font-normal text-muted-foreground"
              >
                Acepto ser contactado por Cofiño usados
              </Label>
            </div>
            <FieldError message={errors.acceptContact?.message} />
          </div>
        </div>

        {/* Action buttons */}
        {step === 0 ? (
          <Button
            type="button"
            variant="dark"
            size="lg"
            className="w-full"
            onClick={handleNext}
          >
            Siguiente
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setStep(0)}
            >
              Anterior
            </Button>
            <Button type="submit" variant="dark" size="lg">
              Finalizar
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
