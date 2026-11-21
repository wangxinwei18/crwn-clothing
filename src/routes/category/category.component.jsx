import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';

import Spinner from '../../components/spinner/spinner.component';

import { useParams } from 'react-router-dom';

import {
  selectCategoriesMap,
  selectCategoriesIsLoading,
} from '../../store/categories/category.selector';

import './category.styles.scss';

const Category = () => {
  const { category } = useParams();
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const products = categoriesMap[category];

  return (
    <Fragment>
      <h2 className="category-title">{category.toUpperCase()}</h2>
      <div className="category-container">
        {isLoading ? (
          <Spinner />
        ) : (
          products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </Fragment>
  );
};

export default Category;
