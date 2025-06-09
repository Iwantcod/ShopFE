import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { productApi } from '../src/features/api/productApi';

export function setupApiStore(api) {
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (gDM) => gDM().concat(api.middleware),
  });
  return store;
}

export function renderWithStore(ui, store) {
  return render(<Provider store={store}>{ui}</Provider>);
}
