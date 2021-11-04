export interface Categories {
  id: string,
  title: string,
  sub_categories?: SubCategories[],
}

export interface SubCategories {
  id: string,
  id_category: string,
  title: string
}