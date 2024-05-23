import { createContext, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products'
export const CartContext = createContext({
    items: [],
    addItemToCart: () => { },
    updateItemQuantity: () => { }
})

function shoppingCartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.Id
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.Id);
            updatedItems.push({
                id: action.Id,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            ...state, // not need becuase we have only one value in state . it need in case of multiple values.
            items: updatedItems,
        };
    }

    if (action.type === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...state,
            items: updatedItems,
        };

    }

    return state

    // if more actions 
    // if (action.type === 'UPDATE_ITEM') {
    //     //... update state accordingly
    // }



}

export default function CartContextProvider({ children }) {
    const [shoppingCartstate, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: [],
    }
    );

    // UseReducer replaced useState
    // const [shoppingCart, setShoppingCart] = useState({ u
    //     items: [],
    // });

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM',
            Id: id
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_ITEM',
            payload: {
                productId,
                amount
            }
        })
    }


    const ctxValue = {
        items: shoppingCartstate.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,

    }

    return (
        <CartContext.Provider value={ctxValue}>
            {children}
        </CartContext.Provider>
    )

}