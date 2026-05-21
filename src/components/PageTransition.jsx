import { useLocation } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useRef } from 'react'

export function PageTransition({ children }) {
  const location = useLocation()
  const nodeRef = useRef(null)

  return (
    <>
      <style>{`
        .page-enter {
          opacity: 0;
          transform: translateY(16px);
        }
        .page-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 3500ms ease, transform 350ms ease;
        }
        .page-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .page-exit-active {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 280ms ease, transform 280ms ease;
        }
      `}</style>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={350}
          classNames="page"
          unmountOnExit
        >
          <div ref={nodeRef}>
            {children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  )
}