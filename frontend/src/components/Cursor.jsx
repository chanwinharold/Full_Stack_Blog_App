import { useCustomCursor } from '../hooks/useCustomCursor';

function Cursor() {
  const { position, trailing, isHovering } = useCustomCursor();

  return (
    <>
      <div
        className={`cursor-inner ${isHovering ? 'cursor-hover' : ''}`}
        style={{
          transform: `translate(${position.x - 6}px, ${position.y - 6}px)`,
        }}
      />
      <div
        className={`cursor-outer ${isHovering ? 'cursor-hover' : ''}`}
        style={{
          transform: `translate(${trailing.x - 16}px, ${trailing.y - 16}px)`,
        }}
      />
    </>
  );
}

export default Cursor;