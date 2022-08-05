import React from 'react';

import {  Product as ProductComponent, ProductType } from '../components/product';

const PRODUCT: ProductType = {
  images: [
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1616606297366-bfcfc625f052?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1614889980346-b704e91bd7d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1488654715439-fbf461f0eb8d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601196465457-6cdba190c937?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1616329211519-49a02b6e0e82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80',
  ],
  productName: 'SCOTT SPARK RC 900 SL AXS BIKE',
  productNumber: 'SCS280491',
  description:
    'Országúti kerékpár kifejezetten versenyre és triatlon felhasználásra tervezve. Aerodinamikus vázgeometria. Karbon HMX F01 Aero vázzal és villával. Dura Ace Di2 elektromos vezérlésű váltószettel és hidraulikus tárcsafékkel.',
  stockState: 'Raktáron',
  prise: '205 999 Ft',
};

function Product() {
  return (
          <ProductComponent product={PRODUCT} />
  );
}

export default Product;
