import {
  Activity,
  Baby,
  Bed,
  Box,
  Cpu,
  Droplets,
  Ear,
  HeartPulse,
  Microscope,
  Package,
  Scale,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Truck,
  Wind,
  Zap
} from "lucide-react";

export function CategoryIcon({ name, className = "w-5 h-5" }: { name?: string; className?: string }) {
  switch (name) {
    case "fa-shield-virus":
    case "fa-ring":
      return <ShieldCheck className={className} aria-hidden="true" />;
    case "fa-bolt":
      return <Zap className={className} aria-hidden="true" />;
    case "fa-display":
      return <Activity className={className} aria-hidden="true" />;
    case "fa-baby":
      return <Baby className={className} aria-hidden="true" />;
    case "fa-scalpel":
    case "fa-scissors":
      return <Scissors className={className} aria-hidden="true" />;
    case "fa-lungs":
      return <Wind className={className} aria-hidden="true" />;
    case "fa-wave-square":
      return <HeartPulse className={className} aria-hidden="true" />;
    case "fa-heart-pulse":
    case "fa-stethoscope":
      return <Stethoscope className={className} aria-hidden="true" />;
    case "fa-weight-scale":
      return <Scale className={className} aria-hidden="true" />;
    case "fa-ear-listen":
      return <Ear className={className} aria-hidden="true" />;
    case "fa-microscope":
      return <Microscope className={className} aria-hidden="true" />;
    case "fa-droplet":
      return <Droplets className={className} aria-hidden="true" />;
    case "fa-truck-medical":
      return <Truck className={className} aria-hidden="true" />;
    case "fa-wheelchair":
    case "fa-bed-pulse":
    case "fa-couch":
      return <Bed className={className} aria-hidden="true" />;
    case "fa-box-tissue":
      return <Package className={className} aria-hidden="true" />;
    case "fa-arrows-turn-to-dots":
      return <Cpu className={className} aria-hidden="true" />;
    default:
      return <Box className={className} aria-hidden="true" />;
  }
}
