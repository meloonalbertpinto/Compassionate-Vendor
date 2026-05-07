// ===== APP STATE MACHINE =====
export type AppState = 'IDLE' | 'SHOPPING' | 'PAYMENT' | 'SUCCESS' | 'ALERT';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  category: string;
  rating: 'GREEN' | 'YELLOW' | 'RED';
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  fibre: number;
  serving: string;
  rating: 'GREEN' | 'YELLOW' | 'RED';
  tip: string;
}

export interface FreshnessInfo {
  freshness: number;
  status: 'FRESH' | 'ACCEPTABLE' | 'SPOILED';
  spoilageRatio: number;
  daysLeft: number;
}

export interface InsightData {
  type: 'health' | 'freshness' | null;
  scanning: boolean;
  nutrition?: NutritionInfo;
  freshness?: FreshnessInfo;
  productName?: string;
}

export interface AppStateData {
  state: AppState;
  cart: CartItem[];
  timerActive: boolean;
  timerSeconds: number;
  insight: InsightData;
  notification: string | null;
  scanMessage: string | null;
}

// ===== NUTRITION DATABASE (from backend recognition.py) =====
export const NUTRITION_DB: Record<string, NutritionInfo> = {
  'Fruits': {
    serving: '1 medium piece (182g)',
    calories: 95, protein: 0.5, carbs: 25, sugar: 19, fat: 0.3, fibre: 4.4,
    rating: 'GREEN',
    tip: 'High fibre, natural sugars. Great healthy snack!',
  },
  'Softdrink': {
    serving: '1 can (330ml)',
    calories: 139, protein: 0, carbs: 35, sugar: 35, fat: 0, fibre: 0,
    rating: 'RED',
    tip: 'High in sugar. Consider water or diet alternatives.',
  },
  'Chips_Packet': {
    serving: '1 packet (30g)',
    calories: 152, protein: 2, carbs: 15, sugar: 0.3, fat: 9.5, fibre: 1.2,
    rating: 'YELLOW',
    tip: 'High in fat and salt. Enjoy in moderation.',
  },
  'Salad': {
    serving: '1 bowl (200g)',
    calories: 45, protein: 2, carbs: 8, sugar: 3, fat: 0.5, fibre: 3.5,
    rating: 'GREEN',
    tip: 'Excellent choice! Packed with vitamins and low in calories.',
  },
  'Sandwich': {
    serving: '1 sandwich (150g)',
    calories: 250, protein: 12, carbs: 30, sugar: 4, fat: 8, fibre: 2.5,
    rating: 'YELLOW',
    tip: 'Balanced meal, but watch out for high-calorie sauces.',
  },
  'Pizza': {
    serving: '1 slice (107g)',
    calories: 285, protein: 12, carbs: 36, sugar: 3.5, fat: 10, fibre: 2.5,
    rating: 'YELLOW',
    tip: 'High in calories and salt. Best as an occasional treat.',
  },
  'Burger': {
    serving: '1 burger (226g)',
    calories: 540, protein: 34, carbs: 40, sugar: 9, fat: 27, fibre: 3,
    rating: 'RED',
    tip: 'Very high in calories and fat. Consider a side salad instead of fries.',
  },
  'Milk_Shake': {
    serving: '1 medium (300ml)',
    calories: 350, protein: 8, carbs: 60, sugar: 55, fat: 9, fibre: 0,
    rating: 'RED',
    tip: 'Packed with added sugars. Try a fresh fruit smoothie instead.',
  },
  'Fruit_Salad': {
    serving: '1 bowl (150g)',
    calories: 60, protein: 1, carbs: 15, sugar: 12, fat: 0.2, fibre: 2.5,
    rating: 'GREEN',
    tip: 'Excellent source of vitamins, hydration, and natural energy!',
  },
};

// ===== PRODUCT CATALOG =====
export interface ProductCatalog {
  name: string;
  price: number;
  emoji: string;
  category: string;
  nutritionKey: string;
  rating: 'GREEN' | 'YELLOW' | 'RED';
}

export const PRODUCT_CATALOG: ProductCatalog[] = [
  { name: 'Fresh Apple', price: 25.00, emoji: '🍎', category: 'Fruits', nutritionKey: 'Fruits', rating: 'GREEN' },
  { name: 'Diet Coke', price: 40.00, emoji: '🥤', category: 'Beverage', nutritionKey: 'Softdrink', rating: 'RED' },
  { name: 'Lays Chips', price: 20.00, emoji: '🥔', category: 'Snack', nutritionKey: 'Chips_Packet', rating: 'YELLOW' },
  { name: 'Garden Salad', price: 150.00, emoji: '🥗', category: 'Healthy', nutritionKey: 'Salad', rating: 'GREEN' },
  { name: 'Club Sandwich', price: 120.00, emoji: '🥪', category: 'Meal', nutritionKey: 'Sandwich', rating: 'YELLOW' },
  { name: 'Pepperoni Pizza', price: 250.00, emoji: '🍕', category: 'Meal', nutritionKey: 'Pizza', rating: 'YELLOW' },
  { name: 'Classic Burger', price: 150.00, emoji: '🍔', category: 'Meal', nutritionKey: 'Burger', rating: 'RED' },
  { name: 'Chocolate Shake', price: 180.00, emoji: '🥛', category: 'Beverage', nutritionKey: 'Milk_Shake', rating: 'RED' },
  { name: 'Fruit Bowl', price: 100.00, emoji: '🍇', category: 'Healthy', nutritionKey: 'Fruit_Salad', rating: 'GREEN' },
];

// ===== FRESHNESS SIMULATOR =====
export function simulateFreshness(productName: string): FreshnessInfo {
  // Simulate based on product rating
  const product = PRODUCT_CATALOG.find(p => p.name === productName);
  const isPerishable = ['Fruits', 'Healthy'].includes(product?.category || '');
  
  if (isPerishable) {
    const rand = Math.random();
    if (rand > 0.7) {
      return { freshness: 92 + Math.floor(Math.random() * 8), status: 'FRESH', spoilageRatio: 0.01, daysLeft: 4 + Math.floor(Math.random() * 3) };
    } else if (rand > 0.2) {
      return { freshness: 70 + Math.floor(Math.random() * 20), status: 'ACCEPTABLE', spoilageRatio: 0.04, daysLeft: 1 + Math.floor(Math.random() * 2) };
    } else {
      return { freshness: 20 + Math.floor(Math.random() * 30), status: 'SPOILED', spoilageRatio: 0.15 + Math.random() * 0.3, daysLeft: 0 };
    }
  } else {
    return { freshness: 95 + Math.floor(Math.random() * 5), status: 'FRESH', spoilageRatio: 0.001, daysLeft: 180 + Math.floor(Math.random() * 180) };
  }
}

// ===== ACTION TYPES =====
export type AppAction =
  | { type: 'GO_IDLE' }
  | { type: 'HAND_DETECTED' }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'START_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'TRIGGER_PAYMENT' }
  | { type: 'PAYMENT_SUCCESS' }
  | { type: 'TRIGGER_ALERT' }
  | { type: 'SCAN_HEALTH'; payload: { nutrition: NutritionInfo; productName: string } }
  | { type: 'SCAN_FRESHNESS'; payload: { freshness: FreshnessInfo; productName: string } }
  | { type: 'START_SCANNING'; payload: { type: 'health' | 'freshness' } }
  | { type: 'CLEAR_INSIGHT' }
  | { type: 'SET_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATION' };

// ===== INITIAL STATE =====
export const initialState: AppStateData = {
  state: 'IDLE',
  cart: [],
  timerActive: false,
  timerSeconds: 30,
  insight: { type: null, scanning: false },
  notification: null,
  scanMessage: null,
};

// ===== REDUCER =====
export function appReducer(state: AppStateData, action: AppAction): AppStateData {
  switch (action.type) {
    case 'GO_IDLE':
      return {
        ...initialState,
        state: 'IDLE',
      };

    case 'HAND_DETECTED':
      return {
        ...state,
        state: 'SHOPPING',
        timerActive: false,
        timerSeconds: 30,
        notification: '🖐️ Hand Detected — Welcome!',
      };

    case 'ADD_ITEM': {
      const existing = state.cart.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i),
          notification: `➕ ${action.payload.name} ×${existing.quantity + 1}`,
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
        notification: `✅ ${action.payload.name} Added`,
      };
    }

    case 'REMOVE_ITEM': {
      const item = state.cart.find(i => i.id === action.payload);
      if (!item) return state;
      if (item.quantity > 1) {
        return {
          ...state,
          cart: state.cart.map(i => i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i),
          notification: `➖ ${item.name} removed`,
        };
      }
      return {
        ...state,
        cart: state.cart.filter(i => i.id !== action.payload),
        notification: `🗑️ ${item.name} removed`,
      };
    }

    case 'START_TIMER':
      return { ...state, timerActive: true, timerSeconds: 30 };

    case 'TICK_TIMER': {
      const newSeconds = state.timerSeconds - 1;
      if (newSeconds <= 0) {
        return { ...state, timerActive: false, timerSeconds: 0, state: 'ALERT' };
      }
      return { ...state, timerSeconds: newSeconds };
    }

    case 'TRIGGER_PAYMENT':
      return { ...state, state: 'PAYMENT', timerActive: true, timerSeconds: 30 };

    case 'PAYMENT_SUCCESS':
      return { ...state, state: 'SUCCESS', timerActive: false };

    case 'TRIGGER_ALERT':
      return { ...state, state: 'ALERT', timerActive: false };

    case 'START_SCANNING':
      return {
        ...state,
        insight: { type: action.payload.type, scanning: true },
        notification: action.payload.type === 'health' ? '🔬 Analyzing Nutrition...' : '🧬 Scanning Freshness...',
      };

    case 'SCAN_HEALTH':
      return {
        ...state,
        insight: {
          type: 'health',
          scanning: false,
          nutrition: action.payload.nutrition,
          productName: action.payload.productName,
        },
        notification: '✅ Health Analysis Complete',
      };

    case 'SCAN_FRESHNESS':
      return {
        ...state,
        insight: {
          type: 'freshness',
          scanning: false,
          freshness: action.payload.freshness,
          productName: action.payload.productName,
        },
        notification: action.payload.freshness.status === 'SPOILED' ? '⚠️ Freshness Warning!' : '✅ Freshness Verified',
      };

    case 'CLEAR_INSIGHT':
      return { ...state, insight: { type: null, scanning: false } };

    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };

    default:
      return state;
  }
}
