import { useSyncExternalStore } from 'react';

// Custom lightweight replica of Zustand to bypass broken NPM global cache installations
function create<T>(createState: any) {
  let state: T;
  const listeners = new Set<() => void>();
  
  const setState = (partial: any) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = Object.assign({}, state, nextState);
    listeners.forEach((listener) => listener());
  };
  
  const getState = () => state;
  
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  state = createState(setState, getState);
  
  const useStore = (selector?: (s: T) => any) => {
    return useSyncExternalStore(
      subscribe,
      () => (selector ? selector(state) : state),
      () => (selector ? selector(state) : state)
    );
  };

  useStore.getState = getState;
  return useStore as any;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  getFormattedTotal: () => string;
}

export const useCartStore = create<CartState>((set: any, get: any) => ({
  isOpen: false,
  items: [
    { 
      id: '1', 
      name: 'A4 Copy Paper', 
      price: 45000, 
      quantity: 1, 
      image: '/logo/SUPPLY/1. A4 Copy Paper.jpeg'
    }
  ],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (newItem: any) => set((state: any) => {
    const existing = state.items.find((i: any) => i.id === newItem.id);
    if (existing) {
      return {
        isOpen: true,
        items: state.items.map((i: any) => 
          i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        )
      };
    }
    return { isOpen: true, items: [...state.items, newItem] };
  }),
  removeItem: (id: any) => set((state: any) => ({ items: state.items.filter((i: any) => i.id !== id) })),
  getFormattedTotal: () => {
    const total = get().items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
    return `TZS ${total.toLocaleString()}`;
  }
}));
