import React from 'react';
import { 
  Layers, 
  TableProperties, 
  PenTool, 
  Database, 
  ShieldCheck, 
  FileCode2, 
  Target, 
  HardDrive, 
  Network,
  Edit3,
  BookOpen,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-5 h-5" />,
  TableProperties: <TableProperties className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  FileCode2: <FileCode2 className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  HardDrive: <HardDrive className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  Edit3: <Edit3 className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />
};

export const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const icon = iconMap[name] || <Database className="w-5 h-5" />;
  if (className && React.isValidElement<{ className?: string }>(icon)) {
    const existingClass = icon.props.className || '';
    return React.cloneElement(icon, {
      className: `${existingClass} ${className}`.trim()
    });
  }
  return <>{icon}</>;
};
