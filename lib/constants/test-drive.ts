export const CONTACT_METHOD_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada telefónica" },
  { value: "correo", label: "Correo electrónico" },
];

export const TEST_DRIVE_TYPE_OPTIONS = [
  { value: "presencial", label: "Presencial" },
  { value: "domicilio", label: "A domicilio" },
];

export const TEST_DRIVE_START_TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export const TEST_DRIVE_END_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const TEST_DRIVE_BRANCHES = [
  { value: "roosevelt", label: "Agencia Calzada Roosevelt" },
  { value: "yurrita", label: "Agencia Yurrita" },
  { value: "arrazola", label: "Agencia Arrazola" },
];

export const TEST_DRIVE_STEP_1_FIELDS = [
  "name",
  "email",
  "phoneCode",
  "phone",
  "contactMethod",
] as const;
