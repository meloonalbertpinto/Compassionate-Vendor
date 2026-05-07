import { useEffect, useRef } from 'react';
import type { AppAction, AppStateData } from '../store';
import { PRODUCT_CATALOG } from '../store';

const BACKEND_URL = 'http://localhost:5000';

export function useBackendSync(state: AppStateData, dispatch: React.Dispatch<AppAction>) {
  const lastStatusRef = useRef<string>(state.state);
  const lastProductRef = useRef<string | null>(null);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/data`);
        const data = await response.json();

        // 1. Handle Status Transitions
        if (data.system_status !== lastStatusRef.current) {
          console.log('Backend Status Change:', data.system_status);
          
          if (data.system_status === 'SHOPPING' || data.system_status === 'HAND_IN' || data.system_status === 'INTERACTION') {
            if (state.state === 'IDLE') dispatch({ type: 'HAND_DETECTED' });
          } else if (data.system_status === 'PAYMENT_PENDING') {
            dispatch({ type: 'TRIGGER_PAYMENT' });
          } else if (data.system_status === 'PAID') {
            dispatch({ type: 'PAYMENT_SUCCESS' });
          } else if (data.system_status === 'IDLE' && state.state !== 'IDLE') {
            dispatch({ type: 'GO_IDLE' });
          }
          
          lastStatusRef.current = data.system_status;
        }

        // 2. Handle Product Detection
        if (data.last_product && data.last_product !== lastProductRef.current) {
          console.log('New Product Detected by AI:', data.last_product);
          lastProductRef.current = data.last_product;
          
          // Find the product in our catalog
          const product = PRODUCT_CATALOG.find(p => 
            p.name.toLowerCase() === data.last_product.toLowerCase() || 
            p.nutritionKey.toLowerCase() === data.last_product.toLowerCase()
          );

          if (product) {
            dispatch({ 
              type: 'ADD_ITEM', 
              payload: {
                id: product.nutritionKey,
                name: product.name,
                price: product.price,
                quantity: 1,
                emoji: product.emoji,
                category: product.category,
                rating: product.rating
              } 
            });
            dispatch({ type: 'SET_NOTIFICATION', payload: `✨ AI Detected: ${product.name}` });
          }
        }

      } catch (error) {
        // console.error('Sync error:', error);
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, [dispatch, state.state]);
}
