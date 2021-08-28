import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  children: JSX.Element;
  isOpen?: boolean;
  setIsOpen: () => void;
}

const Modal = ({ children, setIsOpen, isOpen = false }: ModalProps) => {

  const [state, setState] = useState({ modalStatus: isOpen })
  
  useEffect(() => {
    setState({ modalStatus: isOpen })
  }, [isOpen, setState])
  
    const { modalStatus } = state;

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
