/**
 * @flow
 * Created by Dima Portenko on 04.01.2021
 */
import React, { useState, useEffect } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { showMessage } from 'react-native-flash-message';
import { CREATE_CART } from '../../apollo/mutations/createCart';
import type { CreateCartResponseType } from '../../apollo/mutations/createCart';
import { useDispatch, useSelector } from 'react-redux';
import { getCartId, setCartId } from '../../redux/cart';
import { ADD_PRODUCTS_TO_CART } from '../../apollo/mutations/addProductsToCart';
import type { AddProductsToCartResponseType } from '../../apollo/mutations/addProductsToCart';

type Props = {||};

type Result = {|
  cartId: string | null,
  addToCart: (sku: string, name: string, quantity?: number) => Promise<void>,
  addProductLoading: boolean,
|};

export const useCart = (): Result => {
  const cartId = useSelector(getCartId);
  const dispatch = useDispatch();

  const [fetchCartId] = useMutation(CREATE_CART);
  const [addProductsToCart, { loading: addProductLoading }] = useMutation(ADD_PRODUCTS_TO_CART);

  const createCart = async () => {
    try {
      const {
        data,
        errors,
      }: {
        data: CreateCartResponseType,
        errors: ApolloError[],
      } = await fetchCartId();

      dispatch(setCartId(data.cartId));
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (sku: string, name: string, quantity: number = 1) => {
    try {
      const {
        data,
        errors,
      }: {
        data: AddProductsToCartResponseType,
        errors: ApolloError[],
      } = await addProductsToCart({
        variables: {
          cartId,
          sku,
          quantity,
        },
      });

      if (data.addProductsToCart.user_errors.length > 0) {
        showMessage({
          message: 'Error',
          description: data.addProductsToCart.user_errors[0].message,
          type: 'danger',
        });
      } else {
        showMessage({
          message: 'Success',
          description: `${name} is added to the cart.`,
          type: 'success',
        });
      }

      console.log(data, errors);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!cartId) {
      createCart();
    }
  }, []); // eslint-disable-line

  return {
    cartId,
    addProductLoading,
    addToCart,
  };
};
