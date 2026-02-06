'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className='modal-backdrop'
      role='dialog'
      aria-modal='true'
      onClick={(e) => e.target === overlayRef.current && onClose()}
      ref={overlayRef}
    >
      <div className='modal-panel'>
        <div className='modal-header'>
          <h3 className='modal-title'>{title}</h3>
          <button type='button' className='modal-close' onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className='modal-content'>{children}</div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        .modal-panel {
          background: linear-gradient(
            180deg,
            rgba(26, 10, 31, 0.98) 0%,
            rgba(13, 10, 15, 0.98) 100%
          );
          border: 1px solid rgba(139, 115, 85, 0.4);
          width: 100%;
          max-width: 500px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.2s ease;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(139, 115, 85, 0.2);
        }
        .modal-title {
          font-family: 'Cinzel', serif;
          font-size: 1.25rem;
          color: var(--bone);
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          color: var(--aged-silver);
          cursor: pointer;
          transition: color 0.2s;
          padding: 0.25rem;
        }
        .modal-close:hover {
          color: var(--blood-red);
        }
        .modal-content {
          padding: 1.5rem;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}
