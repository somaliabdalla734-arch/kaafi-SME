import React, { useState } from "react";
import { Terminal, Database, Cpu, FileCode, Server, BookOpen, Smartphone, Cloud, Key, Check, Copy, ChevronDown, ChevronRight } from "lucide-react";
import {
  SYSTEM_ARCHITECTURE,
  POS_SCHEMA,
  ERD_MARKDOWN,
  BACKEND_SOURCE_CODE,
  FLUTTER_SOURCE_CODE,
  REST_API_DOCUMENTATION,
  DOCKER_CONFIGURATION,
  PRODUCTION_GUIDE
} from "../data/blueprints";

export default function BlueprintsHub() {
  const [activeTab, setActiveTab] = useState<"arch" | "schema" | "erd" | "backend" | "flutter" | "api" | "docker" | "prod">("arch");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const tabs = [
    { id: "arch", name: "System Architecture", icon: Cpu, content: SYSTEM_ARCHITECTURE },
    { id: "schema", name: "PostgreSQL Schema", icon: Database, content: POS_SCHEMA },
    { id: "erd", name: "ER Diagram", icon: BookOpen, content: ERD_MARKDOWN },
    { id: "backend", name: "Backend Source Code", icon: Server, content: BACKEND_SOURCE_CODE },
    { id: "flutter", name: "Flutter Mobile Code", icon: Smartphone, content: FLUTTER_SOURCE_CODE },
    { id: "api", name: "REST API Docs", icon: Terminal, content: REST_API_DOCUMENTATION },
    { id: "docker", name: "Docker Configuration", icon: FileCode, content: DOCKER_CONFIGURATION },
    { id: "prod", name: "Production Deployment", icon: Cloud, content: PRODUCTION_GUIDE },
  ] as const;

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="flex flex-col lg:flex-row h-full rounded-2xl bg-slate-900 text-slate-100 overflow-hidden shadow-2xl border border-slate-800">
      
      {/* Sidebar Nav */}
      <div className="w-full lg:w-72 bg-slate-950 p-4 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-6 px-2">
            <Terminal className="w-5 h-5 text-teal-400 animate-pulse" />
            <div>
              <span className="font-bold text-sm tracking-widest text-slate-200">SME SUITE TECHNICAL BLUEPRINTS</span>
              <p className="text-[10px] text-teal-500 font-mono">v1.0.0-Somali-Stable</p>
            </div>
          </div>
          
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-500/10 text-teal-400 border-l-4 border-teal-400 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 border-t border-slate-800/60 pt-4 px-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] space-y-1 text-slate-400 font-mono">
            <div className="text-teal-400 font-bold mb-1">DEV ENGINE CHECKS:</div>
            <div>DBMS: PostgreSQL v15.x</div>
            <div>API Arch: REST JSON</div>
            <div>Auth: JWT Bearer</div>
            <div>Telecom Gate: EVC Native USSD</div>
          </div>
        </div>
      </div>

      {/* Code Viewer Stage */}
      <div className="flex-1 flex flex-col h-[500px] lg:h-auto min-w-0">
        {/* Stage Header */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="ml-2 font-mono text-[11px] text-slate-400">/sys/kaafi_suite/{currentTab.id}_spec.md</span>
          </div>
          
          <button
            onClick={() => copyToClipboard(currentTab.content, currentTab.id)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-lg text-xs font-mono text-slate-300 transition-all cursor-pointer"
          >
            {copiedSection === currentTab.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw Spec</span>
              </>
            )}
          </button>
        </div>

        {/* Content Render Pane */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs bg-slate-900/95 text-slate-300 scrollbar-thin">
          <div className="whitespace-pre-wrap leading-relaxed max-w-full">
            {currentTab.content.split("\n").map((line, idx) => {
              // Simple parser to make code look nice & highlighted inside current view
              if (line.match(/^(--|#|\/\/)/)) {
                return <span key={idx} className="text-slate-500 block">{line}</span>;
              }
              if (line.startsWith("CREATE TABLE") || line.startsWith("ALTER TABLE") || line.startsWith("CREATE TYPE")) {
                return <span key={idx} className="text-teal-400 font-bold block">{line}</span>;
              }
              if (line.trim().startsWith("PRIMARY KEY") || line.trim().startsWith("FOREIGN KEY") || line.trim().startsWith("REFERENCES")) {
                return <span key={idx} className="text-indigo-400 block">{line}</span>;
              }
              if (line.match(/^export const/) || line.match(/^import/) || line.match(/^const/) || line.match(/^final/) || line.match(/^class /)) {
                return <span key={idx} className="text-amber-400 block">{line}</span>;
              }
              if (line.startsWith("###") || line.startsWith("##")) {
                return <span key={idx} className="text-white font-bold block border-b border-slate-800 pb-1 mt-4 mb-2 text-sm">{line}</span>;
              }
              return <span key={idx} className="block">{line}</span>;
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
