import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Users, Plus, FileText, Search, Star, 
  ChevronRight, CheckCircle, XCircle, Clock, LayoutDashboard, 
  Settings, Bot, Sparkles, AlertCircle, X, LogOut, Lock, Mail, 
  User, ShieldCheck, Key, UploadCloud, File, ExternalLink, Globe, Target,
  Inbox, Send, GripVertical
} from 'lucide-react';

// --- LOGOTIPO CUSTOMIZADO ---
const BrandLogo = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="24" fill="url(#brandGrad)" />
    <path d="M25 70V30H42C58 30 65 38 65 50C65 58 60 63 52 66C62 68 67 75 67 80V80H48V68H40V80H25Z" fill="white"/>
    <circle cx="75" cy="25" r="14" fill="#F472B6" />
    <path d="M75 18L77 26L85 28L77 30L75 38L73 30L65 28L73 26L75 18Z" fill="white" />
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6D28D9" /> {/* Violet 700 */}
        <stop offset="1" stopColor="#BE185D" /> {/* Pink 700 */}
      </linearGradient>
    </defs>
  </svg>
);

// --- FUNÇÃO DA API GEMINI ---
const analyzeResumeWithAI = async (resumeText, jobDesc, apiKey) => {
  if (!apiKey || apiKey.trim() === "") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: Math.floor(Math.random() * 31) + 70, 
          skills: ["Comunicação", "Visão Sistêmica", "Adaptabilidade", "Gestão de Tempo", "Trabalho em Equipe"],
          summary: "Análise simulada (Mock): O candidato possui um perfil aderente. Adicione uma chave API real nas Configurações para análise profunda."
        });
      }, 2000);
    });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Atue como um recrutador sênior de RH. Analise o seguinte currículo em relação à descrição da vaga. Vaga: ${jobDesc} | Currículo: ${resumeText}` }] }],
        systemInstruction: { parts: [{ text: "Você deve retornar estritamente um JSON com a seguinte estrutura: { 'score': numero de 0 a 100, 'skills': array de exatas 5 strings com as principais habilidades encontradas, 'summary': string curta com o resumo da compatibilidade }." }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              score: { type: "INTEGER" },
              skills: { type: "ARRAY", items: { type: "STRING" } },
              summary: { type: "STRING" }
            },
            required: ["score", "skills", "summary"]
          }
        }
      })
    });

    if (!response.ok) throw new Error('Falha na API');
    const data = await response.json();
    return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (error) {
    return {
      score: 50,
      skills: ["Erro API", "Verifique", "Chave", "-", "-"],
      summary: "Falha de conexão com a IA. Verifique sua chave API."
    };
  }
};

const initialJobs = [
  { id: 1, title: "Desenvolvedor(a) Front-end Sênior", department: "Tecnologia", status: "Aberta", description: "Sólida experiência em React e UI/UX." },
  { id: 2, title: "Analista de Marketing Digital", department: "Marketing", status: "Aberta", description: "Experiência com tráfego pago e SEO." }
];

const initialCandidates = [
  { id: 101, jobId: 1, name: "Carlos Silva", stage: "novo", score: 85, skills: ["React", "UI/UX", "JavaScript", "Figma", "Git"], summary: "Forte aderência técnica." }
];

const STAGES = [
  { id: 'novo', title: 'Novos Recebidos', color: 'bg-violet-100 text-violet-800', border: 'border-violet-300' },
  { id: 'analise', title: 'Em Análise', color: 'bg-fuchsia-100 text-fuchsia-800', border: 'border-fuchsia-300' },
  { id: 'entrevista', title: 'Entrevistas', color: 'bg-pink-100 text-pink-800', border: 'border-pink-300' },
  { id: 'aprovado', title: 'Aprovados', color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-300' },
  { id: 'reprovado', title: 'Reprovados', color: 'bg-rose-100 text-rose-800', border: 'border-rose-300' }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', role: 'Recrutador(a)' });
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [jobs, setJobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userApiKey, setUserApiKey] = useState('');
  
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Novos estados para o E-mail e Inbox
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', message: '' });
  const [inboxEmails, setInboxEmails] = useState([
    { id: 1, from: 'Catho Empresas', subject: 'Novo Candidato: João Pedro', preview: 'João Pedro aplicou para a vaga Desenvolvedor(a) Front-end Sênior...', date: '10:30', isNew: true, imported: false, candidateMock: { name: 'João Pedro', skills: ['React', 'CSS', 'HTML', 'Figma', 'UX'], summary: 'Candidato com boa base visual.', score: 75, jobId: 1 } },
    { id: 2, from: 'Empregare', subject: 'Nova Candidata: Sofia Costa', preview: 'Sofia Costa aplicou para Analista de Marketing Digital...', date: 'Ontem', isNew: false, imported: false, candidateMock: { name: 'Sofia Costa', skills: ['SEO', 'Google Ads', 'Copywriting', 'Analytics', 'RD Station'], summary: 'Forte perfil analítico e criativo.', score: 88, jobId: 2 } }
  ]);

  const getInitials = (name) => {
    if (!name) return 'HR';
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const AuthScreen = () => {
    const handleAuth = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const name = authMode === 'register' ? formData.get('name') : email.split('@')[0];
      
      setCurrentUser({
        name: authMode === 'register' ? name : (name.charAt(0).toUpperCase() + name.slice(1)),
        email: email,
        role: 'Recrutador(a) IA'
      });
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
    };

    return (
      <div className="min-h-screen flex bg-gray-50">
        <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0A0F24]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-fuchsia-600 rounded-full blur-[100px] opacity-40"></div>
          
          <div className="relative z-10 w-full p-16 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo size={48} />
              <h1 className="font-black text-4xl text-white tracking-tight">NexHR<span className="text-fuchsia-500">.ia</span></h1>
            </div>

            <div className="max-w-md">
              <h2 className="text-5xl font-black text-white mb-6 leading-[1.1]">
                A revolução não exige código.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Exige visão.</span>
              </h2>
              <p className="text-violet-200 text-lg leading-relaxed mb-8 font-light">
                Transforme o recrutamento. Integre plataformas No Code com o poder do Vibecode para triagens automatizadas em segundos.
              </p>
              <div className="inline-flex items-center gap-3 text-white font-medium bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <ShieldCheck size={24} className="text-emerald-400" />
                Projeto MVP - Módulo 3
              </div>
            </div>
            
            <div className="text-violet-400/50 text-sm font-medium">© 2026 NexHR Technologies</div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                {authMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h2>
              <p className="text-gray-500">
                {authMode === 'login' ? 'Acesse o painel inteligente.' : 'Inicie no recrutamento do futuro.'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                  <div className="relative">
                    <User size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                    <input required name="name" type="text" placeholder="Ex: Maria Eduarda" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-transparent focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all font-medium" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Corporativo</label>
                <div className="relative">
                  <Mail size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                  <input required name="email" type="email" placeholder="voce@empresa.com" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-transparent focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                  <input required name="password" type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-transparent focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all font-medium" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                {authMode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
                <ChevronRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                {authMode === 'login' ? 'Ainda não tem acesso?' : 'Já possui uma conta?'}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="ml-2 font-bold text-violet-600 hover:text-fuchsia-600 transition-colors">
                  {authMode === 'login' ? 'Criar conta' : 'Fazer login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <aside className="w-72 shrink-0 bg-[#0B1120] text-white flex flex-col h-full z-20 border-r border-white/10 shadow-2xl relative">
      <div className="p-6 flex items-center gap-4 shrink-0">
        <BrandLogo size={36} />
        <div>
          <h1 className="font-black text-2xl tracking-tight text-white">NexHR</h1>
          <p className="text-fuchsia-400 text-[10px] font-black tracking-widest uppercase">Vibecode MVP</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto custom-scrollbar">
        <button onClick={() => { setSelectedJob(null); setCurrentScreen('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${currentScreen === 'dashboard' || currentScreen === 'job_details' ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button onClick={() => { setSelectedJob(null); setCurrentScreen('talentos'); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${currentScreen === 'talentos' ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
          <Users size={20} /> Banco de Talentos
        </button>
        <button onClick={() => { setSelectedJob(null); setCurrentScreen('inbox'); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-bold ${currentScreen === 'inbox' ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
          <div className="flex items-center gap-3"><Inbox size={20} /> Caixa de Entrada</div>
          {inboxEmails.filter(e => e.isNew && !e.imported).length > 0 && (
            <span className="bg-fuchsia-600 text-white text-[10px] px-2 py-0.5 rounded-full">{inboxEmails.filter(e => e.isNew && !e.imported).length}</span>
          )}
        </button>
        <button onClick={() => { setSelectedJob(null); setCurrentScreen('configuracoes'); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${currentScreen === 'configuracoes' ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
          <Settings size={20} /> Configurações
        </button>
      </nav>

      <div className="p-5 border-t border-white/10 bg-black/20 shrink-0">
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-black text-sm shadow-lg">
              {getInitials(currentUser.name)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate max-w-[100px]">{currentUser.name}</p>
              <p className="text-[10px] text-fuchsia-300 font-bold uppercase tracking-wider truncate">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="p-2.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );

  const DashboardScreen = () => (
    <div className="p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Painel de Vagas</h2>
          <p className="text-gray-500 mt-2 font-medium">Gerencie suas oportunidades e analise talentos via IA.</p>
        </div>
        <button onClick={() => setIsAddJobModalOpen(true)} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-violet-500/30 transition-all transform hover:-translate-y-1">
          <Plus size={20} /> Nova Vaga
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => {
          const jobCandidates = candidates.filter(c => c.jobId === job.id);
          return (
            <div key={job.id} onClick={() => { setSelectedJob(job); setCurrentScreen('job_details'); }} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-all cursor-pointer overflow-hidden group flex flex-col h-full relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="p-8 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">{job.status}</span>
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-sm">
                    <Briefcase size={22} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{job.title}</h3>
                <p className="text-violet-600 text-xs font-black mb-4 uppercase tracking-wider">{job.department}</p>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 font-medium">{job.description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={18} className="text-fuchsia-500" />
                    <span className="text-sm font-bold">{jobCandidates.length} inscritos</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-fuchsia-600 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TalentPoolScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCandidates = candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    return (
      <div className="p-10 max-w-7xl mx-auto animate-fade-in-up">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Users className="text-violet-600" size={36} /> Banco de Talentos
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Busque por candidatos de todas as vagas cadastradas.</p>
          </div>
          <div className="relative w-full md:w-[400px]">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
            <input type="text" placeholder="Buscar por nome, React, Liderança..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium shadow-sm" />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest font-black">
                <th className="p-5 pl-8">Candidato</th>
                <th className="p-5">Vaga Aplicada</th>
                <th className="p-5">Match IA</th>
                <th className="p-5">Top Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCandidates.map(candidate => {
                const job = jobs.find(j => j.id === candidate.jobId);
                return (
                  <tr key={candidate.id} className="hover:bg-violet-50/50 transition-colors cursor-pointer" onClick={() => setSelectedCandidate(candidate)}>
                    <td className="p-5 pl-8 font-bold text-gray-900">{candidate.name}</td>
                    <td className="p-5 text-sm font-semibold text-gray-600">{job ? job.title : 'Vaga Removida'}</td>
                    <td className="p-5">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border ${candidate.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : candidate.score >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        <Sparkles size={14} /> {candidate.score}%
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2 flex-wrap">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase shadow-sm">{skill}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCandidates.length === 0 && (
                <tr><td colSpan="4" className="p-10 text-center text-gray-500 font-medium">Nenhum talento encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const SettingsScreen = () => {
    const [tempKey, setTempKey] = useState(userApiKey);
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
      e.preventDefault();
      setUserApiKey(tempKey);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    };

    const externalLinks = [
      { name: "LinkedIn Recruiter", url: "https://www.linkedin.com/talent", color: "bg-[#0A66C2]", icon: "IN" },
      { name: "Catho Empresas", url: "https://www.catho.com.br/empresa", color: "bg-[#E6007E]", icon: "CA" },
      { name: "Empregare", url: "https://empregare.com/pt-br", color: "bg-[#00B050]", icon: "EM" },
      { name: "Gupy", url: "https://www.gupy.io/", color: "bg-[#2563EB]", icon: "GU" },
    ];

    return (
      <div className="p-10 max-w-4xl mx-auto animate-fade-in-up">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3 mb-10">
          <Settings className="text-violet-600" size={36} /> Configurações
        </h2>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex gap-4 items-start">
            <div className="bg-violet-100 p-3 rounded-2xl"><Key className="text-violet-600" size={24}/></div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Motor de Inteligência Artificial</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed">Insira a chave da API (Gemini) para análises reais de currículos. Sem ela, o sistema rodará em "Modo Simulação" (ideal para apresentações).</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div>
              <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="Cole sua API Key aqui..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-mono text-sm bg-gray-50" />
            </div>
            <div className="flex justify-between items-center">
              {saved ? <span className="text-emerald-600 font-bold flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl"><CheckCircle size={18}/> Salvo com sucesso!</span> : <span/>}
              <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg">Salvar Chave</button>
            </div>
          </form>
        </div>

        {/* Integrações / Links Externos */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex gap-4 items-start">
            <div className="bg-fuchsia-100 p-3 rounded-2xl"><Globe className="text-fuchsia-600" size={24}/></div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Integração de Publicação de Vagas</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">Acesse rapidamente as maiores plataformas de emprego para divulgar suas vagas abertas.</p>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {externalLinks.map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-violet-300 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-black text-lg ${link.color}`}>{link.icon}</div>
                  <span className="font-bold text-gray-800">{link.name}</span>
                </div>
                <ExternalLink size={18} className="text-gray-300 group-hover:text-violet-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const InboxScreen = () => {
    const handleImport = (email) => {
      setCandidates([...candidates, { id: Date.now(), jobId: email.candidateMock.jobId, name: email.candidateMock.name, stage: 'novo', score: email.candidateMock.score, skills: email.candidateMock.skills, summary: email.candidateMock.summary }]);
      setInboxEmails(inboxEmails.map(e => e.id === email.id ? { ...e, isNew: false, imported: true } : e));
    };

    return (
      <div className="h-full flex flex-col animate-fade-in-up">
        <div className="px-10 py-8 shrink-0">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Inbox className="text-violet-600" size={36} /> Integração de E-mail
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Candidatos recebidos via parceiros (Catho, Gupy, etc) aparecem aqui.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {inboxEmails.map(email => (
              <div key={email.id} className={`p-6 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors ${email.isNew && !email.imported ? 'bg-violet-50/50' : ''}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${email.isNew && !email.imported ? 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-transparent'}`}></div>
                  <div>
                    <h4 className={`text-lg ${email.isNew && !email.imported ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{email.subject}</h4>
                    <p className="text-sm font-medium text-gray-500 mt-1">{email.preview}</p>
                    <span className="text-xs font-bold text-violet-600 mt-2 block">{email.from}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-bold text-gray-400">{email.date}</span>
                  {!email.imported ? (
                    <button onClick={() => handleImport(email)} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all whitespace-nowrap">
                      Importar para Vaga
                    </button>
                  ) : (
                    <span className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-200 whitespace-nowrap">
                      <CheckCircle size={16}/> Importado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const JobDetailsScreen = () => {
    const jobCandidates = candidates.filter(c => c.jobId === selectedJob.id);

    // Funções Drag and Drop Nativas
    const handleDragStart = (e, candidateId) => {
      e.dataTransfer.setData('candidateId', candidateId);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
      e.preventDefault(); // Necessário para permitir o drop
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, stageId) => {
      e.preventDefault();
      const candidateId = e.dataTransfer.getData('candidateId');
      if (candidateId) {
        setCandidates(candidates.map(c => c.id === parseInt(candidateId) ? { ...c, stage: stageId } : c));
      }
    };

    return (
      <div className="h-full w-full flex flex-col bg-gray-50/50 overflow-hidden animate-fade-in-up">
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center z-10 shadow-sm shrink-0">
          <div>
            <button onClick={() => setCurrentScreen('dashboard')} className="text-gray-400 hover:text-violet-600 text-sm font-bold flex items-center gap-1 mb-1 transition-colors">
              <ChevronRight size={16} className="transform rotate-180" /> Voltar
            </button>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              {selectedJob.title}
            </h2>
          </div>
          <button onClick={() => setIsAddCandidateModalOpen(true)} className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1">
            <Plus size={18} /> Adicionar Candidato
          </button>
        </div>

        {/* min-h-0 é a classe crucial aqui para impedir que a tela seja empurrada para baixo */}
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden p-6">
          <div className="flex gap-5 h-full min-w-max pb-2">
            {STAGES.map(stage => {
              const stageCandidates = jobCandidates.filter(c => c.stage === stage.id);
              return (
                <div 
                  key={stage.id} 
                  className="w-[300px] flex flex-col h-full bg-gray-100/60 rounded-2xl p-2 border border-gray-200/60 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className={`px-4 py-3 rounded-xl border-t-4 ${stage.border} bg-white shadow-sm flex justify-between items-center mb-3 shrink-0 pointer-events-none`}>
                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">{stage.title}</h3>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${stage.color}`}>{stageCandidates.length}</span>
                  </div>
                  
                  {/* min-h-0 garante que o scroll interno funcione sem esticar a tela inteira */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pb-2 px-1 custom-scrollbar">
                    {stageCandidates.map(candidate => (
                      <div 
                        key={candidate.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate.id)}
                        onClick={() => setSelectedCandidate(candidate)} 
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-violet-400 hover:shadow-md cursor-grab active:cursor-grabbing transition-all relative overflow-hidden group"
                      >
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${candidate.score >= 80 ? 'bg-emerald-500' : candidate.score >= 60 ? 'bg-yellow-500' : 'bg-rose-500'}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2 pointer-events-none">
                          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 line-clamp-1">
                            <GripVertical size={14} className="text-gray-300 group-hover:text-violet-500 shrink-0" />
                            {candidate.name}
                          </h4>
                          <div className={`flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 ${candidate.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : candidate.score >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            <Sparkles size={10}/> {candidate.score}%
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 pl-2 pointer-events-none">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-gray-50 text-gray-600 border border-gray-200 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide truncate max-w-[80px]">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const AddJobModal = () => {
    if (!isAddJobModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-2xl font-black text-gray-900">Nova Vaga</h3>
            <button onClick={() => setIsAddJobModalOpen(false)} className="text-gray-400 hover:bg-gray-200 p-2 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            setJobs([...jobs, { id: Date.now(), title: fd.get('title'), department: fd.get('department'), description: fd.get('description'), status: 'Aberta' }]);
            setIsAddJobModalOpen(false);
          }} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Título da Vaga</label>
              <input required name="title" type="text" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Departamento</label>
              <input required name="department" type="text" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição / Requisitos (Base para IA)</label>
              <textarea required name="description" rows="4" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-medium resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg mt-4">Criar Vaga</button>
          </form>
        </div>
      </div>
    );
  };

  const AddCandidateModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    if (!isAddCandidateModalOpen) return null;

    // Lógica para Upload de Arquivo Local
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setFileName(file.name);
      
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => setResumeText(event.target.result);
        reader.readAsText(file);
      } else {
        // Fallback para PDFs/Docs (Simulação para MVP)
        setResumeText(`[Documento: ${file.name}]\n\n*Texto extraído do documento local.*\nO candidato possui vasta experiência na área, com foco em habilidades técnicas e interpessoais. Trabalhou em projetos colaborativos e desenvolveu soluções escaláveis...`);
      }
    };

    const handleAnalyze = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const aiResult = await analyzeResumeWithAI(resumeText, selectedJob.description, userApiKey);
      setCandidates([...candidates, { id: Date.now(), jobId: selectedJob.id, name, stage: 'novo', score: aiResult.score, skills: aiResult.skills, summary: aiResult.summary }]);
      setIsLoading(false);
      setIsAddCandidateModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md"><Sparkles size={24} /></div>
              <div>
                <h3 className="text-2xl font-black">Triagem Inteligente</h3>
                <p className="text-violet-100 text-sm font-medium">Vaga: {selectedJob?.title}</p>
              </div>
            </div>
            {!isLoading && <button onClick={() => setIsAddCandidateModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>}
          </div>
          
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 border-4 border-violet-100 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-fuchsia-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                <Bot size={40} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-fuchsia-600" />
              </div>
              <h4 className="text-2xl font-black text-gray-900">A IA está avaliando...</h4>
              <p className="text-gray-500 mt-2 font-medium">Lendo currículo e cruzando com requisitos.</p>
            </div>
          ) : (
            <form onSubmit={handleAnalyze} className="p-8 space-y-6">
              {!userApiKey && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-yellow-200">
                  <AlertCircle size={20} className="text-yellow-600 shrink-0"/> Modo Simulação Ativo (MVP).
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Candidato</label>
                <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-medium" />
              </div>
              
              {/* Upload Dropzone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Anexar Currículo Local</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-violet-300 bg-violet-50 hover:bg-violet-100 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" className="hidden" />
                  <UploadCloud size={32} className="text-violet-500 mb-2" />
                  <p className="text-violet-900 font-bold text-sm">Clique para enviar ou arraste o arquivo</p>
                  <p className="text-violet-500 text-xs mt-1">Suporta PDF, DOCX, TXT</p>
                </div>
                {fileName && (
                  <div className="mt-3 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-200">
                    <File size={16}/> {fileName} anexado e processado.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Texto do Currículo (Edição)</label>
                <textarea required value={resumeText} onChange={e => setResumeText(e.target.value)} rows="4" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-mono text-xs resize-none" placeholder="O texto do arquivo aparecerá aqui ou pode ser colado manualmente..."></textarea>
              </div>
              
              <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-4 rounded-xl font-black shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2">
                <Sparkles size={20} /> Iniciar Análise IA
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  const CandidateDetailsModal = () => {
    if (!selectedCandidate) return null;
    const isHigh = selectedCandidate.score >= 80;
    const isMed = selectedCandidate.score >= 60 && selectedCandidate.score < 80;

    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[50] p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <h3 className="text-3xl font-black text-gray-900">{selectedCandidate.name}</h3>
              <p className="text-gray-500 font-medium mt-1">Vaga: <span className="text-violet-600 font-bold">{jobs.find(j => j.id === selectedCandidate.jobId)?.title}</span></p>
            </div>
            <button onClick={() => setSelectedCandidate(null)} className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-full transition-colors"><X size={20} /></button>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className={`p-6 rounded-3xl border-2 mb-8 flex items-center gap-8 ${isHigh ? 'bg-emerald-50 border-emerald-100' : isMed ? 'bg-yellow-50 border-yellow-100' : 'bg-rose-50 border-rose-100'}`}>
              <div className="relative shrink-0 bg-white p-4 rounded-2xl shadow-sm">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset={251 - (251 * selectedCandidate.score) / 100} className={`transition-all duration-1000 ${isHigh ? 'text-emerald-500' : isMed ? 'text-yellow-500' : 'text-rose-500'}`} />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-black">
                  <span className={isHigh ? 'text-emerald-600' : isMed ? 'text-yellow-600' : 'text-rose-600'}>{selectedCandidate.score}%</span>
                </div>
              </div>
              <div>
                <h4 className="font-black text-xl flex items-center gap-2 mb-2 text-gray-900"><Target size={24} className="text-fuchsia-600"/> Resumo do Motor IA</h4>
                <p className="text-gray-700 font-medium leading-relaxed">{selectedCandidate.summary}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2"><Star size={20} className="text-yellow-500" /> Habilidades Chave</h4>
              <div className="flex flex-wrap gap-3">
                {selectedCandidate.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-900 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md"><CheckCircle size={16} className="text-fuchsia-400" /> {skill}</span>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-gray-100 pt-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-gray-900">Avançar no Pipeline</h4>
                <button 
                  onClick={() => {
                    setEmailData({ to: selectedCandidate.name, subject: `Atualização de Processo Seletivo - ${jobs.find(j => j.id === selectedCandidate.jobId)?.title}`, message: `Olá ${selectedCandidate.name.split(' ')[0]},\n\nGostaríamos de falar sobre sua candidatura...` });
                    setIsEmailModalOpen(true);
                  }}
                  className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                  <Mail size={16}/> Enviar E-mail
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STAGES.map(stage => (
                  <button key={stage.id} onClick={() => {
                    setCandidates(candidates.map(c => c.id === selectedCandidate.id ? { ...c, stage: stage.id } : c));
                    setSelectedCandidate(null);
                  }} disabled={selectedCandidate.stage === stage.id} className={`px-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedCandidate.stage === stage.id ? 'bg-gray-50 text-gray-400 border-gray-200 opacity-50' : `bg-white hover:${stage.color.split(' ')[0]} ${stage.color.split(' ')[1]} border-gray-100 hover:border-transparent hover:shadow-md`}`}>
                    Mover: {stage.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmailModal = () => {
    const [sent, setSent] = useState(false);
    if (!isEmailModalOpen) return null;

    const handleSend = (e) => {
      e.preventDefault();
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setIsEmailModalOpen(false);
      }, 2500);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-2xl"><Send size={24} /></div>
              <h3 className="text-2xl font-black">Comunicação</h3>
            </div>
            {!sent && <button onClick={() => setIsEmailModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>}
          </div>
          
          {sent ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-900">E-mail Enviado!</h4>
              <p className="text-gray-500 mt-2 font-medium">O candidato receberá a mensagem em instantes em sua caixa de entrada.</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Para (Candidato)</label>
                <input disabled value={emailData.to} className="w-full px-5 py-3.5 bg-gray-100 rounded-xl outline-none font-medium text-gray-500 border border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assunto</label>
                <input required value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 font-medium border border-gray-200 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem</label>
                <textarea required value={emailData.message} onChange={e => setEmailData({...emailData, message: e.target.value})} rows="5" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 font-medium border border-gray-200 resize-none transition-all"></textarea>
              </div>
              <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-black shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all">
                <Send size={18} /> Enviar Mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) return <AuthScreen />;

  return (
    <div className="h-screen w-screen bg-gray-50/50 flex overflow-hidden font-sans text-gray-900 selection:bg-fuchsia-200">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
      <Sidebar />
      <main className="flex-1 h-full flex flex-col overflow-hidden relative">
        {currentScreen === 'dashboard' && <div className="flex-1 overflow-y-auto w-full"><DashboardScreen /></div>}
        {currentScreen === 'job_details' && <div className="flex-1 overflow-hidden w-full"><JobDetailsScreen /></div>}
        {currentScreen === 'talentos' && <div className="flex-1 overflow-y-auto w-full"><TalentPoolScreen /></div>}
        {currentScreen === 'configuracoes' && <div className="flex-1 overflow-y-auto w-full"><SettingsScreen /></div>}
        {currentScreen === 'inbox' && <div className="flex-1 overflow-hidden w-full"><InboxScreen /></div>}
      </main>
      <AddJobModal />
      <AddCandidateModal />
      <CandidateDetailsModal />
      <EmailModal />
    </div>
  );
}
