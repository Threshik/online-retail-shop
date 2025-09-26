// models are used to define the data structure of the application
// it can be created either using classes or interfaces
// in class you will be defining the private fields, contructors and the getter and setters

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  image: string;
}
