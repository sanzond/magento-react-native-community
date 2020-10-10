/**
 * @flow
 * Created by Dima Portenko on 10.10.2020
 */
import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../apollo/queries/getCategories';

type Props = {|
  categoryId: string,
|};

type Result = {|
  getCategories(): void,
  loading: boolean,
  error: ?string,
|};

export const useCategories = (props: Props): Result => {
  const [
    getCategories,
    { called, loading, data, error },
  ] = useLazyQuery(GET_CATEGORIES, { variables: { id: props.categoryId } });

  useEffect(() => {
    if (data) {
      console.log({ data });
    }
    if (error) {
      console.log({ error });
    }
  }, [data]);

  return {
    getCategories,
    loading,
    error,
  };
};