import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  ariaLabelledBy?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  ariaLabelledBy = 'modal-title',
}) => {
  const modalRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={`bg-surface-900 border border-surface-border w-full ${maxWidth} rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden focus-visible:outline-none`}
      >
        {/* Sticky Accessible Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border shrink-0 bg-surface-900">
          <div className="flex items-center space-x-3 min-w-0">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="min-w-0">
              <h3 id={ariaLabelledBy} className="text-lg font-black text-content-primary truncate">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-content-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-surface-800 transition focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-surface-700">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div className="p-5 border-t border-surface-border bg-surface-900 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
