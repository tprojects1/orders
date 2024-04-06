import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const Routing = ({
  defaultView
}) => {

  function CatchAllRoute({ type = 'view' }) {

    const location = useLocation();

    let Output = lazy(() => import(`./${location.pathname.slice(1)}/`));

    // Dynamically import the component
    if (type == 'component') Output = lazy(() => import(`./${location.pathname.slice(1)}/component`));

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Output />
      </Suspense>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<CatchAllRoute />} />
          <Route path="/components/*" element={<CatchAllRoute type='component' />} />
          <Route
            path="/"
            element={
              typeof defaultView === 'string'
                ? lazy(() => import(`./views/${defaultView}`))
                : defaultView
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;