import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
  error:   <XCircle size={18} className="text-red-400 shrink-0" />,
  warning: <AlertCircle size={18} className="text-amber-400 shrink-0" />,
  info:    <Info size={18} className="text-blue-400 shrink-0" />,
};

const colors = {
  success: 'border-l-4 border-emerald-500',
  error:   'border-l-4 border-red-500',
  warning: 'border-l-4 border-amber-500',
  info:    'border-l-4 border-blue-500',
};

export default function Toast({ message, type = 'info', onClose }) {
  return (
    <div
      className={`animate-slide-right flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[280px] max-w-sm ${colors[type]}`}
      style={{ background: 'rgba(30,41,59,0.97)', backdropFilter: 'blur(12px)', border: '1px solid #334155' }}
    >
      {icons[type]}
      <p style={{ fontSize: '0.875rem', color: '#F8FAFC', margin: 0, flex: 1, lineHeight: 1.4 }}>{message}</p>
      <button onClick={onClose} className="btn-ghost btn-icon" style={{ padding: '2px' }}>
        <X size={14} style={{ color: '#94A3B8' }} />
      </button>
    </div>
  );
}
