import type { ReactNode } from 'react'
import { FaAws, FaDocker, FaGithub, FaLinux } from 'react-icons/fa'
import { SiGrafana, SiHelm, SiKubernetes, SiPrometheus, SiTerraform } from 'react-icons/si'
import { VscAzureDevops } from 'react-icons/vsc'

interface SkillBarProps {
  name: string
  level: number
  color: string
  icon?: string
}

const iconMap: Record<string, ReactNode> = {
  kubernetes: <SiKubernetes />,
  azure: <VscAzureDevops />,
  docker: <FaDocker />,
  helm: <SiHelm />,
  github: <FaGithub />,
  aws: <FaAws />,
  prometheus: <SiPrometheus />,
  grafana: <SiGrafana />,
  terraform: <SiTerraform />,
  linux: <FaLinux />,
}

export function SkillBar({ name, level, color, icon }: SkillBarProps) {
  return (
    <div className="group space-y-3 rounded-2xl border border-white/10 bg-[#0D1117]/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#58A6FF]/30 hover:bg-[#161B22]">
      <div className="flex items-center justify-between gap-3 text-sm text-[#C9D1D9]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#58A6FF] transition group-hover:bg-[#58A6FF]/10">
            {icon ? iconMap[icon] ?? <FaLinux /> : <FaLinux />}
          </span>
          <span>{name}</span>
        </div>
        <span className="text-[#58A6FF]">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-2 rounded-full ${color} transition-all duration-500 group-hover:brightness-110`} style={{ width: `${level}%` }} />
      </div>
    </div>
  )
}
