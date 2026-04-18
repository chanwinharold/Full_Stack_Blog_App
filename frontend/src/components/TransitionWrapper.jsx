import { useEffect, useRef, useState } from 'react';

function TransitionWrapper({ children, keyProp }) {
  const prevKeyRef = useRef(keyProp);
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    if (keyProp !== prevKeyRef.current) {
      setPhase('exit');
      
      const timer = setTimeout(() => {
        setPhase('enter');
        prevKeyRef.current = keyProp;
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [keyProp]);

  return (
    <div className={`${phase === 'exit' ? 'page-exit' : ''} ${phase === 'enter' ? 'page-enter' : ''}`}>
      {children}
    </div>
  );
}

export default TransitionWrapper;