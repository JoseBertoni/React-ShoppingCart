import { createContext, ReactNode, useContext, useState } from "react";
import { ShoopingCart } from "../components/ShoopingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void 
    getItemQuantity: (id: number ) => number
    increseCarQuantity: (id: number ) => void
    decreseCarQuantity: (id: number ) => void
    removeFromCart: (id: number ) => void
    cartQuantity: number
    cartItems: CartItem[]
  }

const ShoopingCartContext = createContext({} as ShoppingCartContext)

//Obtiene el contexto
export function useShoppingCart(){
    return useContext(ShoopingCartContext)
}



export function ShoppingCartProvider( { children } : ShoppingCartProviderProps ){
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  )

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)
    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
      }
    function increseCarQuantity(id: number){
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
              return [...currItems, { id, quantity: 1 }]
            } else {
              return currItems.map(item => {
                if (item.id === id) {
                  return { ...item, quantity: item.quantity + 1 }
                } else {
                  return item
                }
              })
            }
          })
        }
    function decreseCarQuantity(id:number){
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity === 1) {
              return currItems.filter(item => item.id !== id)
            } else {
              return currItems.map(item => {
                if (item.id === id) {
                  return { ...item, quantity: item.quantity - 1 }
                } else {
                  return item
                }
              })
            }
          })
        }
    function removeFromCart(id: number) {
        setCartItems(currItems => {
          return currItems.filter(item => item.id !== id)
        })
      }
    
    
    return (
    <ShoopingCartContext.Provider value={{getItemQuantity,increseCarQuantity, decreseCarQuantity,removeFromCart, openCart, closeCart,
      cartItems, cartQuantity }}>
        {children}
        <ShoopingCart isOpen = {isOpen}/>
    </ShoopingCartContext.Provider>
    )
}