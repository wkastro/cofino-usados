import {
  Car,
  LayoutDashboard,
  PanelsTopLeftIcon,
  Settings2Icon,
  TagsIcon,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard Vehiculos",
    items: [
      {
        title: "Inicio",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Vehículos",
        url: "/dashboard/vehiculos",
        icon: Car,
      },
      {
        title: "Especificaciones",
        url: "/dashboard/especificaciones",
        icon: Settings2Icon,
      },
      {
        title: "Clasificación",
        url: "/dashboard/clasificacion",
        icon: TagsIcon,
      },
    ],
  },
  {
    id: 2,
    label: "Dashboard Páginas",
    items: [
      {
        title: "Inicio",
        url: "/dashboard/inicio",
        icon: PanelsTopLeftIcon,
      },
      {
        title: "Detalle Vehículo",
        url: "/dashboard/detalle-vehiculo",
        icon: PanelsTopLeftIcon,
      },
      {
        title: "Intercambiar",
        url: "/dashboard/intercambiar",
        icon: PanelsTopLeftIcon,
      }
    ],
  },
];
