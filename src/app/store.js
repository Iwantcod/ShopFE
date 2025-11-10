// src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';          // localStorage

/* slice reducers */
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

/* RTK Query slices */
import { authApi }    from '../features/api/authApi';
import { productApi } from '../features/api/productApi';
import { cartApi }    from '../features/api/cartApi';
import { specApi }    from '../features/api/specApi';
import { reviewApi }  from '../features/api/reviewApi';
import { orderApi }  from '../features/api/orderApi';
import { userApi }    from '../features/api/userApi';
import { sellerApi }  from '../features/api/sellerApi';
import { adminApi }   from '../features/api/adminApi';
import { categoryApi } from '../features/api/categoryApi';
import { benchmarkApi } from '../features/api/benchmarkApi';
import { recommendApi } from '../features/api/recommendApi';

/* 1) root reducer 정의 */
const rootReducer = combineReducers({
  /* 일반 slice */
  auth: authReducer,
  cart: cartReducer,
  /* RTK Query slice */
  [authApi.reducerPath]:    authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]:    cartApi.reducer,
  [specApi.reducerPath]:    specApi.reducer,
  [reviewApi.reducerPath]:  reviewApi.reducer,
  [orderApi.reducerPath]:   orderApi.reducer,
  [userApi.reducerPath]:    userApi.reducer,
  [sellerApi.reducerPath]:  sellerApi.reducer,
  [adminApi.reducerPath]:   adminApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [benchmarkApi.reducerPath]: benchmarkApi.reducer,
  [recommendApi.reducerPath]: recommendApi.reducer,
});

/* 2) redux-persist 설정 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'],         // 세션 만료와 무관하게 유지될 slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* 3) 스토어 생성 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      /* RTK Query 미들웨어 */
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      specApi.middleware,
      reviewApi.middleware,
      orderApi.middleware,
      userApi.middleware,
      sellerApi.middleware,
      adminApi.middleware,
      categoryApi.middleware,
      benchmarkApi.middleware,
      recommendApi.middleware,
    ),
});

/* 4) persistor – <PersistGate>에 전달 */
export const persistor = persistStore(store);
