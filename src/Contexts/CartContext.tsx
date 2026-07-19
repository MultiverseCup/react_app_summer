import { createContext, useEffect, useReducer, type ReactNode } from "react";
import type { MenuItem } from "../types/menu";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  orderActive: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ACTIVATE_ORDER" }
  | { type: "COMPLETE_ORDER" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.orderActive) return state;
      const existing = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      if (state.orderActive) return state;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      if (state.orderActive) return state;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    case "CLEAR_CART":
      return { items: [], orderActive: false };
    case "ACTIVATE_ORDER":
      return { ...state, orderActive: true };
    case "COMPLETE_ORDER":
      return { items: [], orderActive: false };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  orderActive: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  activateOrder: () => void;
  completeOrder: () => void;
  totalCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    { items: [], orderActive: false },
    (initial) => {
      const savedCart = localStorage.getItem("cart");
      const items = savedCart ? JSON.parse(savedCart) : [];
      const orderActive = localStorage.getItem("orderActive") === "true";
      return { items, orderActive };
    },
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    localStorage.setItem("orderActive", String(state.orderActive));
  }, [state.orderActive]);

  const addItem = (item: MenuItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const activateOrder = () => dispatch({ type: "ACTIVATE_ORDER" });
  const completeOrder = () => dispatch({ type: "COMPLETE_ORDER" });

  const totalCount = state.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  );
  const totalPrice = state.items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        orderActive: state.orderActive,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        activateOrder,
        completeOrder,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
