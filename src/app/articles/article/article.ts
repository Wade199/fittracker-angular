export class Article {
  constructor(
    public id: number,
    public libelle: string,
    public quantity: number,
    public price: number
  ) {}
}

export const ARTICLES: Article[] = [
  new Article(1, 'Banane', 5, 1.0),
  new Article(2, 'Pomme', 12, 2.0),
  new Article(3, 'Livre', 10, 5.0),
  new Article(4, 'Stylo', 20, 1.5),
  new Article(5, 'Cahier', 8, 3.2),
];
