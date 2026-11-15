import { cn } from '@/lib/utils';

/** 24 小时钟表插画：一圈 24 段刻度，标注四个时段 */
export function ClockIllustration({ className }: { className?: string }) {
  const segments = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 240 240" className={cn('h-full w-full', className)} role="img" aria-label="24 小时钟表插画">
      <circle cx="120" cy="120" r="104" fill="#FDFBF7" stroke="#EAE2D3" strokeWidth="1" />
      {segments.map((_, i) => {
        const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const isMain = i % 6 === 0;
        const r1 = isMain ? 84 : 90;
        const r2 = 98;
        const x1 = 120 + Math.cos(angle) * r1;
        const y1 = 120 + Math.sin(angle) * r1;
        const x2 = 120 + Math.cos(angle) * r2;
        const y2 = 120 + Math.sin(angle) * r2;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMain ? '#A8623C' : '#DED2BE'} strokeWidth={isMain ? 2.4 : 1.2} strokeLinecap="round" />;
      })}
      <path d="M120 120 L120 52 A68 68 0 0 1 168 70 Z" fill="#E8C4A3" opacity="0.65" />
      <path d="M120 120 L168 70 A68 68 0 0 1 176 120 Z" fill="#C67C4B" opacity="0.55" />
      <circle cx="120" cy="120" r="6" fill="#2A2724" />
      <line x1="120" y1="120" x2="120" y2="78" stroke="#2A2724" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="120" x2="152" y2="136" stroke="#2A2724" strokeWidth="3" strokeLinecap="round" />
      <text x="120" y="26" textAnchor="middle" className="fill-ink-muted" fontSize="11" fontFamily="sans-serif">00</text>
      <text x="216" y="124" textAnchor="middle" className="fill-ink-muted" fontSize="11" fontFamily="sans-serif">06</text>
      <text x="120" y="222" textAnchor="middle" className="fill-ink-muted" fontSize="11" fontFamily="sans-serif">12</text>
      <text x="24" y="124" textAnchor="middle" className="fill-ink-muted" fontSize="11" fontFamily="sans-serif">18</text>
    </svg>
  );
}

/** 早晨到夜晚的生活场景带：用色块与图标表现一天流转 */
export function DayJourneyIllustration({ className }: { className?: string }) {
  const stops = [
    { label: '清晨', sub: '唤醒', color: '#E8C4A3' },
    { label: '上午', sub: '专注', color: '#C67C4B' },
    { label: '正午', sub: '休整', color: '#D9A075' },
    { label: '下午', sub: '协作', color: '#A8623C' },
    { label: '傍晚', sub: '舒缓', color: '#8A4E2F' },
    { label: '深夜', sub: '恢复', color: '#33513F' },
  ];
  return (
    <div className={cn('w-full', className)} role="img" aria-label="从清晨到深夜的一天生活场景">
      <div className="relative flex items-stretch justify-between gap-1">
        <div className="absolute left-4 right-4 top-5 h-px bg-paper-300" />
        {stops.map((stop) => (
          <div key={stop.label} className="relative z-10 flex flex-1 flex-col items-center text-center">
            <div className="mb-2 h-10 w-10 rounded-full border-4 border-paper-50 shadow-soft" style={{ background: stop.color }} />
            <span className="font-serif text-xs font-semibold text-ink sm:text-sm">{stop.label}</span>
            <span className="text-[10px] text-ink-faint">{stop.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 艾森豪威尔矩阵四象限图 */
export function EisenhowerMatrix({ className }: { className?: string }) {
  const cells = [
    { title: '立即做', desc: '重要且紧急', color: '#F4E2D1', text: '#8A4E2F' },
    { title: '计划做', desc: '重要不紧急', color: '#E7EDE8', text: '#33513F' },
    { title: '委托做', desc: '紧急不重要', color: '#F3EEE3', text: '#A8623C' },
    { title: '少做或不做', desc: '不重要不紧急', color: '#EAE2D3', text: '#7A736A' },
  ];
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)} role="img" aria-label="艾森豪威尔矩阵四象限">
      {cells.map((c) => (
        <div key={c.title} className="rounded-lg p-4" style={{ background: c.color }}>
          <p className="font-serif text-sm font-bold" style={{ color: c.text }}>{c.title}</p>
          <p className="mt-1 text-[11px]" style={{ color: c.text, opacity: 0.8 }}>{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

/** GTD 工作流图 */
export function GtdFlowIllustration({ className }: { className?: string }) {
  const steps = ['捕获', '厘清', '组织', '回顾', '执行'];
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} role="img" aria-label="GTD 五步工作流">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-caramel-100 font-serif text-sm font-bold text-caramel-600">
            {s}
          </div>
          {i < steps.length - 1 && <span className="text-ink-faint">→</span>}
        </div>
      ))}
    </div>
  );
}

/** 番茄工作法流程环 */
export function PomodoroFlowIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 180" className={cn('h-full w-full', className)} role="img" aria-label="番茄工作法流程：专注25分钟，短休息5分钟，四次后长休息">
      <rect x="20" y="55" width="86" height="70" rx="10" fill="#F4E2D1" stroke="#D9A075" />
      <text x="63" y="88" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8A4E2F" fontFamily="sans-serif">专注</text>
      <text x="63" y="106" textAnchor="middle" fontSize="11" fill="#8A4E2F" fontFamily="sans-serif">25 分钟</text>
      <path d="M112 90 L140 90" stroke="#A8623C" strokeWidth="2" markerEnd="url(#arrow)" />
      <rect x="148" y="55" width="86" height="70" rx="10" fill="#E7EDE8" stroke="#9DBBA6" />
      <text x="191" y="88" textAnchor="middle" fontSize="13" fontWeight="700" fill="#33513F" fontFamily="sans-serif">休息</text>
      <text x="191" y="106" textAnchor="middle" fontSize="11" fill="#33513F" fontFamily="sans-serif">5 分钟</text>
      <path d="M191 130 Q191 155 63 155 Q40 155 40 130" fill="none" stroke="#DED2BE" strokeWidth="2" strokeDasharray="4 4" />
      <text x="120" y="172" textAnchor="middle" fontSize="10" fill="#7A736A" fontFamily="sans-serif">循环四次后长休息 15–30 分钟</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#A8623C" />
        </marker>
      </defs>
    </svg>
  );
}

/** 注意力与精力曲线示意图 */
export function EnergyCurveIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 140" className={cn('h-full w-full', className)} role="img" aria-label="一天中的精力曲线示意：上午高峰、午后回落、傍晚小高峰">
      <line x1="20" y1="120" x2="300" y2="120" stroke="#DED2BE" strokeWidth="1" />
      <line x1="20" y1="20" x2="20" y2="120" stroke="#DED2BE" strokeWidth="1" />
      <path d="M20 90 C60 40 90 30 120 42 C150 54 160 92 190 96 C220 100 240 66 270 62 C285 60 295 78 300 88" fill="none" stroke="#C67C4B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="42" r="5" fill="#A8623C" />
      <circle cx="270" cy="62" r="4" fill="#33513F" />
      <text x="20" y="136" fontSize="10" fill="#7A736A" fontFamily="sans-serif">6:00</text>
      <text x="150" y="136" textAnchor="middle" fontSize="10" fill="#7A736A" fontFamily="sans-serif">14:00</text>
      <text x="300" y="136" textAnchor="end" fontSize="10" fill="#7A736A" fontFamily="sans-serif">22:00</text>
    </svg>
  );
}
